import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { map, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarView, CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewBeforeRenderEvent, CalendarDayViewBeforeRenderEvent, CalendarWeekViewBeforeRenderEvent } from 'angular-calendar';
import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/el';
import { DialogService } from 'src/app/services/dialogService/dialog.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PlusButtonComponent } from 'src/app/components/plus-button/plus-button.component';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
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
  user: any;

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
      this.user = this.firebaseService.getUserLogIn();
    });
    
    // this.fullData.forEach((dataByDate: any) => {
    //   dataByDate.data.forEach((person: any) => {
    //     // this.addEvent();
    //     this.createServiceForFireDepartment(person);
    //   });
    // });
  } 

  openBottomSheet(): void {
    if (!this.user) return;
    const bottomSheetRef = this._bottomSheet.open(PlusButtonComponent, { data: this.fullData })
    bottomSheetRef.afterDismissed().subscribe((resp) => {
      if (resp && resp.type == 'add')
        this.addNewService(resp, this.user);
      else if (resp && resp.type == 'delete')
        this.deleteService(resp);
      else if (resp && resp.type == 'number')
        this.setDeclareServiceLimits(resp);
    });

  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.fullData.forEach((data: any) => {
      if (new Date(data.date).getTime() == date.getTime()) {
        this.dialogService.openEventDialog({data:data.data, date: data.date}).subscribe(resp => { }) 
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
    let canCreate = true;
    let alreadyInList = false;
    let newService;
    this.fullData.forEach((event: any, i: number )=> {
      if (event.date == selectDate) {
        canCreate = this.checkServiceLimits(event.data,data);
        find = true;
        const thereIs = event.data.filter((obj: any) => {
          return obj.id == user.id_card
        });
        if (thereIs.length == 0 && canCreate) { 
          newService = {
            id: user.id_card,
            name: user.firstname + ' ' + user.lastname,
            service: new Array({
              date: selectDate,
              A: data.A,
              B: data.B,
              G: data.G,
              message: data.message
            })
          }
          event.data.push(newService)
        } else if (!canCreate) {
          this._snackBar.open("Δε μπορείτε να δηλώσετε τη συγκεκριμένη μέρα υπηρεσία, Επιλέξτε άλλη ημερομηνία.", 'Κλείσιμο');
        } else {
          alreadyInList = true;
          this._snackBar.open("Έχετε δηλώση ήδη υπηρεσία.", 'Κλείσιμο');
        }
      }
    });

    if (!find && !alreadyInList && canCreate) {
      newService ={
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
      };
      this.fullData.push(newService)
    }
    if(!alreadyInList && canCreate){
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
      
      this.scheduleService.createSchedule({fullData: this.fullData, newService: newService});
    }
  }

  checkServiceLimits(services: any, newService: any): boolean {
    let A = new Array();
    let B = new Array();
    let G = new Array();
    let canCreate: boolean[] = [true,true,true];
    let freeSpace: boolean[] = [false,false,false];
    services.forEach((resp: any) => {
        if(resp?.service[0]['A']) A.push(true)
        if(resp?.service[0]['B']) B.push(true)
        if(resp?.service[0]['G']) G.push(true)
    });
    // set Free space per service Hour (8h)
    if(this.scheduleService.getServiceLimits() > A.length) freeSpace[0] = true;
    if(this.scheduleService.getServiceLimits() > B.length) freeSpace[1] = true;    
    if(this.scheduleService.getServiceLimits() > G.length) freeSpace[2] = true;
    // set selected service hour if that's free
    if(newService['A'] && !freeSpace[0]) canCreate[0] = false;
    if(newService['B'] && !freeSpace[1]) canCreate[1] = false;
    if(newService['G'] && !freeSpace[2]) canCreate[2] = false;

    const can = canCreate.filter( value => {
      return !value;
    });
    
    return can.length ? false : true;
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
    newData2.forEach((obj: any, i: number) => {
      i == 0 ? this.fullData[obj.key].data = new Array(obj.data) : this.fullData[obj.key].data.push(obj.data)
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
