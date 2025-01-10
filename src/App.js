// Import necessary dependencies
import React, { useState, useEffect } from "react";
import { FaPlus, FaTrashAlt, FaCheck, FaUndo } from "react-icons/fa";
import "./App.css";

// Main App Component
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");

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

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

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

      {/* Task List Section */}
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task.id} className={`task ${task.priority}`}>
            <div className="task-content">
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
              <button onClick={() => deleteTask(task.id)}><FaTrashAlt /></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;