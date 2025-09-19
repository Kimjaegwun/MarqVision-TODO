export type TodoType = {
  id: string;
  task: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
  references: string[];
};
