import { forwardRef, memo, useEffect, useRef, useState } from "react";
import styles from "./card.module.css";
import { TodoType } from "@/types/todo";
import { useReferencesStore } from "@/store/references";

const CardHeader = ({
  task,
  handleCompleteTask,
}: {
  task: TodoType;
  handleCompleteTask: (id: string) => void;
}) => {
  const { setReferences, references } = useReferencesStore();

  return (
    <div className={styles["card-header"]} onClick={() => handleCompleteTask(task.id)}>
      <input
        type="checkbox"
        title="checkbox"
        aria-label="checkbox"
        checked={task.completed}
        onChange={() => handleCompleteTask(task.id)}
      />
      <span className={styles["checkbox-text"]}>{task.id}</span>
      <div
        className={styles["reference-button"]}
        onClick={(e) => {
          e.stopPropagation();
          setReferences(task.id);
        }}
        style={{
          backgroundColor: references.includes(task.id)
            ? "var(--light-orange)"
            : "var(--light-gray)",
        }}
      >
        <span>REF</span>
      </div>
    </div>
  );
};

const CardBody = forwardRef(
  (
    {
      task,
      handleEditTask,
      isEditing,
      setIsEditing,
      editedTask,
      setEditedTask,
    }: {
      task: TodoType;
      handleEditTask: (id: string, value: string) => void;
      isEditing: boolean;
      setIsEditing: (isEditing: boolean) => void;
      editedTask: TodoType;
      setEditedTask: React.Dispatch<React.SetStateAction<TodoType>>;
    },
    ref: React.Ref<HTMLTextAreaElement>
  ) => {
    return (
      <>
        <textarea
          ref={ref}
          aria-label="task-edit-input"
          className={styles["card-textarea"]}
          disabled={!isEditing}
          value={editedTask.task}
          onChange={(e) => setEditedTask((prev: TodoType) => ({ ...prev, task: e.target.value }))}
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
        <div className={styles["card-footer"]}>
          <p className={styles["card-date"]}>
            [생성일: {new Date(task.createdAt).toLocaleString()}]
          </p>
          <p className={styles["card-date"]}>
            [수정일: {new Date(task.updatedAt).toLocaleString()}]
          </p>
          {task.references.length > 0 && (
            <p className={styles["card-references"]}>[참조: {task.references.join(", ")}]</p>
          )}
        </div>
      </>
    );
  }
);

CardBody.displayName = "CardBody";

const CardActions = ({
  task,
  isEditing,
  setIsEditing,
  editedTask,
  setEditedTask,
  handleEditTask,
  handleDeleteTask,
}: {
  task: TodoType;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  editedTask: TodoType;
  setEditedTask: (editedTask: TodoType) => void;
  handleEditTask: (id: string, value: string) => void;
  handleDeleteTask: (id: string) => void;
}) => {
  const handleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
      handleEditTask(editedTask.id, editedTask.task);
      return;
    }

    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditedTask(task);
      return;
    }

    handleDeleteTask(task.id);
  };

  return (
    <div className={styles["card-buttons"]}>
      <button
        aria-label={isEditing ? "save-button" : "edit-button"}
        title={isEditing ? "save" : "edit"}
        onClick={handleEdit}
      >
        {isEditing ? "Save" : "Edit"}
      </button>
      <button
        aria-label={isEditing ? "cancel-button" : "delete-button"}
        title={isEditing ? "cancel" : "delete"}
        onClick={handleDelete}
      >
        {isEditing ? "Cancel" : "Delete"}
      </button>
    </div>
  );
};

const Card = ({
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
    <div className={styles["card-container"]}>
      <div className={styles["card-content"]}>
        <CardHeader task={task} handleCompleteTask={handleCompleteTask} />
        <CardBody
          ref={textareaRef}
          task={task}
          handleEditTask={handleEditTask}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editedTask={editedTask}
          setEditedTask={setEditedTask}
        />
      </div>
      <CardActions
        task={task}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editedTask={editedTask}
        setEditedTask={setEditedTask}
        handleEditTask={handleEditTask}
        handleDeleteTask={handleDeleteTask}
      />
    </div>
  );
};

export default Card;
