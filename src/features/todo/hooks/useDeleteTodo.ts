import type { InfiniteData } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TodoListType } from "@/types/todo";
import { deleteTodo } from "@/services/todo";

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["todo", "list"] });

      const prev = queryClient.getQueryData<InfiniteData<TodoListType>>(["todo", "list"]);
      if (!prev) return { prev };

      const pageIdx = prev.pages.findIndex((p) => p.todos.some((t) => t.id === id));
      if (pageIdx === -1) return { prev };

      const newPages = prev.pages.map((p, i) =>
        i !== pageIdx ? p : { ...p, todos: p.todos.filter((t) => t.id !== id) }
      );

      queryClient.setQueryData<InfiniteData<TodoListType>>(["todo", "list"], {
        ...prev,
        pages: newPages,
      });

      return { prev };
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
