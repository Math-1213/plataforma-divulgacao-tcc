import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../Pages/Home";
import Login from "../Pages/Login";
import WorkInfo from "../Pages/WorkInfo";
import AddWork from "../Pages/AddWork";
import Register from "../Pages/UserCreate";
import UserPage from "../Pages/UserEdit";

export default function Router() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/addworks" element={<AddWork />} />
        <Route path="/myworks" element={<WorkInfo />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account/settings" element={<UserPage />} />
      </Routes>
    </>
  );
}
