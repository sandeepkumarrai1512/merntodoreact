import { Link, Navigate, useNavigate } from "react-router-dom";
import "../style/navbar.css";
import { useEffect, useState } from "react";

function NavBar() {
  const [login, setLogin] = useState(localStorage.getItem("login"));
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("login");
    setLogin(null);
    setTimeout(() => {
      navigate("/login");
    }, 0);
  };

  useEffect(() => {
    const handleLogin = () => {
      setLogin(localStorage.getItem("login"));
    };
    window.addEventListener("localStorage-change", handleLogin);
    return () => {
      window.removeEventListener("localStorage-change", handleLogin);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">To do App</div>
      <ul className="nav-links">
        {login ? (
          <>
            <li>
              <Link to="/">List</Link>{" "}
            </li>
            <li>
              <Link to="/add">Add Task</Link>
            </li>
            <li>
              <Link onClick={logOut}>Logout</Link>
            </li>
          </>
        ) : null}
      </ul>
    </nav>
  );
}

export default NavBar;
