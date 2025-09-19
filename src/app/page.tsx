"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Header from "@/components/header";
import { TodoType } from "@/types/todo";
import Card from "@/components/card/card";

export default function Home() {
  // const handleCompleteTask = (id: string) => {
  //   setTasks((prevTasks) => {
  //     const newTasks = [...prevTasks];
  //     const filteredTasks = newTasks.filter((t) => t.id !== id);
  //     const taskIndex = newTasks.findIndex((t) => t.id === id);
  //     const checkReferencesCompleted = filteredTasks.every((t) => {
  //       return newTasks[taskIndex].references.includes(t.id) && t.completed;
  //     });

  //     if (newTasks[taskIndex].references.length > 0 && !checkReferencesCompleted) {
  //       window.alert("참조된 작업이 모두 완료되어야 합니다.");
  //     }

  //     newTasks[taskIndex] = {
  //       ...newTasks[taskIndex],
  //       completed:
  //         newTasks[taskIndex].references.length === 0
  //           ? !newTasks[taskIndex].completed
  //           : !newTasks[taskIndex].completed && checkReferencesCompleted
  //           ? true
  //           : false,
  //     };
  //     return newTasks;
  //   });
  // };

  return (
    <div className={styles.container}>
      <h1>Marq Todo</h1>
      <Header />
      <TodoList />
    </div>
  );
}

const TodoList = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data);
    })();
  }, []);

  return (
    <div className={styles["list-container"]}>
      {todos.map((task) => (
        <Card
          key={task.id}
          task={task}
          handleEditTask={() => {}}
          handleDeleteTask={() => {}}
          handleCompleteTask={() => {}}
        />
      ))}
    </div>
  );
};
