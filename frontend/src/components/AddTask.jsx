import { useState } from "react";
import "../style/addtask.css";
import { useNavigate } from "react-router-dom";

export default function AddTask() {
  const [taskData, setTaskData] = useState();
  const navigate = useNavigate();
  const handleAddTask = async () => {
    let result = await fetch("http://localhost:3200/add-task", {
      method: "Post",
      body: JSON.stringify(taskData),
      credentials: "include",
      headers: {
        "Content-type": "Application/json",
      },
    });

    result = await result.json();
    if (result.success) {
      navigate("/");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="container">
      <h1>Add New Task</h1>

      <label htmlFor="">Title</label>
      <input
        onChange={(event) => {
          setTaskData({ ...taskData, title: event.target.value });
        }}
        type="text"
        name="title"
        placeholder="Enter Title"
        className="input"
      />
      <label htmlFor="">Descrition</label>
      <textarea
        onChange={(event) => {
          setTaskData({ ...taskData, description: event.target.value });
        }}
        rows={4}
        name="description"
        placeholder="Enter Description"
        className="input"
      ></textarea>
      <button onClick={handleAddTask} className="btn">
        Add New Task
      </button>
    </div>
  );
}
