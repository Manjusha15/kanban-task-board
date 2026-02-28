import { BsKanban } from "react-icons/bs";
import { useState, useEffect } from "react";
import "./App.css";

const initialData = {
  todo: [],
  inProgress: [],
  done: [],
};

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("kanbanData");
    return saved ? JSON.parse(saved) : initialData;
  });

  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("kanbanData", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks({ ...tasks, todo: [...tasks.todo, input] });
    setInput("");
  };

  const moveTask = (from, to, index) => {
    const item = tasks[from][index];
    const updatedFrom = tasks[from].filter((_, i) => i !== index);
    const updatedTo = [...tasks[to], item];

    setTasks({
      ...tasks,
      [from]: updatedFrom,
      [to]: updatedTo,
    });
  };

  const deleteTask = (column, index) => {
    const updated = tasks[column].filter((_, i) => i !== index);
    setTasks({ ...tasks, [column]: updated });
  };

  const renderColumn = (title, key) => (
    <div className="column">
      <h2>{title}</h2>
      {tasks[key].map((task, index) => (
        <div className="card" key={index}>
          <p>{task}</p>
          <div className="buttons">
            {key !== "todo" && (
              <button onClick={() => moveTask(key, "todo", index)}>←</button>
            )}
            {key === "todo" && (
              <button onClick={() => moveTask("todo", "inProgress", index)}>→</button>
            )}
            {key === "inProgress" && (
              <button onClick={() => moveTask("inProgress", "done", index)}>→</button>
            )}
            <button onClick={() => deleteTask(key, index)}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container">
        <h1 className="title">
        <BsKanban className="icon" />
        <span>Kanban Task Board</span>
      </h1>

      <div className="inputSection">
        <input
          type="text"
          placeholder="Enter new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="board">
        {renderColumn("Todo", "todo")}
        {renderColumn("In Progress", "inProgress")}
        {renderColumn("Done", "done")}
      </div>
    </div>
  );
}