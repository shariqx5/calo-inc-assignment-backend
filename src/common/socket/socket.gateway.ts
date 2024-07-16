import { Inject } from "@nestjs/common";
import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io"
import { SocketService } from "./socket.service";

@WebSocketGateway({
  cors: {
    origin: "*"
  },
  transports: ["websocket", "polling"]
})
export class SocketGateway implements 
OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server

  @Inject()
  socketService: SocketService

  afterInit(server: any) {
    console.log("gateway has been initialized")
  }

  handleConnection(client: Socket, ...args: any[]) {
    const { sockets } = this.server.sockets;

    this.socketService.setConnectedClient(client.id , client)

    console.log(`Client id: ${client.id} connected`);
    console.log(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.socketService.removeConnectedClient()
    console.log(`Cliend id:${client.id} disconnected`);
  }
}

