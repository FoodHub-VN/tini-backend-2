import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer, WsException
} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard, JwtEnterpriseAuthGuard } from "../auth/guard/jwt-auth.guard";
import { JwtService } from "@nestjs/jwt";
import { log } from "util";
import { EnterprisePrincipal } from "../auth/interface/enterprise-principal";
import { Notification } from "../database/model/notification.model";

@WebSocketGateway(8080, {cors: true})
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  private mapDevice : Map<string, string>;
  constructor(private jwtService: JwtService) {
    this.mapDevice = new Map<string, string>();

  }
  @WebSocketServer()
  server: Server;
  afterInit(server: any): any {
    // console.log(server)
  }

  handleConnection(client: Socket, ...args: any[]): any {
    const token = client.handshake.auth.bearer;
    if(!token){
      return;
    }
    this.jwtService.verifyAsync(token)
      .then((res: EnterprisePrincipal)=>{
        console.log("connected", res.id);
        this.mapDevice.set(res.id.toString(), client.id);
      })
      .catch((e)=>{
        console.log(e)
        return;
      })

  }

  handleDisconnect(client: Socket): any {
    const token = client.handshake.auth.bearer;
    if(!token){
      return;
    }
    this.jwtService.verifyAsync(token)
      .then((res: EnterprisePrincipal)=>{
        console.log("disconnected", res.id);
        this.mapDevice.delete(res.id.toString());
      })
      .catch((e)=>{
        console.log(e)
        return;
      })
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  sendNotificationToClient(enterpriseId: string, noti: any){
    const socketId = this.mapDevice.get(enterpriseId.toString());
    if(!socketId){
      return;
    }
    this.server.to(socketId).emit("hello", noti);
  }
}
