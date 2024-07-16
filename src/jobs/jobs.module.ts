import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { FilesModule } from 'src/common/files/files.module';
import { JobMapper } from './job.mapper';
import { BullModule } from "@nestjs/bullmq";
import { JobConsumer } from 'src/jobs/consumers/JobConsumer.consumer';
import { SocketService } from 'src/common/socket/socket.service';
import { NotifyUserJobResolved } from 'src/jobs/consumers/UserJobResolved.consumer';

@Module({
  imports: [
    FilesModule,
    BullModule.registerQueue(
      {
        name: "jobs",
        defaultJobOptions: {
          backoff: {
            type: 'fixed',
            delay: 5000
          }
        }
      }, 
      {
        name: "notify-user-job-resolved",
        defaultJobOptions: {
          attempts: 10,
          backoff: {
            type: 'fixed',
            delay: 10000
          }
        }
      }
    )
  ],
  controllers: [JobsController],
  providers: [
    JobsService, 
    JobMapper, 
    JobConsumer, 
    SocketService,
    NotifyUserJobResolved
  ]
})
export class JobsModule {}
