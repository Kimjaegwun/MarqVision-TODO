const TodoList = ({ tasks }: { tasks: string[] }) => {
  return <div>
    {tasks.map((task) => (
      <div key={task}>{task}</div>
    ))}
  </div>;
};

export default TodoList;