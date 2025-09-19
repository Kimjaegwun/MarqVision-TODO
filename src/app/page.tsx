"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Input from "@/components/input";
import TodoList from "@/components/list";
import { TodoType } from "@/types/todo";

export default function Home() {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Array<TodoType>>([]);

  const handleAddTask = () => {
    setTasks([
      ...tasks,
      {
        id: crypto.randomUUID(),
        task,
        createdAt: new Date(),
        updatedAt: new Date(),
        completed: false,
        reference: [],
      },
    ]);
    setTask("");
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
      const taskIndex = newTasks.findIndex((t) => t.id === id);
      newTasks[taskIndex] = {
        ...newTasks[taskIndex],
        completed: !newTasks[taskIndex].completed,
      };
      return newTasks;
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
  };

  const handleAddReference = (id: string, reference: string) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const taskIndex = newTasks.findIndex((t) => t.id === id);
      newTasks[taskIndex] = {
        ...newTasks[taskIndex],
        reference: [...newTasks[taskIndex].reference, reference],
      };
      return newTasks;
    });
  };

  return (
    <div className={styles.container}>
      <h1>Marq Todo</h1>
      <Input task={task} setTask={setTask} handleAddTask={handleAddTask} />
      <TodoList
        tasks={tasks}
        handleEditTask={handleEditTask}
        handleDeleteTask={handleDeleteTask}
        handleCompleteTask={handleCompleteTask}
      />
    </div>
  );
}
