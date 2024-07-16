import { Injectable } from "@nestjs/common";
import { CreateJobDTO } from "./dto/create-job.dto";
import { GetJobDTO } from "./dto/get-job-dto";
import { Job, JobResult, JobStatus } from "./model/job";
import { QueuedJob } from "./model/queued-job";

@Injectable()
export class JobMapper {
  fromCreateJobDTOToJobModel(id:string, createJobDTO: CreateJobDTO): Job {
    const job: Job = {
      id: id,
      name: createJobDTO.name,
      status: JobStatus.PENDING
    }

    return job
  }

  fromQueueJobToJobModel(job: Object): Job {
    const queueJob = job as QueuedJob
    const jobModel: Job = {
      id: queueJob.id,
      name: queueJob.name,
      status: queueJob.status
    }

    return jobModel
  }

  fromJobModelToGetJobDTO(job: Job): GetJobDTO {
    const getJobDTO: GetJobDTO = {
      id: job.id,
      name: job.name,
    }

    if (job.status !== JobStatus.PENDING) {
      getJobDTO.result = JobResult[job.jobResult]
    } else [
      getJobDTO.status = JobStatus[job.status]
    ]

    return getJobDTO
  }
}