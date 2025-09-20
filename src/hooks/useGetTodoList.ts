import { useInfiniteQuery } from "@tanstack/react-query";
import { TodoListType } from "@/types/todo";
import { getTodos } from "@/services/todo";

export const useGetTodoList = () => {
  return useInfiniteQuery<TodoListType>({
    queryKey: ["todo", "list"],
    queryFn: async ({ pageParam = null }) => await getTodos(pageParam as string | null),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
    refetchOnReconnect: false,
  });
};
