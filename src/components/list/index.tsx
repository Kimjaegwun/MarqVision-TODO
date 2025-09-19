import Todo from "./todo";
import styles from "./index.module.css";
import { TodoType } from "@/types/todo";

const TodoList = ({
  tasks,
  handleEditTask,
  handleDeleteTask,
  handleCompleteTask,
}: {
  tasks: Array<TodoType>;
  handleEditTask: (id: string, value: string) => void;
  handleDeleteTask: (id: string) => void;
  handleCompleteTask: (id: string) => void;
}) => {
  return (
    <div className={styles["list-container"]}>
      {tasks.map((task) => (
        <Todo
          key={task.id}
          task={task}
          handleEditTask={handleEditTask}
          handleDeleteTask={handleDeleteTask}
          handleCompleteTask={handleCompleteTask}
        />
      ))}
    </div>
  );
};

export default TodoList;
