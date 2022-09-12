import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventComponent } from '../event/event.component';

@Component({
  selector: 'btn-create-announce',
  templateUrl: './create-announce.component.html',
  styleUrls: ['./create-announce.component.less']
})
export class CreateAnnounceComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EventComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) { }
  date: Date = new Date();
  selectedValue!: string;

  formAnnounce = new FormGroup({
    title: new FormControl('',[Validators.required]),
    message: new FormControl('',[Validators.required]),
    icon: new FormControl('', [Validators.required]),
    date: new FormControl(this.date.getTime())
  })
  types: {value:string, type:string}[] = [
    { value: 'gen_announce', type: 'announce' },
    { value: 'gen_attention', type: 'attention'}
  ]

  ngOnInit(): void { }

  goBack(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    this.dialogData.unshift(this.formAnnounce.value)
    this.dialogRef.close({ data: this.dialogData });
  }

}
