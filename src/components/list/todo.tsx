import { useEffect, useRef, useState } from "react";
import styles from "./todo.module.css";

const Todo = ({
  task,
  handleEditTask,
  handleDeleteTask,
  index,
}: {
  task: string;
  handleEditTask: (index: number, value: string) => void;
  handleDeleteTask: (index: number) => void;
  index: number;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [editedTask, setEditedTask] = useState(() => task);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div className={styles["todo-wrapper"]}>
      <input type="checkbox" title="checkbox" />
      <input
        ref={inputRef}
        className={styles["todo-input"]}
        disabled={!isEditing}
        value={editedTask}
        onChange={(e) => setEditedTask(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setIsEditing(false);
            handleEditTask(index, editedTask);
          }
        }}
        title="task"
      />
      <button
        title={isEditing ? "save" : "edit"}
        onClick={() => {
          setIsEditing(!isEditing);
        }}
      >
        {isEditing ? "Save" : "Edit"}
      </button>
      <button
        title={isEditing ? "cancel" : "delete"}
        onClick={() => {
          if (isEditing) {
            setIsEditing(false);
            setEditedTask(task);
          } else {
            handleDeleteTask(index);
          }
        }}
      >
        {isEditing ? "Cancel" : "Delete"}
      </button>
    </div>
  );
};

export default Todo;
