import React from "react";
import { useParams } from "react-router-dom";
import StackVisualizer from "./StackVisualizer";
import ArrayVisualizer from "./ArrayVisualizer";

const DataStructureVisualizer = () => {
  const { dsId } = useParams();

  switch (dsId) {
    case "stack":
      return <StackVisualizer />;
    case "array":
      return <ArrayVisualizer />;
    case "queue":
      return (
        <div className="min-h-screen flex items-center justify-center text-white text-2xl">
          Queue Visualizer Coming Soon!
        </div>
      );
    default:
      return (
        <div className="min-h-screen flex items-center justify-center text-white text-2xl">
          Visualization for {dsId} coming soon!
        </div>
      );
  }
};

export default DataStructureVisualizer;
