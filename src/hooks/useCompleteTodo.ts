import { TodoType } from "@/types/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeTodo } from "@/services/todo";

export const useCompleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await completeTodo(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["todo", "list"] });
      const prev = queryClient.getQueryData<TodoType[]>(["todo", "list"]);
      if (prev) {
        const idx = prev.findIndex((t) => t.id === id);
        const filteredTodos = prev.filter((t) => t.id !== id);
        const checkReferencesCompleted = filteredTodos.every((t) => {
          return prev[idx].references.includes(t.id) && t.completed;
        });

        queryClient.setQueryData<TodoType[]>(
          ["todo", "list"],
          prev.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed:
                    prev[idx].references.length === 0
                      ? !prev[idx].completed
                      : !prev[idx].completed && checkReferencesCompleted
                      ? true
                      : false,
                }
              : t
          )
        );
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["todo", "list"], ctx.prev);
    },
  });
};
