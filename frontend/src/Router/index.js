import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../Pages/Home";
import Login from "../Pages/Login";
import WorkInfo from "../Pages/WorkInfo";
import AddWork from "../Pages/AddWork";
import Register from "../Pages/UserCreate";
import UserPage from "../Pages/UserEdit";

import PrivateRoute from "./Private";

export default function Router() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas protegidas */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/addworks"
          element={
            <PrivateRoute>
              <AddWork />
            </PrivateRoute>
          }
        />

        <Route
          path="/myworks"
          element={
            <PrivateRoute>
              <WorkInfo />
            </PrivateRoute>
          }
        />

        <Route
          path="/account/settings"
          element={
            <PrivateRoute>
              <UserPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}
