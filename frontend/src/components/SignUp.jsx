import { useState } from "react";
import "../style/addtask.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SignUp() {
  const [userData, setUserData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  });

  const handleSignUp = async () => {
    let result = await fetch("http://localhost:3200/signup", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-type": "Application/Json",
      },
    });
    result = await result.json();
    if (result.success) {
      document.cookie = "token=" + result.token;
      localStorage.setItem("login", userData.email);
      navigate("/");
    } else {
      alert(result.message);
    }
  };
  return (
    <div className="container">
      <h1>SignUp</h1>

      <label htmlFor="">Name</label>
      <input
        onChange={(event) =>
          setUserData({ ...userData, name: event.target.value })
        }
        type="text"
        name="name"
        placeholder="Enter user Name"
        className="input"
      />

      <label htmlFor="">Email</label>
      <input
        onChange={(event) =>
          setUserData({ ...userData, email: event.target.value })
        }
        type="text"
        name="email"
        placeholder="Enter Email"
        className="input"
      />

      <label htmlFor="">Password</label>
      <input
        onChange={(event) =>
          setUserData({ ...userData, password: event.target.value })
        }
        type="password"
        name="password"
        placeholder="Enter Password"
        className="input"
      />

      <button onClick={handleSignUp} className="btn">
        SignUp
      </button>
      <Link className="link" to="/login">
        Login
      </Link>
    </div>
  );
}
