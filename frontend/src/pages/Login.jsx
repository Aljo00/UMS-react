import React, { useState } from "react";
import axios from "../axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ name: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", form);
      dispatch(setUser(res.data));
      navigate("/");
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login to your account</h2>
      <input
        type="email"
        name="email"
        placeholder="Enter you email"
        onChange={handlleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        onChange={handlleChange}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
