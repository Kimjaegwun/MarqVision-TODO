import { useQuery } from "@tanstack/react-query";
import { TodoType } from "@/types/todo";
import { getTodos } from "@/services/todo";

export const useGetTodoList = () => {
  return useQuery<TodoType[]>({
    queryKey: ["todo", "list"],
    queryFn: async () => await getTodos(),
  });
};
