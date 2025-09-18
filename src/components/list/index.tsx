import Todo from "./todo";
import styles from "./index.module.css";

const TodoList = ({ tasks }: { tasks: string[] }) => {
  return (
    <div className={styles["list-container"]}>
      {tasks.map((task) => (
        <Todo key={task} task={task} />
      ))}
    </div>
  );
};

export default TodoList;