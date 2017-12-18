import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { FloorPipe } from '../../../core/pipes/floor-number.pipe';
import { Router } from '@angular/router';

// Models
import { ProjectModel } from '../../../core/models/project.model';
import { WorkDayModel } from '../../../core/models/work-day.model';
import { DbWorkDayModel } from '../../../core/models/db-work-day.model';

// Services
import { ProjectService } from '../../../core/services/project/project.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './project-calendar.component.html',
  styleUrls: ['./project-calendar.component.scss'],
})
export class ProjectCalendarComponent implements OnInit {
  @Input() project: ProjectModel;

  public projectId: string;
  public status = false;

  public currentDate: Date;
  public weekday: any;
  public today: number;
  public month: number;
  public monthAsString: string;
  public year: number;

  public daysTable: number[];
  public monthSchedule: any[];
  private dbSchedule: WorkDayModel[];
  private emptyDays: number[];
  private weekdays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  public incomingFormData: any;

  constructor(private route: ActivatedRoute,
              private projectService: ProjectService,
              private router: Router) {
    this.currentDate = new Date();
    this.today = this.currentDate.getDate();
    this.month = this.currentDate.getMonth();
    this.year = this.currentDate.getFullYear();
    this.weekday = new Date(this.year, this.month, 1).getDay();

    this.daysTable = [];
    this.monthAsString = this.monthToString(this.month);
    this.monthSchedule = [];
    this.emptyDays = [];

    this.incomingFormData = [];

    this.projectId = this.route.snapshot.params['id'];

    for (let i = 1; i < this.weekday; i++) {
      this.emptyDays.push(i);
    }
  }

  ngOnInit() {
    this.loadSchedule();
    if (this.project.status === 'closed') {
      this.status =  true;
    }
  }

  getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  monthToString(m: number): string {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return monthNames[m];
  }

  save() {
    let day = 1;

    // iterate all incoming data
    for (const time of this.incomingFormData) {
      if (time !== '' && time !== undefined) {

        // go through all days in current month
        for (const currentDay of this.monthSchedule) {
          const dayFromSchedule = currentDay.date.split('/')[1];
          const date = new Date(this.year, this.month, day).toLocaleString();
          const workDay = new WorkDayModel(this.projectId, date, time);

          // check if current day has existing value from previous project update
          // if so - update time, if not - create new time
          if (day.toString() === dayFromSchedule && currentDay.workTimeInMinutes !== 0) {

            // check if new value is zero (in case we want to correct time - say added minutes to the wrong day)
            // if so - delete time, if not - update time
            if (Number(time) === 0) {
              this.projectService
                .deleteWorkTime(currentDay._id)
                .subscribe(data => {
                  console.log('time deleted');
                });
            } else {
              this.projectService
                .updateWorkTime(currentDay._id, workDay)
                .subscribe(data => {
                });
            }
          } else if (day.toString() === dayFromSchedule && currentDay.workTimeInMinutes === 0 && Number(time) !== 0) {
            this.projectService
              .saveWorkTime(workDay)
              .subscribe(data => {
              });
          }
        }
      }
      day++;
    }
    this.loadSchedule();
  }

  loadSchedule() {
    this.monthSchedule = [];
    this.daysTable = [];

    this.projectService
      .getProjectTime(this.projectId)
      .subscribe(data => {
        this.dbSchedule = data;

        const daysInMonth = this.getDaysInMonth(this.year, this.month);

        for (let i = 1; i <= daysInMonth; i++) {
          this.daysTable.push(i);
          const date = new Date(this.year, this.month, i).toLocaleString();
          this.monthSchedule.push(new WorkDayModel(this.projectId, date, 0));
        }

        for (const obj of this.monthSchedule) {
          for (const obj1 of this.dbSchedule) {
            if (obj.date === obj1.date) {
              const index = this.monthSchedule.findIndex(x => x.date === obj1.date);
              this.monthSchedule[index] = obj1;
            }
          }
        }
        this.calculateTotalTime();
      });
  }

  updateProject() {
    this.projectService
      .saveProject(this.projectId, this.project)
      .subscribe(data => {
        this.project = data;
      });
  }

  calculateTotalTime() {
    let time = 0;

    for (const obj of this.monthSchedule) {
      time += Number(obj.workTimeInMinutes);
    }

    this.project.totalTime = time;
    this.updateProject();
  }
}
