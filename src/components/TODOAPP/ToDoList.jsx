import React, { useEffect, useState } from "react";
import "./TodoApp.css";

function ToDoList() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(() => {
    const savedCompleted = localStorage.getItem("completed");
    return savedCompleted ? JSON.parse(savedCompleted) : [];
  });

  const [editIndex, setEditIndex] = useState(null);
  const [editedTask, setEditedTask] = useState("");

  // Save tasks to localStorage whenever they are updated

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save completed tasks to localStorage whenever they are updated
  useEffect(() => {
    localStorage.setItem("completed", JSON.stringify(completed));
  }, [completed]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
    setError("");
  }

  function addTask() {
    const trimmedTask = newTask.trim();

    if (trimmedTask === "") {
      setError("Task cannot be empty..");
      return;
    }

    if (tasks.includes(trimmedTask)) {
      setError("Task already exists.");
      return;
    }

    if (trimmedTask.length > 100) {
      setError("Task cannot exceed 100 characters.");
      return;
    }

    setTasks((t) => [...t, trimmedTask]);
    setNewTask("");
  }

  function deleteTask(index) {
    let updatedTask = tasks.filter((_, i) => index !== i);
    setTasks(updatedTask);
  }

  function moveTaskUp(index) {
    if (index > 0) {
      const updatedtasks = [...tasks];

      [updatedtasks[index - 1], updatedtasks[index]] = [
        updatedtasks[index],
        updatedtasks[index - 1],
      ];
      setTasks(updatedtasks);
    }
  }

  function moveTaskDown(index) {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [
        updatedTasks[index + 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      addTask();
    }
  }

  function taskCompleted(index) {
    const completedTask = tasks[index];

    setCompleted((prevCompleted) => [...prevCompleted, completedTask]);

    const updatedTasks = tasks.filter((_, i) => i !== index);

    setTasks(updatedTasks);
  }

  
  function removeFromCompleted(index) {
    const updatedCompleted = completed.filter((_,i)=> i !== index);
    setCompleted(updatedCompleted)
  }
  
  function undoCompletedTask(index){
    const taskToUndo = completed[index];
    setTasks((preTasks)=>[...preTasks,taskToUndo])
    removeFromCompleted(index)
  }
  
  function editTask(index) {
    setEditIndex(index);
    setEditedTask(tasks[index]);
  }
  function saveEditedTask() {
    if (editedTask.trim() === "") {
      setError("Edited task cannot be empty.");
      return;
    }

    const updatedTasks = [...tasks];
    updatedTasks[editIndex] = editedTask.trim();
    setTasks(updatedTasks);
    setEditIndex(null);
    setEditedTask("");
    setError("");
  }

  return (
    <div>
      <div className="to-do-list">
        <h1>TODO List</h1>

        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <button className="add-button" onClick={addTask}>
          Add
        </button>

        {error && <p className="error">{error}</p>}
      </div>

      <ol>
        {tasks.map((task, index) => (
          <li key={index}>
            {/* Edit Mode */}
            {editIndex === index ? (
              <>
                <input
                  type="text"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                />
                <button className="save-button" onClick={saveEditedTask}>
                  Save
                </button>
              </>
            ) : (
              <>
                <span className="text">{task}</span>
                <button className="edit-button" onClick={() => editTask(index)}>
                  ✏️
                </button>
                <button
                  className="complete-button"
                  onClick={() => taskCompleted(index)}
                >
                  ✅
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteTask(index)}
                >
                  ❌
                </button>
                <button
                  className="move-button"
                  onClick={() => moveTaskUp(index)}
                >
                  ⬆️
                </button>
                <button
                  className="move-button"
                  onClick={() => moveTaskDown(index)}
                >
                  ⬇️
                </button>
              </>
            )}
          </li>
        ))}
      </ol>

      {completed.length !== 0 ? <h2>Completed Task</h2> : null}
      <strike>
        <ol>
          {completed.map((cTask, index) => {
            return (
              <li key={index}>
                <span className="text">{cTask}</span>
                <div>
                  <button
                    className="delete-button"
                    onClick={() => removeFromCompleted(index)}
                  >
                    ❌
                  </button>
                  <button
                    className="undo-button"
                    onClick={() => undoCompletedTask(index)}
                  >
                    ↩️ 
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </strike>
    </div>
  );
}

export default ToDoList;
