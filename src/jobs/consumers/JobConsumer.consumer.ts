import { Processor, WorkerHost } from "@nestjs/bullmq"
import { Inject } from "@nestjs/common"
import { Job } from "bullmq"
import { JobMapper } from "../job.mapper"
import { JobsService } from "../jobs.service"

@Processor("jobs", { concurrency: 3 })
export class JobConsumer extends WorkerHost {
  
  @Inject()
  private readonly jobsService: JobsService

  @Inject()
  private readonly jobMapper: JobMapper

  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`consuming job with ${job.id} & data:  `)
    console.log(job.data)

    try {
      const jobModel = this.jobMapper.fromQueueJobToJobModel(job.data)
      await this.jobsService.processQueuedJob(jobModel)
    } catch(error) {
      console.log("Error", error)

      // throwing again for visibility purpose
      throw error
    }
  }
}