export class Task {
  constructor(
    public readonly id: number | null,
    public readonly userId: string,
    public title: string,
    public description: string,
    public completed: boolean,
    public dueDate: Date,
    public comments?: string,
    public responsible?: string,
    public tags?: string[],
  ) {}
}
