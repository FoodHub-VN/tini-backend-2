import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8080, {cors: true})
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;
  afterInit(server: any): any {
    // console.log(server)
  }

  handleConnection(client: Socket, ...args: any[]): any {
    console.log("connectedn")
  }

  handleDisconnect(client: any): any {
    console.log("disconnect");
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
