import { Global, Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Global()
@Module({
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
