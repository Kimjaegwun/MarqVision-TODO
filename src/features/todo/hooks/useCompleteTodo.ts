import type { InfiniteData } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TodoListType, TodoType } from "@/types/todo";
import { completeTodo } from "@/services/todo";

export const useCompleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => completeTodo(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["todo", "list"] });

      const prev = queryClient.getQueryData<InfiniteData<TodoListType>>(["todo", "list"]);
      if (!prev) return { prev };

      const pageIdx = prev.pages.findIndex((p) => p.todos.some((t) => t.id === id));
      if (pageIdx === -1) return { prev };

      const todoIdx = prev.pages[pageIdx].todos.findIndex((t) => t.id === id);
      if (todoIdx === -1) return { prev };

      const allTodos = prev.pages.flatMap((p) => p.todos);
      const current = prev.pages[pageIdx].todos[todoIdx];
      const refs = current.references;

      const refsCompleted =
        refs.length === 0
          ? true
          : refs.every((refId) => {
              const ref = allTodos.find((todo) => todo.id === refId);
              return ref ? ref.completed : false;
            });

      const nextCompleted =
        refs.length === 0 ? !current.completed : !current.completed && refsCompleted ? true : false;

      const newPages = prev.pages.map((page, i) =>
        pageIdx !== i
          ? page
          : {
              ...page,
              todos: page.todos.map((todo, j) =>
                todoIdx === j ? { ...todo, completed: nextCompleted } : todo
              ),
            }
      );

      queryClient.setQueryData<InfiniteData<TodoListType>>(["todo", "list"], {
        ...prev,
        pages: newPages,
      });

      return { prev, pageIdx, todoIdx };
    },
    onSuccess: (updated: TodoType, _vars, ctx) => {
      queryClient.setQueryData<InfiniteData<TodoListType>>(["todo", "list"], (prev) => {
        if (!prev || ctx?.pageIdx === undefined || ctx?.todoIdx === undefined) return prev;

        const { pageIdx, todoIdx } = ctx;

        const pages = prev.pages.slice();
        const page = pages[pageIdx];
        const todos = page.todos.slice();

        todos[todoIdx] = updated;
        pages[pageIdx] = { ...page, todos };

        return { ...prev, pages };
      });
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData<InfiniteData<TodoListType>>(["todo", "list"], ctx.prev);
      }
      if (error.message) {
        window.alert(error.message);
      }
    },
  });
};
