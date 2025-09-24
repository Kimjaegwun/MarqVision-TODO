import Skeleton from "@/shared/components/skeleton";

import Card from "@/features/todo/components/card";
import { useGetTodoList } from "@/features/todo/hooks/useGetTodoList";
import useIntersection from "@/shared/hooks/useIntersection";
import styles from "./index.module.css";

const TodoList = () => {
  const {
    data: todos,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useGetTodoList();

  const { ref } = useIntersection({
    threshold: 0.5,
    onIntersect: () => {
      fetchNextPage();
    },
  });

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className={styles["list-container"]}>
      {todos?.pages
        .flatMap((page) => page.todos)
        .map((task) => (
          <Card key={task.id} task={task} />
        ))}
      {isFetchingNextPage && <LoadingComponent />}
      {hasNextPage && !isFetching && <div ref={ref} />}
    </div>
  );
};

export default TodoList;

const LoadingComponent = () => {
  return (
    <div className={styles["loading-container"]}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className={styles["loading-item"]}>
          <div className={styles["loading-item-buttons"]}>
            <Skeleton width="38px" height="20px" />
            <Skeleton width="160px" height="20px" />
          </div>
          <Skeleton width="100%" height="110px" />
        </div>
      ))}
    </div>
  );
};
