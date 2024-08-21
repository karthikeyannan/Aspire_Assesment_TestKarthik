import { Component, OnInit } from '@angular/core';
import { ServiceDataService } from '../service-data.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-management-component',
  templateUrl: './user-management-component.component.html',
  styleUrls: ['./user-management-component.component.css']
})
export class UserManagementComponentComponent implements OnInit {
  [x: string]: any;

  CurrentPagelimit: number = 10;
  skipDataPage: number = 0
  UserDataResponse: any = [];
  currentPage: number = 1;
  totalPages!: number;
  MaxtotalPaginationItems: number = 50;
  totalCount!: number
  ShowingDataPage: number = 10;
  errorMessage: string | null = null;
  ColumnData: string[] = ["id", "image", "firstName", "lastName", "birthDate", "bloodGroup"]
  constructor(private serviceData: ServiceDataService) {

  }
  ngOnInit(): void {
    this.getUserData(this.CurrentPagelimit, this.skipDataPage);
    this.totalPages = Math.round(this.MaxtotalPaginationItems / this.CurrentPagelimit);

  }
  //get User Data
  getUserData(CurrentPagelimit: number, skipDataPage: number) {
    this.serviceData.getUserData(CurrentPagelimit, skipDataPage).subscribe((getDataResponse) => {
      this.UserDataResponse = getDataResponse.body.users;
      console.log(this.UserDataResponse)
      this.totalCount = getDataResponse.body.total

    },
      (error) => {
        if (error.message == 404) {
          this.errorMessage = "Not found";
        } else if (error.message == 500) {
          this.errorMessage = "Server problem";
        }

      }
    )
  }
  //change the pagination
  ChangePage(page: number) {
    this.currentPage = page;
    this.skipDataPage = (this.currentPage - 1) * 10;
    this.ShowingDataPage = this.currentPage * 10;
    this.getUserData(this.CurrentPagelimit, this.skipDataPage);



  }
  //Download excel
  DownloadExcel() {
    this.serviceData.exportToExcel(this.UserDataResponse, this.ColumnData, "UserData" + this.currentPage)
  }

}
