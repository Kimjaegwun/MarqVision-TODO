import Skeleton from "@/components/common/skeleton";

import Card from "@/components/card/card";
import { useGetTodoList } from "@/hooks/useGetTodoList";
import useIntersection from "@/hooks/useIntersection";
import styles from "./todoList.module.css";

const TodoList = () => {
  const {
    data: todos,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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
      {hasNextPage && <div ref={ref} />}
    </div>
  );
};

export default TodoList;

const LoadingComponent = () => {
  return (
    <div className={styles["loading-container"]}>
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className={styles["loading-item"]}>
          <Skeleton width="100%" height="136.5px" />
          <div className={styles["loading-action"]}>
            <Skeleton width="100%" height="66.25px" />
            <Skeleton width="100%" height="66.25px" />
          </div>
        </div>
      ))}
    </div>
  );
};
