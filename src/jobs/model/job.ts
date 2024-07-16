export type Job = {
  id: string;
  name: string;
  status: JobStatus,
  jobResult?: JobResult
}

export enum JobStatus {
  PENDING,
  COMPLETED,
  CANCELLED
}

export enum JobResult {
  IMAGES_FETCHED,
  ENDPOINT_TIMEOUT,
  MAXIMUM_REQUEST_QUOTA_REACHED
}