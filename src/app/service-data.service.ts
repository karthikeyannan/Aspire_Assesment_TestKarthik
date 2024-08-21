import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, Subscriber, throwError } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { identifierName } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})
export class ServiceDataService {

  RootURL = "https://dummyjson.com/users"
  EXCEL_TYPE: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION: string = '.xlsx';
  constructor(private http: HttpClient) { }

  //user data API
  getUserData(limit: number, skip: number): Observable<any> {
    const params = {
      limit: limit.toString(),
      skip: skip.toString()
    };
    return this.http.get<any>(this.RootURL, { params, observe: 'response' }).pipe(
      catchError(this.handleErrorResponse)
    )
  };
  //handle error response
  private handleErrorResponse(error: HttpErrorResponse) {
    let errorresponse: any = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {

      errorresponse = error.status;
    } else {
      errorresponse = error.status;
    }
    console.log(error.status)
    return throwError(() => new Error(errorresponse));
  }



  //Export to excel
  exportToExcel(DATA: any, column: string[], fileName: string): void {
    const filteredData = DATA.map((row: { [x: string]: any; }) => {
      const filteredRow: any = {};
      column.forEach(column => {
        filteredRow[column] = row[column];
      });
      return filteredRow;
    });
    console.log(filteredData)
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + this.EXCEL_EXTENSION);

  }
}


