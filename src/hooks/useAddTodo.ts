import type { InfiniteData } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TodoListType, TodoType } from "@/types/todo";
import { addTodo } from "@/services/todo";

export const useAddTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ task, references }: Pick<TodoType, "task" | "references">) =>
      addTodo({ task, references }),
    onMutate: async ({ task, references }) => {
      await queryClient.cancelQueries({ queryKey: ["todo", "list"] });

      const prev = queryClient.getQueryData<InfiniteData<TodoListType>>(["todo", "list"]);

      const tempId = `temp-${Date.now()}`;
      const optimistic: TodoType = {
        id: tempId,
        task,
        createdAt: new Date(),
        updatedAt: new Date(),
        completed: false,
        references: references ?? [],
      };

      if (prev) {
        const first = prev.pages[0];
        const newFirst = { ...first, todos: [optimistic, ...first.todos] };
        const newPages = [newFirst, ...prev.pages.slice(1)];

        queryClient.setQueryData<InfiniteData<TodoListType>>(["todo", "list"], {
          ...prev,
          pages: newPages,
        });
      } else {
        queryClient.setQueryData<InfiniteData<TodoListType>>(["todo", "list"], {
          pageParams: [null],
          pages: [{ todos: [optimistic], nextCursor: null, hasMore: false }],
        });
      }

      return { prev, tempId };
    },
    onSuccess: (created, _vars, ctx) => {
      queryClient.setQueryData<InfiniteData<TodoListType>>(["todo", "list"], (prev) => {
        if (!prev) return prev;

        const pages = prev.pages.slice();
        const firstPage = pages[0];

        const firstPageTodos = firstPage.todos.slice();
        const idx = firstPageTodos.findIndex((t) => t.id === ctx?.tempId) || 0;

        firstPageTodos[idx] = created;
        pages[0] = { ...firstPage, todos: firstPageTodos };

        return { ...prev, pages };
      });
    },
    onError: (_err, _var, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData<InfiniteData<TodoListType>>(["todo", "list"], ctx.prev);
      }
    },
  });
};
