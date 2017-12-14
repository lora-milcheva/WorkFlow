export class DbWorkDayModel {
  constructor(
    public id: string,
    public projectId: string,
    public date: string,
    public workTimeInMinutes: number,
  ) { }
}
