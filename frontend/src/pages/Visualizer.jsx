// DSAVisualizer.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Layers,
  Code,
  GitBranch,
  Network,
  Cpu,
  ArrowRight,
} from "lucide-react";

const DSAVisualizer = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const dataStructures = [
    {
      id: "array",
      name: "Array",
      icon: <BarChart3 size={28} />,
      color: "from-blue-500 to-cyan-500",
      description: "Visualize searching and sorting algorithms",
      operations: ["Insert", "Delete", "Update", "Traverse"],
      algorithms: [
        "Linear Search",
        "Binary Search",
        "Bubble Sort",
        "Quick Sort",
        "Merge Sort",
      ],
    },
    {
      id: "stack",
      name: "Stack",
      icon: <Layers size={28} />,
      color: "from-amber-500 to-orange-500",
      description: "Visualize LIFO operations like push and pop",
      operations: ["Push", "Pop", "Peek", "isEmpty"],
      algorithms: ["Balanced Parentheses", "Infix to Postfix", "Undo/Redo"],
    },
    {
      id: "queue",
      name: "Queue",
      icon: <Code size={28} />,
      color: "from-green-500 to-teal-500",
      description: "Visualize FIFO operations like enqueue and dequeue",
      operations: ["Enqueue", "Dequeue", "Front", "Rear"],
      algorithms: ["Round Robin Scheduling", "Breadth First Search"],
    },
    {
      id: "linked-list",
      name: "Linked List",
      icon: <GitBranch size={28} />,
      color: "from-purple-500 to-pink-500",
      description: "Visualize singly, doubly and circular linked lists",
      operations: ["Insertion", "Deletion", "Traversal", "Reversal"],
      algorithms: ["Detect Cycle", "Merge Two Lists", "Find Middle"],
    },
    {
      id: "tree",
      name: "Tree",
      icon: <Network size={28} />,
      color: "from-indigo-500 to-blue-500",
      description: "Visualize binary trees, BST, and traversal algorithms",
      operations: ["Insert", "Delete", "Height", "Traverse"],
      algorithms: ["DFS", "BFS", "Inorder Traversal", "Preorder", "Postorder"],
    },
    {
      id: "graph",
      name: "Graph",
      icon: <Cpu size={28} />,
      color: "from-red-500 to-pink-500",
      description: "Visualize graph algorithms like BFS, DFS, and Dijkstra",
      operations: ["Add Vertex", "Add Edge", "Remove Edge"],
      algorithms: [
        "BFS",
        "DFS",
        "Dijkstra",
        "Kruskal",
        "Prim",
        "Topological Sort",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-10 text-center">
          Data Structures & Algorithms Visualizer
        </h1>
        <div className="grid grid-cols-1  gap-6">
          {dataStructures.map((ds) => (
            <div
              key={ds.id}
              className={`group bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                hoveredCard === ds.id
                  ? "border-indigo-500 scale-105"
                  : "hover:border-indigo-500"
              }`}
              onMouseEnter={() => setHoveredCard(ds.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(`/visualizer/${ds.id}`)}
            >
              {/* Icon */}
              <div
                className={`bg-gradient-to-br ${ds.color} w-16 h-16 rounded-xl flex items-center justify-center mb-5`}
              >
                {ds.icon}
              </div>

              {/* Name */}
              <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-400 transition-colors">
                {ds.name}
              </h3>

              {/* Description */}
              <p className="text-gray-400 mb-5">{ds.description}</p>

              {/* Operations */}
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-2">Operations:</div>
                <div className="flex flex-wrap gap-2">
                  {ds.operations.map((op, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-700/50 px-2 py-1 rounded-md"
                    >
                      {op}
                    </span>
                  ))}
                </div>
              </div>

              {/* Algorithms */}
              <div>
                <div className="text-sm text-gray-500 mb-2">Famous Algos:</div>
                <div className="flex flex-wrap gap-2">
                  {ds.algorithms.slice(0, 3).map((algo, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-700/50 px-2 py-1 rounded-md"
                    >
                      {algo}
                    </span>
                  ))}
                  {ds.algorithms.length > 3 && (
                    <span className="text-xs bg-gray-700/50 px-2 py-1 rounded-md">
                      +{ds.algorithms.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Explore link */}
              <div className="flex items-center text-indigo-400 mt-4">
                <span className="text-sm font-medium">
                  Explore Visualizations
                </span>
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DSAVisualizer;
