export class TaskSummary {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly completed: boolean,
    public readonly dueDate: Date,
  ) {}
}
