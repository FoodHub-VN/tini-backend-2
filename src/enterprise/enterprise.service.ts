import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException, Query,
  Scope
} from "@nestjs/common";
import {
  ENTERPRISE_MODEL,
  NOTIFICATION_MODEL, PURCHASE_TEMP_MODEL,
  SCHEDULE_HISTORY_MODEL,
  SCHEDULE_MODEL,
  SERVICE_MODEL, USER_MODEL
} from "../database/database.constants";
import { Enterprise, EnterpriseModel } from "../database/model/enterprise.model";
import { catchError, from, map, mergeMap, Observable, throwError } from "rxjs";
import { EnterpriseRegisterDto } from "./dto/enterprise-register.dto";
import { EnterPriseNewServiceDataDto } from "./dto/enterprise-new-service.dto";
import { Service, ServiceModel } from "../database/model/service.model";
import { REQUEST } from "@nestjs/core";
import { AuthenticatedRequest } from "../auth/interface/authenticated-request.interface";
import { EnterprisePrincipal } from "../auth/interface/enterprise-principal";
import { BServiceService } from "../b-service/b-service.service";
import { Notification, NotificationModel } from "../database/model/notification.model";
import { Types } from "mongoose";
import { ScheduleModel } from "../database/model/schedule";
import { NotificationGateway } from "../notification/notification.gateway";
import { NotiType } from "../shared/NotiType.type";
import { ScheduleHistoryModel } from "../database/model/schedule-history.model";
import { FileUploaded } from "../upload/interface/upload.interface";
import { FileUploadService } from "../upload/upload.service";
import { EnterpriseEditDto } from "./dto/enterprise-edit.dto";
import { UserModel } from "../database/model/user.model";
import { parseInt } from "lodash";
import moment from "moment";
import querystring from "qs";
import crypto from "crypto";
import { Premium } from "../shared/premium";
import path from "path";
import * as fs from "fs";
import { ConfigService } from "@nestjs/config";
import { PurchaseTempModel } from "../database/model/purchase-temp";

