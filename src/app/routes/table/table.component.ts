import {Component, OnInit, ViewChild} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { PlusButtonComponent } from 'src/app/components/plus-button/plus-button.component';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = [ 'id','firstname', 'lastname', 'phone'];
  dataSource = new MatTableDataSource([]);



  @ViewChild(MatPaginator) paginator!: MatPaginator; 
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fireService: FirebaseService,private _bottomSheet: MatBottomSheet, private _snackBar: MatSnackBar) { }
  users: any = new Array();
  ngOnInit(): void {
    this.fireService.getUsers().then((resp:any) => {
      resp.forEach((obj: any) => {
        if (obj.user.type == 0)  this.users.push(obj.user)
      });
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openBottomSheet(): void {
    const bottomSheetRef = this._bottomSheet.open(PlusButtonComponent, { data: '' })
    bottomSheetRef.afterDismissed().subscribe((id: string) => {
      this.fireService.createID(id).then((resp: any) => {
        this._snackBar.open(resp ? `Ο Α.Δ.Τ.Ε ${id} προστέθηκε επιτυχώς` : `Ο Α.Δ.Τ.Ε ${id} που πληκτρολογήσατε υπάρχει ήδη` , 'Κλείσιμο');
      })

    });

  }

}
