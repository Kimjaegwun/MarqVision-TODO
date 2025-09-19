import { http, HttpResponse } from "msw";
import { TodoType } from "@/types/todo";

let todos: TodoType[] = [];

export const handlers = [
  http.get("/api/todos", () => {
    return HttpResponse.json(todos, { status: 200 });
  }),

  http.post("/api/todos", async ({ request }) => {
    const body = await request.json().catch(() => ({} as Partial<TodoType>));

    const id =
      (body as Partial<TodoType>).id ??
      (globalThis.crypto && "randomUUID" in globalThis.crypto
        ? globalThis.crypto.randomUUID()
        : Math.random().toString(36).slice(2));

    const newTodo: TodoType = {
      id,
      task: (body as Partial<TodoType>).task ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: (body as Partial<TodoType>).completed ?? false,
      references: (body as Partial<TodoType>).references ?? [],
    };

    todos = [newTodo, ...todos];
    return HttpResponse.json(newTodo, { status: 201 });
  }),

  http.put("/api/todos/:id", async ({ params, request }) => {
    const { id } = params as { id: string };
    const body = await request.json().catch(() => ({} as Partial<TodoType>));

    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }

    const updated: TodoType = {
      ...todos[idx],
      ...(body as Partial<TodoType>),
      updatedAt: new Date(),
    };

    todos[idx] = updated;
    return HttpResponse.json(updated, { status: 200 });
  }),

  http.delete("/api/todos/:id", async ({ params }) => {
    const { id } = params as { id: string };
    const exists = todos.some((t) => t.id === id);
    if (!exists) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }

    todos = todos.filter((t) => t.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];
