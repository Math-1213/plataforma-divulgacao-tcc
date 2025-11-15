import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/UserCreate";

export default function Router() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}
