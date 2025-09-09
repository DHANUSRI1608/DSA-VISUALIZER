import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Visualizer from "./pages/Visualizer";
import DataStructureVisualizer from "./pages/DataStructureVisualizer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/visualizer" element={<Visualizer />} />
      <Route path="/visualizer/:dsId" element={<DataStructureVisualizer />} />
    </Routes>
  );
}

export default App;
