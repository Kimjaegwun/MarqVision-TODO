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
      const tempTodo: TodoType = {
        id: tempId,
        task,
        createdAt: new Date(),
        updatedAt: new Date(),
        completed: false,
        references: references ?? [],
      };

      if (prev) {
        const first = prev.pages[0];
        const newFirst = { ...first, todos: [tempTodo, ...first.todos] };
        const newPages = [newFirst, ...prev.pages.slice(1)];

        queryClient.setQueryData<InfiniteData<TodoListType>>(["todo", "list"], {
          ...prev,
          pages: newPages,
        });
      } else {
        queryClient.setQueryData<InfiniteData<TodoListType>>(["todo", "list"], {
          pageParams: [null],
          pages: [{ todos: [tempTodo], nextCursor: null, hasMore: false }],
        });
      }

      return { prev };
    },
    onSuccess: (created) => {
      queryClient.setQueryData<InfiniteData<TodoListType>>(["todo", "list"], (prev) => {
        if (!prev) return prev;

        const firstPage = prev.pages[0];
        const firstPageTodos = [created, ...firstPage.todos.slice(1)];

        const newPages = [{ ...firstPage, todos: firstPageTodos }, ...prev.pages.slice(1)];

        return { ...prev, pages: newPages };
      });
    },
    onError: (_err, _var, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData<InfiniteData<TodoListType>>(["todo", "list"], ctx.prev);
      }
    },
  });
};
