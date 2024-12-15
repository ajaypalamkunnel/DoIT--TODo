import React, { useState } from "react";
import "./TodoApp.css";

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [error,setError] = useState("")

  function handleInputChange(event) {
    setNewTask(event.target.value);
    setError("")
  }

  function addTask() {
    const trimmedTask = newTask.trim();

    if(trimmedTask === ""){
        setError("Task cannot be empty..")
        return;
    }

    if(tasks.includes(trimmedTask)){
        setError("Task already exists.");
        return;
    }

    if (trimmedTask.length > 100) {
        setError("Task cannot exceed 100 characters.");
        return;
    }

    setTasks((t)=>[...t,trimmedTask])
    setNewTask("")
  }

  function deleteTask(index) {
    let updatedTask = tasks.filter((_,i)=>index !== i);
    setTasks(updatedTask)
  }

  function moveTaskUp(index) {
    if(index>0){
        const updatedtasks = [...tasks];

        [updatedtasks[index-1],updatedtasks[index]]=
        [updatedtasks[index],updatedtasks[index-1]]
        setTasks(updatedtasks)
    }
  }

  function moveTaskDown(index) {
    if(index < tasks.length-1){

        const updatedTasks = [...tasks];
        [updatedTasks[index],updatedTasks[index+1]]=
        [updatedTasks[index+1],updatedTasks[index]]
        setTasks(updatedTasks)
    }
  }

  function handleKeyDown(event){
    if(event.key === 'Enter'){
        addTask()
    }
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

        <button  className="add-button" onClick={addTask}>
          Add
        </button>

        {error && <p className="error">{error}</p> }
        
      </div>
      

      <ol>
        {tasks.map((task,index)=>{
           
            
          return ( <li key={index}>
                <span className="text">{task}</span>
                <button className="delete-button" onClick={()=>deleteTask(index)}>
                    ❌
                </button>

                <button className="move-button" onClick={()=>moveTaskUp(index)}>
                    ⬆️
                </button>

                <button className="move-button" onClick={()=>moveTaskDown(index)}>
                    ⬇️
                </button>

            </li>)
        })}
      </ol>
      




    </div>
  );
}

export default ToDoList;
