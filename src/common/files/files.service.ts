import { Injectable } from "@nestjs/common";
import { writeFileSync, readFileSync, appendFileSync } from "fs";

@Injectable()
export class FileService {

  static readonly encoding = "utf-8"

  write<T extends Object>(filename: string, data: T) {  
    try {
      appendFileSync(filename, JSON.stringify(data) + "\n", { flag: 'a' })
    } catch(error) {
      console.log(`Error: writing to file aborted due to ${error.message}`)
    }
  }

  updateRecordById<T extends Object>(filename: string, updatedData: T) {
    const records = this.getEachRecordInFileAsArray(filename)
    .filter((rawRecord) => rawRecord !== "")
    .map((rawRecord) => JSON.parse(rawRecord))

    const updatedRecords = records.map((record) => {
      let updatedRecord = {...record}
      if (record.id === updatedData["id"]){
        updatedRecord = {...updatedData}
      }

      return updatedRecord
     })
    
    const rawFileRecords = updatedRecords.reduce((accumulator, currentRow) => accumulator + JSON.stringify(currentRow) + "\n", "")
     
    writeFileSync(filename, rawFileRecords, { flag: 'w' })
  }

  readFileRecordAsJSType<T>(filename: string): T[] {
    const records = this.getEachRecordInFileAsArray(filename)
    .filter((rawRecord) => rawRecord !== "")
    .map((rawRecord) => JSON.parse(rawRecord) as T)

    return records
  }

  private getEachRecordInFileAsArray(filename: string): string[] {
    const rawFileData = readFileSync(filename, { encoding: FileService.encoding })
    return rawFileData.split("\n")
  }
}