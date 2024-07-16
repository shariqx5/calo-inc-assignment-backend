import { Injectable } from "@nestjs/common"
import { Socket } from "socket.io"
import { QueuedJob } from "src/jobs/model/queued-job"

type ConnectedClient = {
  clientId: string,
  socket: Socket
}

@Injectable()
export class SocketService {
  private static connectedClient?: ConnectedClient

  setConnectedClient(clientId: string, socket: Socket) {
    const connectedClient: ConnectedClient = {
      clientId,
      socket
    }
    SocketService.connectedClient = connectedClient
  }

  removeConnectedClient() {
    SocketService.connectedClient = null
  }

  sendMessageToCient(eventName: string, isJobResolved: Boolean, job: Object): Promise<void> {
    const queuedJob = job as QueuedJob

    return new Promise((resolve, reject) => {
      if (SocketService.connectedClient !== null) {
        let acknowledged = false
        const timeout = setTimeout(() => {
          if (!acknowledged) {
            reject(new Error(`No acknowledgment recieved from client for the job ${queuedJob.id}`))
          }
        }, 5000)

        SocketService.connectedClient.socket.emit(eventName, { isJobResolved, messageId: queuedJob.id })
        SocketService.connectedClient.socket.once(`update-on-job-received:${queuedJob.id}`, () => {
          acknowledged = true
          clearTimeout(timeout)
          resolve()
        })
      } else {
        reject(new Error("Client is not connected"))
      }
    })
  }
}