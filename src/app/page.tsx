"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Input from "@/components/input";
import TodoList from "@/components/list";

export default function Home() {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<string[]>([]);

  const handleAddTask = () => {
    setTasks([...tasks, task]);
    setTask("");
  };

  const handleEditTask = (index: number, task: string) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      newTasks[index] = task;
      return newTasks;
    });
  };

  const handleDeleteTask = (index: number) => {
    setTasks((prevTasks) => prevTasks.filter((t, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      <h1>Marq Todo</h1>
      <Input task={task} setTask={setTask} handleAddTask={handleAddTask} />
      <TodoList tasks={tasks} handleEditTask={handleEditTask} handleDeleteTask={handleDeleteTask} />
    </div>
  );
}
