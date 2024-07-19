import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq"
import { Queue } from "bullmq"
import { FileService } from "src/common/files/files.service";
import { Job, JobStatus } from "./model/job";

@Injectable()
export class JobsService {
  constructor(
    @InjectQueue("jobs") private jobsQueue: Queue,
    @InjectQueue("notify-user-job-resolved") private notifyUserJobResolved: Queue,
    private readonly fileService: FileService,
  ) {}

  static readonly fileName = "jobs.txt"

  createJob(job: Job) {
    this.fileService.write(JobsService.fileName, job)
    this.enqueueJobForProcessing(job)
  }

  private enqueueJobForProcessing(job: Job) {
    this.jobsQueue.add('job', job)
  }

  getJobs(): Job[] {
    const jobs = this.fileService.readFileRecordAsJSType<Job>(JobsService.fileName)
    return jobs
  }

  getJob(id: string): Job {
    const jobs = this.fileService.readFileRecordAsJSType<Job>(JobsService.fileName)
    return jobs.find((job) => job.id === id)
  }

  async processQueuedJob(job: Job) {
    const jobResult = await this.fetchFoodCategoryImagesFromUnsplash()
    this.fileService.updateRecordById(JobsService.fileName, 
      {...job, status: JobStatus.COMPLETED, jobResult: jobResult}
    )

    this.notifyUserJobResolved.add('job-resolved', job)
  }

  private async fetchFoodCategoryImagesFromUnsplash(): Promise<number> {
    // randomly selecting the time between 5seconds - 5 minutes with 5 step 
    const timeTakenForFetchingImages = Math.round(Math.random() * 300/5) * 5 % 300
    await this.simulateImageFetchingForGivenTime(timeTakenForFetchingImages)
    
    // select random status job result
    return Math.round(Math.random() * 10) % 3
  }

  private simulateImageFetchingForGivenTime(timeInSeconds: number): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, timeInSeconds * 1000))
  }
} 