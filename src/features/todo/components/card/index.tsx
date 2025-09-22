import { forwardRef, useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { TodoType } from "@/types/todo";
import { useReferencesStore } from "@/features/todo/store/references";
import { useEditTodo, useDeleteTodo, useCompleteTodo } from "@/features/todo/hooks";

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
        <span className={styles["card-id"]}># {task.id}</span>
        <div className={styles["card-footer"]}>
          <p className={styles["card-date"]}>
            created: {new Date(task.createdAt).toLocaleString()}
          </p>
          <p className={styles["card-date"]}>
            updated: {new Date(task.updatedAt).toLocaleString()}
          </p>
          {task.references.length > 0 && (
            <p className={styles["card-references"]}>ref: {task.references.join(", ")}</p>
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
  const { setReferences, references } = useReferencesStore();

  const { mutate: editTodo } = useEditTodo();
  const { mutate: deleteTodo } = useDeleteTodo();
  const { mutate: completeTodo, isPending } = useCompleteTodo();

  const handleEdit = () => {
    if (task.completed) {
      window.alert("Completed tasks cannot be edited");
      return;
    }

    if (isEditing) {
      setIsEditing(false);
      editTodo({ id: editedTask.id, task: editedTask.task });
      return;
    }

    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setIsEditing(false);
    editTodo({ id: editedTask.id, task: editedTask.task });
  };

  const handleDelete = () => {
    const result = window.confirm("do you really want to delete?");
    if (!result) return;
    deleteTodo(task.id);
  };

  return (
    <div className={styles["card-buttons"]}>
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
      <div className={styles["card-buttons-wrapper"]}>
        <button
          aria-label="complete-button"
          title="complete"
          onClick={(e) => {
            e.stopPropagation();
            if (!isPending) completeTodo(task.id);
          }}
          style={{
            backgroundColor: task.completed ? "var(--button)" : "var(--foreground)",
          }}
        >
          {task.completed ? "☓ Undo" : "✓ Complete"}
        </button>
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
          onClick={isEditing ? handleCancel : handleDelete}
        >
          {isEditing ? "Cancel" : "Delete"}
        </button>
      </div>
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
    <div
      className={styles["card-container"]}
      style={{
        backgroundColor: task.completed ? "var(--light-surface)" : "var(--background)",
        opacity: task.completed ? 0.7 : 1,
      }}
    >
      <CardActions
        task={task}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editedTask={editedTask}
        setEditedTask={setEditedTask}
      />
      <CardBody
        ref={textareaRef}
        task={task}
        isEditing={isEditing}
        editedTask={editedTask}
        setEditedTask={setEditedTask}
      />
    </div>
  );
};

export default Card;
