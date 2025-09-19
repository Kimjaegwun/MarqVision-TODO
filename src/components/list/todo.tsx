import { useEffect, useRef, useState } from "react";
import styles from "./todo.module.css";
import { TodoType } from "@/types/todo";

const Todo = ({
  task,
  handleEditTask,
  handleDeleteTask,
  handleCompleteTask,
}: {
  task: TodoType;
  handleEditTask: (id: string, value: string) => void;
  handleDeleteTask: (id: string) => void;
  handleCompleteTask: (id: string) => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [editedTask, setEditedTask] = useState(() => task);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div className={styles["todo-container"]}>
      <div className={styles["todo-wrapper"]}>
        <div className={styles["todo-checkbox"]} onClick={() => handleCompleteTask(task.id)}>
          <input
            type="checkbox"
            title="checkbox"
            aria-label="checkbox"
            checked={task.completed}
            onChange={() => handleCompleteTask(task.id)}
          />
          <span className={styles["todo-checkbox-text"]}>{task.id}</span>
          <div className={styles["todo-reference"]}>
            <span>REF</span>
          </div>
        </div>
        <textarea
          aria-label="task-edit-input"
          ref={textareaRef}
          className={styles["todo-area"]}
          disabled={!isEditing}
          value={editedTask.task}
          onChange={(e) => setEditedTask((prev) => ({ ...prev, task: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setIsEditing(false);
              handleEditTask(editedTask.id, editedTask.task);
            }
          }}
          title={"task"}
          style={{
            textDecoration: task.completed ? "line-through" : "none",
          }}
        />
        <p className={styles["todo-date"]}>[생성일: {new Date(task.createdAt).toLocaleString()}]</p>
        <p className={styles["todo-date"]}>[수정일: {new Date(task.updatedAt).toLocaleString()}]</p>
      </div>
      <div className={styles["todo-buttons"]}>
        <button
          aria-label={isEditing ? "save-button" : "edit-button"}
          title={isEditing ? "save" : "edit"}
          onClick={() => {
            if (isEditing) {
              setIsEditing(false);
              handleEditTask(editedTask.id, editedTask.task);
              return;
            }

            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
        <button
          aria-label={isEditing ? "cancel-button" : "delete-button"}
          title={isEditing ? "cancel" : "delete"}
          onClick={() => {
            if (isEditing) {
              setIsEditing(false);
              setEditedTask(task);
              return;
            }

            handleDeleteTask(task.id);
          }}
        >
          {isEditing ? "Cancel" : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default Todo;
