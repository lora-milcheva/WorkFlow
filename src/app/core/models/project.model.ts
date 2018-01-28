export class ProjectModel {
  constructor(
    public creator: string,
    public name: string,
    public client: string,
    public clientId: string,
    public budget: number,
    public rate: number,
    public status: string,
    public startDate?: Date,
    public endDate?: Date,
    public totalTime?: number,
    public workDays?: string[],
    public balance?: number
  ) { }
}
