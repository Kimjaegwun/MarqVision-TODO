"use client";

import styles from "./page.module.css";
import Header from "@/components/header";
import Card from "@/components/card/card";
import { useGetTodoList } from "@/hooks/useGetTodoList";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Marq Todo</h1>
      <Header />
      <TodoList />
    </div>
  );
}

const TodoList = () => {
  const { data: todos, isLoading } = useGetTodoList();

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className={styles["list-container"]}>
      {todos?.map((task) => (
        <Card key={task.id} task={task} />
      ))}
    </div>
  );
};
