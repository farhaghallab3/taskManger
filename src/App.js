import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Tasks from "./pages/Tasks";
import CompletedTasks from "./pages/CompletedTasks";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/completed" element={<CompletedTasks />} />
      </Routes>
    </Router>
  );
};

export default App;
