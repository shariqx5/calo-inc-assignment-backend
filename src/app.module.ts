import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module';
import { SocketModule } from './common/socket/socket.module';
import { BullModule } from "@nestjs/bullmq"

@Module({
  imports: [
    JobsModule,
    SocketModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: 6379
      }
    })
  ],
})
export class AppModule {}
