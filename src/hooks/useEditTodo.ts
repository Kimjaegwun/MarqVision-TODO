import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TodoType } from "@/types/todo";
import { editTodo } from "@/services/todo";

export const useEditTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, task }: { id: string; task: string }) => {
      await editTodo(id, task);
    },
    onMutate: async ({ id, task }) => {
      await queryClient.cancelQueries({ queryKey: ["todo", "list"] });
      const prev = queryClient.getQueryData<TodoType[]>(["todo", "list"]);
      if (prev) {
        queryClient.setQueryData<TodoType[]>(
          ["todo", "list"],
          prev.map((t) => (t.id === id ? { ...t, task } : t))
        );
      }
      return { prev };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo", "list"] });
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["todo", "list"], ctx.prev);
    },
  });
};
