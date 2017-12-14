export class WorkDayModel {
  constructor(
    public projectId: string,
    public date: string,
    public workTimeInMinutes: number,
  ) { }
}
