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
          data-completed={task.completed}
          className={styles["card-textarea"]}
          disabled={!isEditing}
          value={editedTask.task}
          onChange={(e) => setEditedTask((prev: TodoType) => ({ ...prev, task: e.target.value }))}
          title={"task"}
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
  const { references, setReferences } = useReferencesStore();

  const { mutate: editTodo } = useEditTodo();
  const { mutate: deleteTodo } = useDeleteTodo();
  const { mutate: completeTodo, isPending } = useCompleteTodo();

  const handleReference = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setReferences(task.id);
  };

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
    setEditedTask(task);
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
        data-reference={references.includes(task.id)}
        onClick={handleReference}
      >
        <span>REF{references.includes(task.id) ? "" : "+"}</span>
      </div>
      <div className={styles["card-buttons-wrapper"]}>
        <button
          className={`${styles["card-button"]} ${styles["complete-button"]}`}
          data-complete={task.completed}
          data-complete-edit={isEditing}
          onClick={(e) => {
            e.stopPropagation();
            if (!isPending) completeTodo(task.id);
          }}
        >
          {task.completed ? "☓ Undo" : "✓ Complete"}
        </button>
        <button
          className={`${styles["card-button"]} ${styles["edit-button"]}`}
          data-edit={!isEditing}
          onClick={handleEdit}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
        <button
          className={`${styles["card-button"]} ${styles["delete-button"]}`}
          data-delete={!isEditing}
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
    <div className={styles["card-container"]} data-completed={task.completed}>
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
