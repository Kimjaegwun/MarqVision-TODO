import styles from "./index.module.css";

const Input = ({
  task,
  setTask,
  handleAddTask,
}: {
  task: string;
  setTask: (task: string) => void;
  handleAddTask: () => void;
}) => {
  return (
    <div className={styles["input-wrapper"]}>
      <input
        aria-label="task-input"
        className={styles.input}
        type="text"
        placeholder="Add a new task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
      />
      <button className={styles.button} onClick={handleAddTask} aria-label="task-add-button">
        Add
      </button>
    </div>
  );
};

export default Input;
