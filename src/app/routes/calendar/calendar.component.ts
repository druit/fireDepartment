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
    // {
    //   date: '8/26/2022',
    //   data: [
    //     {
    //       id: '02B126',
    //       name: 'Καρανικόλας Νικόλαος',
    //       service: [
    //         {
    //           date: '8/26/2022',
    //           A: true,
    //           B: true,
    //           G: false,
    //         }
    //       ]
    //     },
    //     {
    //       id: '02A555',
    //       name: 'Μιτσοπούλου Κατερινά',
    //       service: [
    //         {
    //           date: '8/26/2022',
    //           A: true,
    //           B: false,
    //           G: false,
    //         }
    //       ]
    //     },
    //     {
    //       id: '01Α133',
    //       name: 'Παπαδόπουλος Δημήτρης',
    //       service: [
    //         {
    //           date: '8/26/2022',
    //           A: true,
    //           B: true,
    //           G: true,
    //         }
    //       ]
    //     }
    //   ]
    // }, {
    //   date: '8/27/2022',
    //   data: [
    //     {
    //       id: '02B126',
    //       name: 'Καρανικόλας Νικόλαος',
    //       service: [
    //         {
    //           date: '8/27/2022',
    //           A: true,
    //           B: true,
    //           G: false,
    //         }
    //       ]
    //     }
    //   ]
    // }
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

  constructor(private modal: NgbModal, private dialogService: DialogService, private _bottomSheet: MatBottomSheet, private firebaseService: FirebaseService, private scheduleService: ScheduleService) { }
  
  ngOnInit(): void {
    // console.log("ELEOS", this.fullData)
    // this.scheduleService.createSchedule(this.fullData);
    this.scheduleService.getAllSchedule().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      console.log(data);
      this.fullData = data;
      data.forEach((dataByDate: any) => {
        // console.log(dataByDate);
        dataByDate.data.forEach((person: any) => {
          // this.addEvent();
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
    this._bottomSheet.open(PlusButtonComponent).afterDismissed().subscribe((resp) => {
      if(resp)
        this.addNewService(resp, this.firebaseService.getUserLogIn());
    });

  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    let services;
    this.fullData.forEach((data: any) => {
      if (new Date(data.date).getTime() == date.getTime()) {
        services = data.data;       
      }
    });

    
    
    // if (isSameMonth(date, this.viewDate)) {
    //   if (
    //     (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
    //     events.length === 0
    //   ) {
    //     this.activeDayIsOpen = false;
    //   } else {
    //     this.activeDayIsOpen = true;
    //   }
    //   this.viewDate = date;
    // }
    this.dialogService.openEventDialog(services).subscribe(resp => {
      console.log(resp);
    })
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
    console.log(this.modalData)
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addNewService(data:any, user: any): void {
    let selectDate = (new Date(data.picker).getMonth() + 1).toString() + '/' + new Date(data.picker).getDate().toString() + '/' + new Date(data.picker).getFullYear().toString();
    let find = false;
    this.fullData.forEach((event: any )=> {
      if (event.date == selectDate) {
        find = true;
        event.data.push({
          id: user.username,
          name: user.firstname + ' ' + user.lastname,
          service: new Array({
            date: selectDate,
            A: data.A,
            B: data.B,
            G: data.G,
            message: data.message
          })
        })
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

    console.log( this.fullData)
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
  }

  createServiceForFireDepartment(user: any): void {
    console.log(user)
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
    // console.log(new Date(today),new Date(date));
    
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
