import { Component, OnInit, Output, Input, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { FloorPipe } from '../../../core/pipes/floor-number.pipe';
import { Router } from '@angular/router';

// Models
import { ProjectModel } from '../../../core/models/project.model';
import { WorkDayModel } from '../../../core/models/work-day.model';
import { DbWorkDayModel } from '../../../core/models/db-work-day.model';

// Pipes
import { FloorPipe } from '../../../core/pipes/floor-number.pipe';

// Services
import { ProjectService } from '../../../core/services/project/project.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './project-calendar.component.html',
  providers: [FloorPipe],
  styleUrls: ['./project-calendar.component.scss'],
})
export class ProjectCalendarComponent implements OnInit, OnDestroy {
  @Input() project: ProjectModel;
  @Output() notify: EventEmitter<ProjectModel> = new EventEmitter<ProjectModel>();

  public projectId: string;
  public status = false;

  public currentDate: Date;
  public weekday: number;
  public today: number;
  public month: number;
  public monthAsString: string;
  public year: number;

  public daysInMonth: number[];
  public monthSchedule: any[];
  private dbSchedule: WorkDayModel[];
  private emptyDays: number[];
  private weekdays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  private currentMonthTime = 0;
  public incomingFormData: any;

  constructor(private route: ActivatedRoute,
              private projectService: ProjectService,
              private router: Router) {

    this.daysInMonth = [];
    this.monthSchedule = [];
    this.incomingFormData = [];

    this.projectId = this.route.snapshot.params['id'];
  }

  getWeekDay() {
    return new Date(this.year, this.month, 1).getDay();
  }

  getEmptyDays() {
    this.emptyDays = [];
    if (this.weekday === 0) {
      this.weekday = 7;
    }
    for (let i = 1; i < this.weekday; i++) {
      this.emptyDays.push(i);
    }
  }

  ngOnInit() {
    console.log(this.month);
    this.currentDate = new Date();
    this.today = this.currentDate.getDate();
    this.month = this.currentDate.getMonth();
    this.year = this.currentDate.getFullYear();

    const projectLastMonth = new Date (this.project.endDate);
    console.log(projectLastMonth.getMonth());
    if (projectLastMonth.getMonth() < this.month) {
      this.month = projectLastMonth.getMonth();
      console.log(this.month);
    }

    this.weekday = this.getWeekDay();
    this.getEmptyDays();
    this.monthAsString = this.monthToString(this.month);

    this.loadSchedule();
    if (this.project.status === 'closed') {
      this.status = true;
    }
  }

  ngOnDestroy() {
    this.updateProject();
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

  saveAddedTime() {
    let day = 1;
    return new Promise((resolve, reject) => {

      // iterate all incoming data
      for (const time of this.incomingFormData) {
        if (time !== '' && time !== undefined && !isNaN(time)) {

          // go through all days in current month
          for (const currentDay of this.monthSchedule) {
            const workDay = new WorkDayModel(this.projectId, currentDay.day, currentDay.month, currentDay.year, time);

            // check if current day has existing value from previous project update
            // if so - update time, if not - create new time
            if (day === currentDay.day && currentDay.workTimeInMinutes !== 0) {

              // check if new value is zero (in case we want to correct time - say by mistake we've added minutes to the wrong day)
              // if so - delete time, if not - update time
              if (Number(time) === 0) {
                this.projectService
                  .deleteWorkTime(currentDay._id)
                  .subscribe(data => {
                    this.project.totalTime = this.project.totalTime - currentDay.workTimeInMinutes;
                    resolve();
                  });
              } else {
                this.projectService
                  .updateWorkTime(currentDay._id, workDay)
                  .subscribe(data => {
                    this.project.totalTime = this.project.totalTime - currentDay.workTimeInMinutes;
                    this.project.totalTime = this.project.totalTime + time;
                    resolve();
                  });
              }
            } else if (day === currentDay.day && currentDay.workTimeInMinutes === 0 && Number(time) !== 0) {
              this.projectService
                .saveWorkTime(workDay)
                .subscribe(data => {
                  this.project.totalTime = this.project.totalTime + time;
                  resolve();
                });
            }
          }
        }
        day++;
      }
    });
  }

  async updateView() {
    await this.saveAddedTime()
      .then(() => {
        console.log('after');
        this.incomingFormData = [];
        this.loadSchedule();
      });
  }

  loadPreviousMonth() {
    const start = new Date(this.project.startDate);
    if (this.month === start.getMonth()) {
      return;
    }
    if (this.month === 0) {
      this.month = 11;
      this.year--;
    } else {
      this.month--;
    }

    this.monthAsString = this.monthToString(this.month);
    this.weekday = this.getWeekDay();
    this.getEmptyDays();
    this.loadSchedule();
  }

  loadNextMonth() {
    const end = new Date(this.project.endDate);
    if (this.month === end.getMonth()) {
      return;
    }
    if (this.month === 11) {
      this.month = 0;
      this.year++;
    } else {
      this.month++;
    }

    this.monthAsString = this.monthToString(this.month);
    this.weekday = this.getWeekDay();
    this.getEmptyDays();
    this.loadSchedule();
  }

  loadSchedule() {
    this.monthSchedule = [];
    this.daysInMonth = [];

    this.projectService
      .getProjectTimeForMonth(this.projectId, this.month, this.year)
      .subscribe(data => {
        this.dbSchedule = data;

        const daysInMonth = this.getDaysInMonth(this.year, this.month);

        for (let i = 1; i <= daysInMonth; i++) {
          this.daysInMonth.push(i);
          this.monthSchedule.push(new WorkDayModel(this.projectId, i, this.month, this.year, 0));
        }

        for (const obj of this.monthSchedule) {
          for (const obj1 of this.dbSchedule) {

            if (obj.day === obj1.day) {
              const index = this.monthSchedule.findIndex(x => x.day === obj1.day);
              this.monthSchedule[index] = obj1;
            }
          }
        }
        this.calculateCurrentMonthTime();
        this.projectService.updateProjectData(this.project);
      });
  }

  calculateCurrentMonthTime() {
    this.currentMonthTime = 0;

    for (const obj of this.monthSchedule) {
      this.currentMonthTime += Number(obj.workTimeInMinutes);
    }
  }

  updateProject() {
    this.projectService
      .saveProject(this.projectId, this.project)
      .subscribe(data => {
        this.project = data;
        this.projectService.updateProjectData(this.project);
      });
  }
}
