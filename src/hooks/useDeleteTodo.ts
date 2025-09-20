import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "@/services/todo";

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteTodo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo", "list"] });
    },
  });
};
