"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Header from "@/components/header";
import { TodoType } from "@/types/todo";
import Card from "@/components/card/card";
import { useReferencesStore } from "@/store/references";

export default function Home() {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Array<TodoType>>([]);

  const { references, initializeReferences } = useReferencesStore();

  const handleAddTask = () => {
    setTasks([
      ...tasks,
      {
        id: crypto.randomUUID(),
        task,
        createdAt: new Date(),
        updatedAt: new Date(),
        completed: false,
        references,
      },
    ]);
    setTask("");
    initializeReferences();
  };

  const handleEditTask = (id: string, task: string) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const taskIndex = newTasks.findIndex((t) => t.id === id);
      newTasks[taskIndex] = {
        ...newTasks[taskIndex],
        task,
        updatedAt: new Date(),
      };
      return newTasks;
    });
  };

  const handleCompleteTask = (id: string) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const filteredTasks = newTasks.filter((t) => t.id !== id);
      const taskIndex = newTasks.findIndex((t) => t.id === id);
      const checkReferencesCompleted = filteredTasks.every((t) => {
        return newTasks[taskIndex].references.includes(t.id) && t.completed;
      });

      newTasks[taskIndex] = {
        ...newTasks[taskIndex],
        completed:
          newTasks[taskIndex].references.length === 0
            ? !newTasks[taskIndex].completed
            : !newTasks[taskIndex].completed && checkReferencesCompleted
            ? true
            : false,
      };
      return newTasks;
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
  };

  return (
    <div className={styles.container}>
      <h1>Marq Todo</h1>
      <Header task={task} setTask={setTask} handleAddTask={handleAddTask} />
      <div className={styles["list-container"]}>
        {tasks.map((task) => (
          <Card
            key={task.id}
            task={task}
            handleEditTask={handleEditTask}
            handleDeleteTask={handleDeleteTask}
            handleCompleteTask={handleCompleteTask}
          />
        ))}
      </div>
    </div>
  );
}
