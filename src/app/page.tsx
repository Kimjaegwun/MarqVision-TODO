"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [task, setTask] = useState<string>("");

  const handleAddTask = () => {
    setTasks([...tasks, task]);
    setTask("");
  };

  return (
    <div className={styles.container}>
      <h1>Marq Todo</h1>
      <div className={styles["input-wrapper"]}>
          <input
            className={styles.input}
            type="text"
            placeholder="Add a new task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button className={styles.button} onClick={handleAddTask}>
            Add
          </button>
      </div>
    </div>
  );
}
