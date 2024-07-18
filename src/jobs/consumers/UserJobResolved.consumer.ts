import { Processor, WorkerHost } from "@nestjs/bullmq"
import { Job } from "bullmq"
import { Inject } from "@nestjs/common"
import { SocketService } from "src/common/socket/socket.service"

@Processor("notify-user-job-resolved")
export class NotifyUserJobResolved extends WorkerHost {

  static readonly UPDATE_TO_JOBS_EVENT = "update-on-jobs"
  
  @Inject()
  private readonly socketService: SocketService

  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`processing notify-user-job-resolved queue item ${job.data.id}`)
    try {
      await this.socketService.sendMessageToCient(NotifyUserJobResolved.UPDATE_TO_JOBS_EVENT, true, job.data)
    } catch(error) {
      console.log(error)
      throw error
    }
  }
}