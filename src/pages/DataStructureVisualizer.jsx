import React from "react";
import { useParams } from "react-router-dom";
import StackVisualizer from "./StackVisualizer";
import ArrayVisualizer from "./ArrayVisualizer";
import QueueVisualizer from "./QueueVisualizer";
import LinkedListVisalizer from "./LinkedListVisualizer";
import TreeVisualizer from "./TreeVisualizer";
import GraphVisualizer from "./GraphVisualizer";
const DataStructureVisualizer = () => {
  const { dsId } = useParams();

  switch (dsId) {
    case "stack":
      return <StackVisualizer />;
    case "array":
      return <ArrayVisualizer />;
    case "queue":
      return <QueueVisualizer />
    case "linked-list":
      return <LinkedListVisalizer />
    case "tree":
      return <TreeVisualizer />
    case "graph":
      return <GraphVisualizer />
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
