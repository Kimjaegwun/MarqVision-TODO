import { TodoType } from "@/types/todo";

export const getTodos = async (): Promise<TodoType[]> => {
  const res = await fetch("/api/todos");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export const addTodo = async (input: Pick<TodoType, "task" | "references">): Promise<TodoType> => {
  const res = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to add");
  return res.json();
};

export const editTodo = async (id: string, task: string): Promise<TodoType> => {
  const res = await fetch(`/api/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task }),
  });
  if (!res.ok) throw new Error("Failed to edit");
  return res.json();
};

export const deleteTodo = async (id: string) => {
  const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
};

export const completeTodo = async (id: string): Promise<TodoType> => {
  const res = await fetch(`/api/todos/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to complete");
  return res.json();
};