@Injectable({scope: Scope.REQUEST})
export class EnterpriseService {
  private premiumConfig: Record<string, Premium>;
  constructor(
    @Inject(ENTERPRISE_MODEL) private enterpriseModel: EnterpriseModel,
    @Inject(SERVICE_MODEL) private serviceModel: ServiceModel,
    @Inject(BServiceService) private bService: BServiceService,
    @Inject(REQUEST) private req: AuthenticatedRequest<EnterprisePrincipal>,
    @Inject(NOTIFICATION_MODEL) private notiModel: NotificationModel,
    @Inject(SCHEDULE_MODEL) private scheduleModel: ScheduleModel,
    @Inject(SCHEDULE_HISTORY_MODEL) private scheduleHistoryModel: ScheduleHistoryModel,
    @Inject(USER_MODEL)private userModel: UserModel,
    private uploadService: FileUploadService,
    private notiSocket: NotificationGateway,
    private readonly configService: ConfigService,
    @Inject(PURCHASE_TEMP_MODEL) private purchaseTempModel: PurchaseTempModel
  ) {
    var path = require("path");
    this.premiumConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "../../res/json/premium.json"), 'utf-8'));
  }

  findEnterpriseByName(name: string): Observable<Enterprise> {
    return from(this.enterpriseModel.findOne({ username: name }).exec());
  }

  findEnterpriseWithPassByName(name: string): Observable<Enterprise> {
    return from(this.enterpriseModel.findOne({ username: name }).select("+password").exec());
  }
  existEnterpriseByName(name: string): Observable<boolean> {
    return from(this.enterpriseModel.exists({ username: name }));
  }

  existEnterpriseByMail(mail: string): Observable<boolean> {
    return from(this.enterpriseModel.exists({ email: mail }));
  }

  register(data: EnterpriseRegisterDto): Observable<Enterprise> {
    return from(this.enterpriseModel.create({ ...data }));
  }

  createNewService(data: EnterPriseNewServiceDataDto, images: Array<Express.Multer.File> | undefined): Observable<any> {
    // return from(this.serviceModel.create({...data}));
    return from(this.bService.createService(data, images));
  }

  getInfo(): Observable<Enterprise> {
    return from(this.enterpriseModel.findOne({ _id: this.req.user.id }, null, {lean: true}).exec());
  }

  getAllService(): Observable<Service[]> {
    return from(this.serviceModel.find({ enterprise: this.req.user.id }).populate("category").exec());
  }

  async getAllNotifications(): Promise<Notification[]>{
    try{
      const service = await this.serviceModel.find({enterprise: this.req.user.id}).exec();
      const notiModel = await this.notiModel.find({service: {$in: service.map(s=>s._id)}}, null, {lean: true})
        .populate(["service", "user"])
        .exec()
      return notiModel;
    }catch (e){
      throw e;
    }
  }

  async readNoti(notiId: string): Promise<any>{
    if(!Types.ObjectId.isValid(notiId)){
      throw new NotFoundException("Notification not found!");
    }
    try{
      const notiModel: any = await this.notiModel.findOne({_id: notiId}).populate("service").exec();
      if(!notiModel || notiModel.service.enterprise!=this.req.user.id){
        throw new NotFoundException("Notification not found!");
      }
      await notiModel.updateOne({hadRead: true}).exec();
      return true;
    }
    catch (e) {
      throw e;
    }
  }

  async readAllNoti(): Promise<any>{
    try {
      const services = await this.serviceModel.find({ enterprise: this.req.user.id }).exec();
      await this.notiModel.updateMany({ service: { $in: services.map(s => s._id) } }, { hadRead: true }).exec();
      return true;
    } catch (e) {
      throw e;
    }
  }
  
  async buyPremium(enterprise: string, idOffer: string): Promise<any>{
    try{
      const model = await this.enterpriseModel.findOne({_id: Types.ObjectId(enterprise)}).exec();
      if(parseInt(model.premium) >= parseInt(idOffer)){
        throw new ConflictException("Premium is lower than previous");
      }
      await model.update({premium: idOffer}).exec();
      return true;
    } catch (e) {
      throw e;
    }
  }

  async getSchedules(): Promise<any>{
    try{
      const services = await this.serviceModel.find({enterprise: this.req.user.id}).exec();
      const schedule = await this.scheduleModel.find({service: {$in: services.map(s => s.id)}}).populate(["user","service"]).exec();
      return schedule;
    }catch (e) {
      throw e;
    }
  }

  async deleteSchedule(id: string): Promise<any>{
    if(!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Schedule not found!");
    }
    try{
      const schedule = await this.scheduleModel.findOne({_id: id}).exec();
      if(!schedule) throw new NotFoundException("Schedule not found!");
      const newNoti = await this.notiModel.create({
        user: schedule.user,
        service: schedule.service,
        hadRead: false,
        type: NotiType.ENTERPRISE_DELETE_SCHEDULE,
        date: Date.now()
      })
      const newNotiDetail = await newNoti.populate([{ path: "user" }, { path: "service" }]).execPopulate();
      this.notiSocket.sendNotificationToClient(this.req.user.id, newNotiDetail);
      this.notiSocket.sendNotificationToClient(schedule.user.toString(), newNotiDetail);
      await schedule.remove();
      return true;
    }
    catch (e){
      throw e;
    }
  }
  async doneSchedule(id: string): Promise<any>{
    if(!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Schedule not found!");
    }
    try{
      const schedule = await this.scheduleModel.findOne({_id: id}).exec();
      if(!schedule) throw new NotFoundException("Schedule not found!");
      const newNoti = await this.notiModel.create({
        user: schedule.user,
        service: schedule.service,
        hadRead: false,
        type: NotiType.ENTERPRISE_DONE_SCHEDULE,
        date: Date.now()
      })
      const newNotiDetail = await newNoti.populate([{ path: "user" }, { path: "service" }]).execPopulate();
      this.notiSocket.sendNotificationToClient(this.req.user.id, newNotiDetail);
      this.notiSocket.sendNotificationToClient(schedule.user.toString(), newNotiDetail);
      await schedule.remove();
      await this.scheduleHistoryModel.create({
        user: schedule.user,
        service: schedule.service,
        date: Date.now(),
        hasRating: false
      })
      return true;
    }
    catch (e){
      throw e;
    }
  }
  uploadAvatar(file: Express.Multer.File): Observable<FileUploaded> {
    return from(this.enterpriseModel.findOne({ _id: this.req.user.id }).exec())
      .pipe(
        mergeMap((user) => {
          if (user) {
            if (user.avatar) {
              return from(this.uploadService.delete(user.avatar.key))
                .pipe(
                  mergeMap((deleted) => {
                    return from(this.uploadService.upload(file))
                      .pipe(
                        mergeMap((fileUploaded) => {
                          return from(user.updateOne({ avatar: fileUploaded }, { new: true }).exec())
                            .pipe(
                              map(updated => {
                                if (updated.ok == 1) {
                                  return fileUploaded;
                                }
                                throw new BadRequestException("Something wrong!");
                              })
                            );
                        })
                      );
                  })
                );
            } else {
              return from(this.uploadService.upload(file))
                .pipe(
                  mergeMap((fileUploaded) => {
                    return from(user.updateOne({ avatar: fileUploaded }, { new: true }).exec())
                      .pipe(
                        map(updated => {
                          if (updated.ok == 1) {
                            return fileUploaded;
                          }
                          throw new BadRequestException("Something wrong!");
                        })
                      );
                  })
                );
            }
          } else {
            throwError(() => new Error());
          }
        }),
        catchError((err, cau) => {
          console.log(err);
          throw new BadRequestException({ err });
        })
      );
  }

  async updateProfile(data: EnterpriseEditDto): Promise<Enterprise>{
    try{
      const model = await this.enterpriseModel.findOne({_id: this.req.user.id}).exec();
      if(model){
        await model.update({...data}).exec();
        return model;
      }
      else{
        throw new NotFoundException("Enterprise not found!");
      }
    }
    catch (e) {
      throw e;
    }
  }
  async getOverviewAnalysis(): Promise<any>{
    try{
      //số lượng dịch vụ
      const service = await this.serviceModel.find({enterprise: this.req.user.id}).exec();

      //so nguoi theo doi

      const numOfFollow = await this.userModel.aggregate([{
        $unwind: "$followedService"
      },{
        $match:{
          followedService: {$in: service.map(e=>e._id)}
        }
      }]).exec()

      //so lan giao dich
      const numOfDoneSchedule = await this.scheduleHistoryModel.count({service: {$in: service.map(e=>e._id)}})
      return {numOfService: service.length, numOfFollow: numOfFollow.length, numOfDoneSchedule: numOfDoneSchedule}
    }
    catch (e){
      throw e;
    }
  }
  async getPaymentUrl(offerId: string): Promise<any>{
    const oldOffer = (await this.enterpriseModel.findOne({_id: this.req.user.id}).exec()).premium;
    if(oldOffer && parseInt(oldOffer)>=parseInt(offerId)){
      throw new BadRequestException("New offer is bad than previous");
    }
    console.log(offerId);
    let offer = this.premiumConfig[offerId];
    if(!offer) throw new NotFoundException("Offer not found");
    var tmnCode = this.configService.get<string>('TMN_CODE');
    var secretKey = this.configService.get<string>('HASH_SECRET');
    var vnpUrl = this.configService.get<string>('VNP_URL');
    var returnUrl = this.configService.get<string>("RETURN_URL");
    var moment = require("moment");
    var dateCreate = moment().format("YYYYMMDDHHmmss");
    var orderId = this.req.user.id +'_'+ moment().format("YYYYMMDDHHmmss")+'_'+offerId;

    var orderInfo = "THanh toan";
    var locale = "vn";
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    // vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = offer.price*100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = this.req.ip;
    vnp_Params['vnp_CreateDate'] = dateCreate;
    vnp_Params = Object.keys(vnp_Params).sort().reduce(function (result, key) {
      result[key] = vnp_Params[key];
      return result;
    }, {});

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: true, format:"RFC1738" });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true, format:"RFC1738" });

    // await this.purchaseTempModel.create({
    //   enterprise: this.req.user.id,
    //   premium: offerId,
    //   code: orderId
    // });
    return vnpUrl;
  }

  async handleConfirmTransaction( amount: number,
                                  transactionNo: number,
                                  responseCode: number,
                                  orderId: string): Promise<any>{
    try{
      var offset = orderId.split("_");
      if(offset.length<3) return;
      var clientId = offset[0];
      var offerId = offset[2];
      if(responseCode == 0){
        await this.buyPremium(clientId, offerId);
        this.notiSocket.sendNotificationToClient(clientId, {success: true, offerId});
      }
      else{
        this.notiSocket.sendNotificationToClient(clientId, {success: false});
      }
    }
    catch (e) {
      throw e;
    }

  }
}
