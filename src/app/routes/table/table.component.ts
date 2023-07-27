import {Component, OnInit, ViewChild} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private fireService: FirebaseService,private _bottomSheet: MatBottomSheet, private _snackBar: MatSnackBar) { }
  users: any = new Array();
  ngOnInit(): void {
    this.fireService.getUsers().then((resp:any) => {
      resp.forEach((obj: any) => {
        if (obj.user.type == 0)  this.users.push(obj.user)
      });
      this.dataSource = new MatTableDataSource(this.users);
    })
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
