export class WorkDayModel {
  constructor(
    public projectId: string,
    public day: number,
    public month: number,
    public year: number,
    public workTimeInMinutes: number,
  ) { }
}
