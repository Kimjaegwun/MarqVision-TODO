import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoType } from "@/types/todo";
import { addTodo } from "@/services/todo";

export const useAddTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ task, references }: Pick<TodoType, "task" | "references">) => {
      await addTodo({ task, references });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo", "list"] });
    },
  });
};
