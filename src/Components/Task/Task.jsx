import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaCheck, FaUndo, FaSave } from "react-icons/fa";

function Task({
  taskId,
  task,
  multiSelect,
  selectedTasks,
  handleSelect,
  toggleCompletion,
  deleteTask,
  updatePriority,
  updateTask,
  draggedTaskId,
  hoveredTaskId,
  setTaskKeyEditing
}) {
  const [editingTask, setEditingTask] = useState(false);
  const [editedTask, setEditedTask] = useState(task.text);

  const handleEditTask = (e) => {
    setEditedTask(e.target.value);
  };

  useEffect(()=>{
    setTaskKeyEditing(taskId)
  },[editingTask,setTaskKeyEditing,taskId])

  const saveTask = () => {
    if (editedTask.trim() !== "") {
      updateTask(task.id, editedTask); // Update the task list
      setEditingTask(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveTask();
    }
  };
  return (
    <li key={task.id} className={`task ${task.priority} ${task.id === draggedTaskId ? "dragging" : ""} ${task.id === hoveredTaskId ? "hovered" : ""}`}>
      <div className="task-content">
        {multiSelect && (
          <input
            type="checkbox"
            checked={selectedTasks.includes(task.id)}
            onChange={() => handleSelect(task.id)}
          />
        )}
        <button onClick={() => toggleCompletion(task.id)}>
          {task.completed ? (
            <FaUndo title="Mark as Incomplete" />
          ) : (
            <FaCheck title="Mark as Complete" />
          )}
        </button>
        {editingTask ? (
          <div className="edit-task">
            <input
              style={{ width: "80%" }}
              type="text"
              value={editedTask}
              onChange={handleEditTask}
              onKeyDown={handleKeyDown}
            />
            <button onClick={saveTask}>
              <FaSave title="Save Task" />
            </button>
          </div>
        ) : (
          <span
            onClick={() => setEditingTask(true)}
            className={task.completed ? "completed" : ""}
            title="Click to edit the task"
          >
            {task.text}
          </span>
        )}
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
        <button onClick={() => deleteTask(task.id)}>
          <FaTrashAlt title="Delete Task" />
        </button>
      </div>
    </li>
  );
}

export default Task;
