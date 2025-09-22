import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TodoListType, TodoType } from "@/types/todo";
import { editTodo } from "@/services/todo";

export const useEditTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, task }: { id: string; task: string }) => editTodo(id, task),
    onMutate: async ({ id, task }) => {
      await queryClient.cancelQueries({ queryKey: ["todo", "list"] });

      const prev = queryClient.getQueryData<InfiniteData<TodoListType>>(["todo", "list"]);

      if (prev) {
        const pageIdx = prev.pages.findIndex((p) => p.todos.some((t) => t.id === id));
        if (pageIdx === -1) return { prev };

        const todoIdx = prev.pages[pageIdx].todos.findIndex((t) => t.id === id);
        if (todoIdx === -1) return { prev };

        const updated: TodoType = { ...prev.pages[pageIdx].todos[todoIdx], task };

        const newPages = prev.pages.map((page, i) =>
          i !== pageIdx
            ? page
            : { ...page, todos: page.todos.map((t, j) => (j === todoIdx ? updated : t)) }
        );

        queryClient.setQueryData<InfiniteData<TodoListType>>(["todo", "list"], {
          ...prev,
          pages: newPages,
        });

        return { prev, pageIdx, todoIdx };
      }

      return { prev };
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
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["todo", "list"], ctx.prev);
    },
  });
};
