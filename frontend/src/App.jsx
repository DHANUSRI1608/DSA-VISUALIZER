import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Visualizer from "./pages/Visualizer";
import ArrayVisualizer from "./pages/ArrayVisualizer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/visualizer" element={<Visualizer />} />
      <Route
        path="/visualizer/array/algorithm/:algorithm"
        element={<ArrayVisualizer />}
      />
      <Route
        path="/visualizer/array/operation/:operation"
        element={<ArrayVisualizer />}
      />
    </Routes>
  );
}

export default App;
