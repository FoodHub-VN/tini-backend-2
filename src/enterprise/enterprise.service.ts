import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import {
  ENTERPRISE_MODEL,
  NOTIFICATION_MODEL,
  SCHEDULE_HISTORY_MODEL,
  SCHEDULE_MODEL,
  SERVICE_MODEL
} from "../database/database.constants";
import { Enterprise, EnterpriseModel } from "../database/model/enterprise.model";
import { from, Observable } from "rxjs";
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

@Injectable({scope: Scope.REQUEST})
export class EnterpriseService {
  constructor(
    @Inject(ENTERPRISE_MODEL) private enterpriseModel: EnterpriseModel,
    @Inject(SERVICE_MODEL) private serviceModel: ServiceModel,
    @Inject(BServiceService) private bService: BServiceService,
    @Inject(REQUEST) private req: AuthenticatedRequest<EnterprisePrincipal>,
    @Inject(NOTIFICATION_MODEL) private notiModel: NotificationModel,
    @Inject(SCHEDULE_MODEL) private scheduleModel: ScheduleModel,
    @Inject(SCHEDULE_HISTORY_MODEL) private scheduleHistoryModel: ScheduleHistoryModel,
    private notiSocket: NotificationGateway
  ) {
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
  
  async buyPremium(id: string): Promise<any>{
    try{
      const model = await this.enterpriseModel.findOne({_id: this.req.user.id}).exec();
      if(parseInt(model.premium) >= parseInt(id)){
        throw new ConflictException("Premium is lower than previous");
      }
      await model.update({premium: id}).exec();
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
}
