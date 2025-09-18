import styles from "./todo.module.css"

const Todo = ({ task }: { task: string }) => {
  return (
    <div className={styles["todo-wrapper"]}>
      <input type="checkbox" title="checkbox" />
      <span>{task}</span>
      <button title="edit">Edit</button>
      <button title="delete">Delete</button>
    </div>
  );
};

export default Todo;  