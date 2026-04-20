function TaskList({ tasks, onToggle }) {
  if (!tasks.length) {
    return <p className="muted">No exams or assignments yet. Add one to stay ahead.</p>;
  }

  return (
    <div className="taskStack">
      {tasks.map((task) => (
        <button
          key={task._id}
          type="button"
          className={task.completed ? "taskCard done" : "taskCard"}
          onClick={() => onToggle(task._id)}
        >
          <div>
            <strong>{task.title}</strong>
            <p className="muted">
              {task.type} | Due {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
          <span>{task.completed ? "Completed" : "Mark done"}</span>
        </button>
      ))}
    </div>
  );
}

export default TaskList;
