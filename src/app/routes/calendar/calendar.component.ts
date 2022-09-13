import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { subDays, startOfDay, addDays, endOfMonth, addHours, endOfDay, isSameDay, isSameMonth } from 'date-fns';
import { map, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarView, CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/el';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialogService/dialog.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PlusButtonComponent } from 'src/app/components/plus-button/plus-button.component';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { RegisterUser } from 'src/app/interfaces/register-user';
import { ScheduleService } from 'src/app/services/scheduleService/schedule.service';
import { MatSnackBar } from '@angular/material/snack-bar';

registerLocaleData(locale);

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#32a852',
    secondary: '#98d9a0'
  }
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
  
export class CalendarComponent implements OnInit {
  locale: string = "el";
 

  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData?: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
      },
    },
  ];

  fullData: any = [
   
  ];

  // actions: CalendarEventAction[] = [
  //   {
  //     label: '<i class="fas fa-fw fa-pencil-alt"></i>',
  //     a11yLabel: 'Edit',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       this.handleEvent('Edited', event);
  //     },
  //   },
  //   {
  //     label: '<i class="fas fa-fw fa-trash-alt"></i>',
  //     a11yLabel: 'Delete',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       this.events = this.events.filter((iEvent) => iEvent !== event);
  //       this.handleEvent('Deleted', event);
  //     },
  //   },
  // ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [ ];

  activeDayIsOpen: boolean = false;

  constructor(private modal: NgbModal, private dialogService: DialogService, private _bottomSheet: MatBottomSheet, private firebaseService: FirebaseService, private scheduleService: ScheduleService,private _snackBar: MatSnackBar) { }
  
  ngOnInit(): void {
    this.scheduleService.getAllSchedule().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.fullData = [];
      this.events = [];
      this.fullData = data;
      data.forEach((dataByDate: any) => {
        dataByDate.data.forEach((person: any) => {
          this.createServiceForFireDepartment(person);
          
        });
      });
    });
    
    // this.fullData.forEach((dataByDate: any) => {
    //   dataByDate.data.forEach((person: any) => {
    //     // this.addEvent();
    //     this.createServiceForFireDepartment(person);
    //   });
    // });
  } 

  openBottomSheet(): void {
    const bottomSheetRef = this._bottomSheet.open(PlusButtonComponent, { data: this.fullData })
    bottomSheetRef.afterDismissed().subscribe((resp) => {
      if (resp && resp.type == 'add')
        this.addNewService(resp, this.firebaseService.getUserLogIn());
      else if (resp && resp.type == 'delete')
        this.deleteService(resp);
      else if (resp && resp.type == 'number')
        this.setDeclareServiceLimits(resp);
    });

  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.fullData.forEach((data: any) => {
      if (new Date(data.date).getTime() == date.getTime()) {
        this.dialogService.openEventDialog(data.data).subscribe(resp => { }) 
      }
    });
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addNewService(data: any, user: any): void {
    let selectDate = (new Date(data.picker).getMonth() + 1).toString() + '/' + new Date(data.picker).getDate().toString() + '/' + new Date(data.picker).getFullYear().toString();
    let find = false;
    let alreadyInList = false;
    this.fullData.forEach((event: any, i: number )=> {
      if (event.date == selectDate) {
        console.log(event)
        find = true;
       const thereIs = event.data.filter((obj: any) => {
          return obj.id == user.id_card
        });
        if (thereIs.length == 0) { 
          event.data.push({
            id: user.id_card,
            name: user.firstname + ' ' + user.lastname,
            service: new Array({
              date: selectDate,
              A: data.A,
              B: data.B,
              G: data.G,
              message: data.message
            })
          })
        } else {
          alreadyInList = true;
          this._snackBar.open("Έχετε δηλώση ήδη υπηρεσία.", 'Κλείσιμο');
        }
      }
    });

    if (!find) {
      this.fullData.push({
        date: selectDate, data: new Array({
            id: user.id_card,
            name: user.firstname + ' ' + user.lastname,
            service: new Array(
            {
              date: selectDate,
              A: data.A,
              B: data.B,
              G: data.G,
              message: data.message
            })
        })
      })
    }
    if(!alreadyInList){
      this.events = [
        ...this.events,
        {
          title: user.firstname + ' ' + user.lastname,
          start: new Date(selectDate),
          end: new Date(selectDate),
          color: colors[this.isPastService(selectDate)],
          actions: this.actions,
          draggable: false,
          resizable: {
            beforeStart: false,
            afterEnd: false,
          }
        }
      ]
      this.refresh.next();
      
      this.scheduleService.createSchedule(this.fullData);
    }
  }

  deleteService(data: any): void {
    let newData = new Array();
    this.fullData.map((obj: any) => {
      data.forEach((obj2: any )=> {
        if (obj.date == obj2.service[0].date) {
          newData.push(obj);
        }
      });
    });
    let newData2 = new Array();
    newData.forEach(obj => {
      obj.data.forEach((service: any) => {
        if (service.id != data[0].id) {
          newData2.push({key : obj.key,data: service});
        }
      });
      if (newData2.length == 0) {
        this.fullData = this.fullData.filter((resp: any) => {
           return  resp.key != obj.key
        })
      }
    });
    newData2.forEach(obj => {
      this.fullData[obj.key].data = new Array(obj.data)
    });
    this.scheduleService.deleteSchedule(1, this.fullData);
  }

  setDeclareServiceLimits(data: any): void {
    this.scheduleService.updateDeclaration('service', data.resp);
  };

  createServiceForFireDepartment(user: any): void {
    this.events = [
      ...this.events,
      {
        title: user.name,
        start: new Date(user.service[0].date),
        end: new Date(user.service[0].date),
        color: colors[this.isPastService(user.service[0].date)],
        actions: this.actions,
        draggable: false,
        resizable: {
          beforeStart: false,
          afterEnd: false,
        }
      }
    ]
    this.refresh.next();
  };

  isPastService(date: string): string {
    let today = (new Date().getMonth()+1).toString() + '/' + new Date().getDate().toString() + '/' + new Date().getFullYear().toString()
    
    if (new Date(today) < new Date(date)) return 'blue';
    else if (today == date) return 'green';
    else return 'red';
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
