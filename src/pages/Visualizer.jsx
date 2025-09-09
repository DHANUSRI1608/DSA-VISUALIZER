import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  ChevronRight,
  Zap,
  Grid,
  Box,
  Send,
  Link2,
  TreeDeciduous,
  Share2,
} from "lucide-react";

const Visualizer = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const dataStructures = [
    {
      id: "array",
      name: "Array",
      icon: <Grid size={24} />,
      color: "from-blue-500 to-cyan-500",
      description: "Visualize searching and sorting algorithms",
      difficulty: "Beginner",
    },
    {
      id: "stack",
      name: "Stack",
      icon: <Box size={24} />,
      color: "from-amber-500 to-orange-500",
      description: "Visualize LIFO operations like push and pop",
      difficulty: "Beginner",
    },
    {
      id: "queue",
      name: "Queue",
      icon: <Send size={24} />,
      color: "from-green-500 to-teal-500",
      description: "Visualize FIFO operations like enqueue and dequeue",
      difficulty: "Beginner",
    },
    {
      id: "linked-list",
      name: "Linked List",
      icon: <Link2 size={24} />,
      color: "from-purple-500 to-pink-500",
      description: "Visualize singly, doubly and circular linked lists",
      difficulty: "Intermediate",
    },
    {
      id: "tree",
      name: "Tree",
      icon: <TreeDeciduous size={24} />,
      color: "from-indigo-500 to-blue-500",
      description: "Visualize binary trees, BST, and traversal algorithms",
      difficulty: "Intermediate",
    },
    {
      id: "graph",
      name: "Graph",
      icon: <Share2 size={24} />,
      color: "from-red-500 to-pink-500",
      description: "Visualize graph algorithms like BFS, DFS, and Dijkstra",
      difficulty: "Advanced",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Navbar */}
      <nav className="bg-gray-900/80 backdrop-blur-md shadow-lg flex items-center justify-between px-8 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            DSA Visualizer
          </span>
        </div>
      </nav>

     {/* Header Section */}
<section className="max-w-6xl mx-auto px-6 pt-0 pb-2">
  <div className="text-center">
    <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
        Data Structures
      </span>{" "}
      & Algorithms
    </h1>
    <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mt-1">
      Learn and explore with interactive visualizations that bring core
      concepts to life.
    </p>
  </div>
</section>


      {/* Data Structures Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataStructures.map((ds) => (
            <div
              key={ds.id}
              className={`group bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                hoveredCard === ds.id
                  ? "border-indigo-500"
                  : "hover:border-indigo-500"
              }`}
              onMouseEnter={() => setHoveredCard(ds.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`bg-gradient-to-br ${ds.color} w-14 h-14 rounded-xl flex items-center justify-center text-white`}
                >
                  {ds.icon}
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    ds.difficulty === "Beginner"
                      ? "bg-green-500/20 text-green-400"
                      : ds.difficulty === "Intermediate"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {ds.difficulty}
                </span>
              </div>

              {/* Name */}
              <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-400 transition-colors">
                {ds.name}
              </h3>

              {/* Description */}
              <p className="text-gray-400 mb-6">{ds.description}</p>

              {/* Action buttons */}
              <div className="flex items-center justify-between mt-4">
                <button
                  className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium"
                  onClick={() => navigate(`/visualizer/${ds.id}`)}
                  aria-label={`Explore ${ds.name} visualizations`}
                >
                  Explore Visualizations
                  <ChevronRight
                    size={18}
                    className="ml-1 group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <button
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 p-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-indigo-500/30 hover:scale-105 flex items-center"
                  onClick={() => navigate(`/visualizer/${ds.id}`)}
                  title={`Quick demo of ${ds.name}`}
                >
                  <Play size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Visualizer;
