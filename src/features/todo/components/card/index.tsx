import { forwardRef, useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { TodoType } from "@/types/todo";
import { useReferencesStore } from "@/features/todo/store/references";
import { useEditTodo, useDeleteTodo, useCompleteTodo } from "@/features/todo/hooks";

const CardHeader = ({ task }: { task: TodoType }) => {
  const { setReferences, references } = useReferencesStore();
  const { mutate: completeTodo, isPending } = useCompleteTodo();

  return (
    <div className={styles["card-header"]}>
      <input
        type="checkbox"
        title="checkbox"
        aria-label="checkbox"
        checked={task.completed}
        onChange={(e) => {
          e.stopPropagation();
          if (!isPending) completeTodo(task.id);
        }}
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
      isEditing,
      editedTask,
      setEditedTask,
    }: {
      task: TodoType;
      isEditing: boolean;
      editedTask: TodoType;
      setEditedTask: React.Dispatch<React.SetStateAction<TodoType>>;
    },
    ref: React.Ref<HTMLTextAreaElement>
  ) => {
    return (
      <>
        <textarea
          ref={ref}
          aria-label="task-textarea"
          className={styles["card-textarea"]}
          disabled={!isEditing}
          value={editedTask.task}
          onChange={(e) => setEditedTask((prev: TodoType) => ({ ...prev, task: e.target.value }))}
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
}: {
  task: TodoType;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  editedTask: TodoType;
  setEditedTask: (editedTask: TodoType) => void;
}) => {
  const { mutate: editTodo } = useEditTodo();
  const { mutate: deleteTodo } = useDeleteTodo();

  const handleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
      editTodo({ id: editedTask.id, task: editedTask.task });
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
    deleteTodo(task.id);
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

const Card = ({ task }: { task: TodoType }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [editedTask, setEditedTask] = useState(() => task);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    const id = requestAnimationFrame(() => {
      const todoTextarea = textareaRef.current;
      todoTextarea?.focus();
      const end = todoTextarea?.value.length ?? 0;
      todoTextarea?.setSelectionRange(end, end);
    });
    return () => cancelAnimationFrame(id);
  }, [isEditing]);

  return (
    <div className={styles["card-container"]}>
      <div className={styles["card-content"]}>
        <CardHeader task={task} />
        <CardBody
          ref={textareaRef}
          task={task}
          isEditing={isEditing}
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
      />
    </div>
  );
};

export default Card;
