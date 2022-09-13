import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterUser } from 'src/app/interfaces/register-user';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { EventComponent } from '../event/event.component';

@Component({
  selector: 'app-delete-date-service',
  templateUrl: './delete-date-service.component.html',
  styleUrls: ['./delete-date-service.component.less']
})
export class DeleteDateServiceComponent implements OnInit {
  user!: any;
  currentDate!: string;
  selectedOptions=[];
  selectedOption: any;
  list: any = [];
  constructor(public dialogRef: MatDialogRef<EventComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private firebaseService: FirebaseService,private _snackBar: MatSnackBar) { 
    this.user = this.firebaseService.getUserLogIn();
    this.currentDate = (new Date().getMonth() + 1).toString() + '/' + new Date().getDate().toString() + '/' + new Date().getFullYear().toString();
  }
  
  ngOnInit(): void {
   
    const data = this.data.data.filter((obj: any) => {
      return new Date(obj.date).getTime() > new Date(this.currentDate).getTime();
    });
    this.list = this.data.user.type == 0 ? this.findUserServices(data) : this.getAllUserServices(data);
  }

  findUserServices(data: any): any {
    let list:any = []
    data.forEach((obj: any) => {
      obj.data.forEach((date: any) => {
        if (date.id == this.user.id_card) {
          list.push(date);
        }
      });
    });
    return list;
  }

  getAllUserServices(data: any):any {
    let list:any = []
    data.forEach((obj: any) => {
      obj.data.forEach((date: any) => {
          list.push(date);
      });
    });
    return list;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  delete(): void {
    this.dialogRef.close(this.selectedOption)
  }

  onNgModelChange($event: any){
    this.selectedOption=$event;
  }

  openMessage(message: string): void {

      this._snackBar.open(message, 'OK');
  }
}
