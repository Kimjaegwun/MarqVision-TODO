import { http, HttpResponse } from "msw";
import { TodoType } from "@/types/todo";

let todos: TodoType[] = [];

export const handlers = [
  http.get("/api/todos", () => {
    return HttpResponse.json(todos, { status: 200 });
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
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
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
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }

    todos = todos.filter((t) => t.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post("/api/todos/complete", async ({ request }) => {
    const body = (await request.json()) as Pick<TodoType, "id">;
    const exists = todos.some((t) => t.id === body.id);
    if (!exists) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }

    const idx = todos.findIndex((t) => t.id === body.id);
    const filteredTodos = todos.filter((t) => t.id !== body.id);
    const checkReferencesCompleted = filteredTodos.every((t) => {
      return todos[idx].references.includes(t.id) && t.completed;
    });

    const updated: TodoType = {
      ...todos[idx],
      completed:
        todos[idx].references.length === 0
          ? !todos[idx].completed
          : !todos[idx].completed && checkReferencesCompleted
          ? true
          : false,
    };

    todos[idx] = updated;
    return HttpResponse.json(updated, { status: 200 });
  }),
];
