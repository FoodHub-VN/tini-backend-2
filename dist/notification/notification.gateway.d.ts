import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { JwtService } from "@nestjs/jwt";
export declare class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private mapDevice;
    constructor(jwtService: JwtService);
    server: Server;
    afterInit(server: any): any;
    handleConnection(client: Socket, ...args: any[]): any;
    handleDisconnect(client: Socket): any;
    handleMessage(client: any, payload: any): string;
    sendNotificationToClient(enterpriseId: string, noti: any): void;
}
