import { useEffect, useState } from "react";
import "../style/addtask.css";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateTask() {
  const [taskData, setTaskData] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  const updateTask = async () => {
    let task = await fetch(import.meta.env.VITE_API_URL + "/update-task", {
      method: "put",
      body: JSON.stringify(taskData),
      credentials: "include",
      headers: {
        "Content-type": "Application/Json",
      },
    });

    task = await task.json();
    if (task.success) {
      navigate("/");
    } else {
      alert("Try after some time");
    }
  };

  const getTask = async (id) => {
    let task = await fetch(import.meta.env.VITE_API_URL + "/task/" + id, {
      credentials: "include",
    });
    task = await task.json();
    if (task.success) {
      setTaskData(task.result);
    }
  };

  useEffect(() => {
    getTask(id);
  }, []);

  return (
    <div className="container">
      <h1>Update Task</h1>

      <label htmlFor="">Title</label>
      <input
        value={taskData?.title}
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
        value={taskData?.description}
        onChange={(event) => {
          setTaskData({ ...taskData, description: event.target.value });
        }}
        rows={4}
        name="description"
        placeholder="Enter Description"
        className="input"
      ></textarea>
      <button onClick={updateTask} className="btn">
        Update Task
      </button>
    </div>
  );
}
