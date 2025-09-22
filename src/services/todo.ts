import { TodoListType, TodoType } from "@/types/todo";

const getTodos = async (cursor: string | null): Promise<TodoListType> => {
  const params = new URLSearchParams();
  if (cursor) {
    params.set("cursor", cursor);
  }
  const res = await fetch(`/api/todos?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const addTodo = async (input: Pick<TodoType, "task" | "references">): Promise<TodoType> => {
  const res = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to add");
  return res.json();
};

const editTodo = async (id: string, task: string): Promise<TodoType> => {
  const res = await fetch(`/api/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task }),
  });
  if (!res.ok) throw new Error("Failed to edit");
  return res.json();
};

const deleteTodo = async (id: string) => {
  const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
};

const completeTodo = async (id: string): Promise<TodoType> => {
  const res = await fetch(`/api/todos/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to complete");
  return res.json();
};

export { getTodos, addTodo, editTodo, deleteTodo, completeTodo };
