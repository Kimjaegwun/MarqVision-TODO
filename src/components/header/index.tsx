import styles from "./index.module.css";
import { useReferencesStore } from "@/store/references";
import { useState, useEffect } from "react";
import { TodoType } from "@/types/todo";

const Header = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<TodoType[]>([]);

  const { references, setReferences } = useReferencesStore();

  const handleAddTask = async () => {
    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ task }),
    }).then(async () => {
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data);
    });
  };

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data);
    })();
  }, []);

  console.log(todos);

  return (
    <div className={styles["header-container"]}>
      <div className={styles["header-wrapper"]}>
        <input
          aria-label="task-input"
          className={styles["header-input"]}
          type="text"
          placeholder="Add a new task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          // onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
        />
        <button
          className={styles["header-button"]}
          onClick={handleAddTask}
          aria-label="task-add-button"
        >
          Add
        </button>
      </div>
      {references.length > 0 && (
        <div className={styles["references-container"]}>
          <p className={styles["references-title"]}>References</p>
          {references.map((reference) => (
            <div className={styles["references-wrapper"]} key={reference}>
              <span>{reference}</span>
              <button
                className={styles["references-button"]}
                aria-label="references-button"
                onClick={() => setReferences(reference)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
