"use client";

import styles from "./page.module.css";
import Header from "@/components/header";
import TodoList from "./todoList";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Marq Todo</h1>
      <Header />
      <TodoList />
    </div>
  );
}
