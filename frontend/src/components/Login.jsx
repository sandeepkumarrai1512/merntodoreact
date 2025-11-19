import { useState } from "react";
import "../style/addtask.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  }, [navigate]);
  

  const handleLogin = async () => {
    let result = await fetch("http://localhost:3200/login", {
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
      window.dispatchEvent(new Event("localStorage-change"));
      navigate("/");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>

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

      <button onClick={handleLogin} className="btn">
        Login
      </button>
      <Link className="link" to="/signup">
        SignUp
      </Link>
    </div>
  );
}
