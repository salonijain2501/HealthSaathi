import { useState } from "react";
import { loginUser } from "../Services/auth.api";
import { saveToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password });
      console.log("LOGIN RESPONSE:", res.data);

      // ✅ CORRECT TOKEN SAVE
      saveToken(res.data.token);

      alert("Login Successful ✅");
      navigate("/dashboard");
    } catch (err) {
      console.log("LOGIN ERROR:", err.response);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
        <p style={{ marginTop: "10px" }}>
        Don’t have an account? <Link to="/signup">Signup</Link>
      </p>
    </form>
  );
};

export default Login;
