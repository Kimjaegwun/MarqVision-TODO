import { http, HttpResponse } from "msw";
import { TodoType } from "@/types/todo";

let todos: TodoType[] = [];

export const handlers = [
  http.get("/api/todos", async ({ request }) => {
    // delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") ?? "10");
    const cursor = url.searchParams.get("cursor") ?? null;

    const sorted = [...todos].sort((a, b) => {
      const aT = new Date(a.createdAt).getTime();
      const bT = new Date(b.createdAt).getTime();
      return bT - aT;
    });

    const start = cursor ? sorted.findIndex((t) => t.id === cursor) : 0;

    const items = sorted.slice(start, start + limit);
    const next = sorted[start + limit];
    const nextCursor = next ? next.id : null;
    const hasMore = Boolean(next);

    return HttpResponse.json({ todos: items, nextCursor, hasMore }, { status: 200 });
  }),

  http.post("/api/todos", async ({ request }) => {
    const body = (await request.json()) as Pick<TodoType, "task" | "references">;

    const id = crypto.randomUUID();
    const newTodo: TodoType = {
      id,
      task: body.task,
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: false,
      references: body.references || [],
    };

    todos = [newTodo, ...todos];
    return HttpResponse.json(newTodo, { status: 201 });
  }),

  http.put("/api/todos/:id", async ({ params, request }) => {
    const { id } = params as Pick<TodoType, "id">;
    const body = (await request.json()) as Pick<TodoType, "task">;

    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1) {
      return HttpResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    const updated: TodoType = {
      ...todos[idx],
      task: body.task,
      updatedAt: new Date(),
    };

    todos[idx] = updated;
    return HttpResponse.json(updated, { status: 200 });
  }),

  http.delete("/api/todos/:id", async ({ params }) => {
    const { id } = params as Pick<TodoType, "id">;
    const exists = todos.some((t) => t.id === id);
    if (!exists) {
      return HttpResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    const references = todos.filter((t) => t.references.includes(id));
    if (references.length > 0) {
      return HttpResponse.json({ message: "References exist" }, { status: 400 });
    }

    todos = todos.filter((t) => t.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post("/api/todos/complete", async ({ request }) => {
    const body = (await request.json()) as Pick<TodoType, "id">;
    const exists = todos.some((t) => t.id === body.id);
    if (!exists) {
      return HttpResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    const idx = todos.findIndex((t) => t.id === body.id);
    const filteredTodos = todos.filter((t) => t.id !== body.id);
    const checkReferencesCompleted = filteredTodos.every((t) => {
      if (!todos[idx].references.includes(t.id)) return true;
      return t.completed;
    });

    const updated: TodoType = {
      ...todos[idx],
      completed:
        todos[idx].references.length === 0
          ? !todos[idx].completed
          : !todos[idx].completed && checkReferencesCompleted
          ? true
          : false,
      updatedAt: new Date(),
    };

    todos[idx] = updated;
    return HttpResponse.json(updated, { status: 200 });
  }),
];
