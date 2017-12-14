export class ProjectModel {
  constructor(
    public creator: string,
    public name: string,
    public client: string,
    public budget: number,
    public rate: number,
    public status: string,
    public dateCreated: Date,
    public dueDate?: Date,
    public totalTime?: number,
    public workDays?: string[],
    public balance?: number
  ) { }
}
