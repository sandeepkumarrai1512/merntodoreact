import { Link } from "react-router-dom";
import "../style/list.css";
import { Fragment, useEffect, useState } from "react";

export default function List() {
  const [taskData, setTaskData] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);

  const selectAll = (event) => {
    if (event.target.checked) {
      let items = taskData.map((item) => item._id);
      setSelectedTask(items);
    } else {
      setSelectedTask([]);
    }
  };

  const selectSingleItem = (id) => {
    if (selectedTask.includes(id)) {
      let items = selectedTask.filter((item) => item != id);
      setSelectedTask(items);
    } else {
      setSelectedTask([id, ...selectedTask]);
    }
  };

  const deleteMultiple = async () => {
    let item = await fetch(import.meta.env.VITE_API_URL + "/delete-multiple/", {
      method: "delete",
      body: JSON.stringify(selectedTask),
      credentials: "include",
      headers: {
        "Content-type": "Application/Json",
      },
    });

    item = await item.json();
    if (item.success) {
      getListData();
      setSelectedTask([]);
    } else {
      alert("Try after sometime");
    }
  };

  const getListData = async () => {
    let list = await fetch(import.meta.env.VITE_API_URL + "/tasks", {
      credentials: "include",
    });
    list = await list.json();
    if (list.success) {
      setTaskData(list.result);
    }
  };

  const deleteTask = async (id) => {
    let item = await fetch(import.meta.env.VITE_API_URL + "/delete/" + id, {
      method: "delete",
      credentials: "include",
    });
    item = await item.json();

    if (item.success) {
      getListData();
      setSelectedTask((prev) => prev.filter((itemId) => itemId !== id));
    } else {
      alert("Try after sometime");
    }
  };

  useEffect(() => {
    getListData();
  }, []);

  return (
    <div className="list-container">
      <h1>To do List</h1>
      <button onClick={deleteMultiple} className="delete-item delete-multiple">
        Delete
      </button>
      <ul className="task-list">
        <li className="list-header">
          <input
            onChange={selectAll}
            type="checkbox"
            checked={
              taskData.length > 0 && selectedTask.length === taskData.length
            }
          />
        </li>
        <li className="list-header">Sr. No.</li>
        <li className="list-header">Title</li>
        <li className="list-header">Description</li>
        <li className="list-header">Action</li>

        {taskData &&
          taskData.map((item, index) => {
            return (
              <Fragment key={item._id || index}>
                <li className="list-item">
                  <input
                    onChange={() => selectSingleItem(item._id)}
                    checked={selectedTask.includes(item._id)}
                    type="checkbox"
                  />
                </li>
                <li className="list-item">{index + 1}</li>
                <li className="list-item">{item.title}</li>
                <li className="list-item">{item.description}</li>
                <li className="list-item">
                  <button
                    onClick={() => deleteTask(item._id)}
                    className="delete-item"
                  >
                    Delete
                  </button>
                  <Link to={"/update/" + item._id} className="update-item">
                    Update
                  </Link>
                </li>
              </Fragment>
            );
          })}
      </ul>
    </div>
  );
}
