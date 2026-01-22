import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../Services/auth.api";

const Signup = () => {
  console.log("Signup Page Loaded");

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signupUser(form);
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Signup</h2>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button style={styles.button} type="submit">
          Signup
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
  },
  form: {
    background: "white",
    padding: "20px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  button: {
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
