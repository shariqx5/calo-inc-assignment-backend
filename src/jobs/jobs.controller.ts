import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { CreateJobDTO } from './dto/create-job.dto';
import { JobMapper } from './job.mapper';
import { JobsService } from './jobs.service';
import { v4 as uuidv4 } from 'uuid';
import { GetJobDTO } from './dto/get-job-dto';
import { Response } from 'express';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobService: JobsService,
    private readonly jobMapper: JobMapper
    ) {}

  @Post()
  async create(@Body() createJobDTO: CreateJobDTO, @Res() response: Response)
  : Promise<Response> {
    const jobId = uuidv4()
    const job = this.jobMapper.fromCreateJobDTOToJobModel(jobId, createJobDTO)
    
    this.jobService.createJob(job)

    return response.status(HttpStatus.ACCEPTED).json({ jobId })
  }

  @Get()
  getJobs(@Res() response: Response): Response<GetJobDTO[]> {
    const jobs = this.jobService.getJobs()
    const jobDTOs = jobs.map((job) => this.jobMapper.fromJobModelToGetJobDTO(job))

    return response.status(HttpStatus.OK).json(jobDTOs)
  }

  @Get(":id")
  getJob(@Param('id') id: string, @Res() response: Response): Response<GetJobDTO> {
    const job = this.jobService.getJob(id)
    const getJobDTO = this.jobMapper.fromJobModelToGetJobDTO(job)
    return response.status(HttpStatus.OK).json(getJobDTO)
  }
}