"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Input from "@/components/input";
import TodoList from "@/components/list";

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
      <Input task={task} setTask={setTask} handleAddTask={handleAddTask} />
      <TodoList tasks={tasks} />
    </div>
  );
}
