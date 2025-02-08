// Import necessary dependencies
import React, { useState, useEffect } from "react";
import { FaPlus, FaTrashAlt, FaCheck, FaUndo, FaMousePointer } from "react-icons/fa";
import "./App.css";

const priorityOrder = { high: 1, medium: 2, low: 3 };

// Main App Component
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Load tasks from local storage on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Save tasks to local storage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = () => {
    if (newTask.trim() === "") return;
    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      priority: "medium",
    };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  // Handle Enter key for adding a task
  const handleKeyPress = (e) => {
    if (e.key === "Enter") addTask();
  };

  // Toggle task completion
  const toggleCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Update task priority
  const updatePriority = (id, priority) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, priority: priority } : task
      )
    );
  };

  // Handle multiple select
  const handleSelect = (id) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  };

  // Handle multiple delete
  const handleMultiDelete = () => {
    setTasks(tasks.filter((task) => !selectedTasks.includes(task.id)));
    setSelectedTasks([]);
  };

  // Handle multiple complete
  const handleMultiComplete = () => {
    setTasks(
      tasks.map((task) =>
        selectedTasks.includes(task.id) ? { ...task, completed: true } : task
      )
    );
    setSelectedTasks([]);
  };

  // Handle multiple undo
  const handleMultiUndo = () => {
    setTasks(
      tasks.map((task) =>
        selectedTasks.includes(task.id) ? { ...task, completed: false } : task
      )
    );
    setSelectedTasks([]);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort(
  (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
);
  return (
    <div className="app">
      <h1>Task Management App</h1>

      {/* Add Task Section */}
      <div className="add-task">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={addTask}><FaPlus /></button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filters">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
        <button onClick={() => setFilter("completed")} className={filter === "completed" ? "active" : ""}>Completed</button>
        <button onClick={() => setFilter("incomplete")} className={filter === "incomplete" ? "active" : ""}>Incomplete</button>
      </div>

      {/* Multi-Select Section */}
      <div className="multi-select">
        <button onClick={() => setMultiSelect(!multiSelect)}>
          {multiSelect ? "Cancel Multi-Select" : "Enable Multi-Select"}
        </button>
        {multiSelect && (
          <>
            <button onClick={handleMultiDelete}><FaTrashAlt title="Delete Selected" /></button>
            <button onClick={handleMultiComplete}><FaCheck title="Complete Selected" /></button>
            <button onClick={handleMultiUndo}><FaUndo title="Undo Selected" /></button>
          </>
        )}
      </div>

      {/* Task List Section */}
      <ul className="task-list">
        {sortedTasks.map((task) => (
          <li key={task.id} className={`task ${task.priority}`}>
            <div className="task-content">
              {multiSelect && (
                <input
                  type="checkbox"
                  checked={selectedTasks.includes(task.id)}
                  onChange={() => handleSelect(task.id)}
                />
              )}
              <button onClick={() => toggleCompletion(task.id)}>
                {task.completed ? <FaUndo title="Mark as Incomplete" /> : <FaCheck title="Mark as Complete" />}
              </button>
              <span className={task.completed ? "completed" : ""}>{task.text}</span>
            </div>
            <div className="task-actions">
              <select
                value={task.priority}
                onChange={(e) => updatePriority(task.id, e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button onClick={() => deleteTask(task.id)}><FaTrashAlt title="Delete Task" /></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;