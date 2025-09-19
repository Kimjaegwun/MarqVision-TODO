import Todo from "./todo";
import styles from "./index.module.css";

const TodoList = ({
  tasks,
  handleEditTask,
  handleDeleteTask,
}: {
  tasks: string[];
  handleEditTask: (index: number, value: string) => void;
  handleDeleteTask: (index: number) => void;
}) => {
  return (
    <div className={styles["list-container"]}>
      {tasks.map((task, index) => (
        <Todo
          key={task}
          task={task}
          handleEditTask={handleEditTask}
          handleDeleteTask={handleDeleteTask}
          index={index}
        />
      ))}
    </div>
  );
};

export default TodoList;
