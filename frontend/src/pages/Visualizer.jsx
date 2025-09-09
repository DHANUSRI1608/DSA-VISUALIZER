import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Code,
  ChevronRight,
  Zap,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

const Visualizer = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const dataStructures = [
    {
      id: "array",
      name: "Array",
      icon: "📂",
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
      difficulty: "Beginner",
    },
    {
      id: "stack",
      name: "Stack",
      icon: "📦",
      color: "from-amber-500 to-orange-500",
      description: "Visualize LIFO operations like push and pop",
      operations: ["Push", "Pop", "Peek", "isEmpty"],
      algorithms: ["Balanced Parentheses", "Infix to Postfix", "Undo/Redo"],
      difficulty: "Beginner",
    },
    {
      id: "queue",
      name: "Queue",
      icon: "📤",
      color: "from-green-500 to-teal-500",
      description: "Visualize FIFO operations like enqueue and dequeue",
      operations: ["Enqueue", "Dequeue", "Front", "Rear"],
      algorithms: ["Round Robin Scheduling", "Breadth First Search"],
      difficulty: "Beginner",
    },
    {
      id: "linked-list",
      name: "Linked List",
      icon: "🔗",
      color: "from-purple-500 to-pink-500",
      description: "Visualize singly, doubly and circular linked lists",
      operations: ["Insertion", "Deletion", "Traversal", "Reversal"],
      algorithms: ["Detect Cycle", "Merge Two Lists", "Find Middle"],
      difficulty: "Intermediate",
    },
    {
      id: "tree",
      name: "Tree",
      icon: "🌳",
      color: "from-indigo-500 to-blue-500",
      description: "Visualize binary trees, BST, and traversal algorithms",
      operations: ["Insert", "Delete", "Height", "Traverse"],
      algorithms: ["DFS", "BFS", "Inorder Traversal", "Preorder", "Postorder"],
      difficulty: "Intermediate",
    },
    {
      id: "graph",
      name: "Graph",
      icon: "🕸",
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
      difficulty: "Advanced",
    },
  ];

  const stats = [
    { value: "6", label: "Data Structures" },
    { value: "25+", label: "Algorithms" },
    { value: "18", label: "Operations" },
    { value: "100%", label: "Interactive" },
  ];

  const handleClick = (dsId, type, name) => {
    const formattedName = name.replace(/\s+/g, "-").toLowerCase();
    navigate(`/visualizer/${dsId}/${type}/${formattedName}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 blur-xl animate-pulse"
            style={{
              background: `linear-gradient(45deg, ${
                i % 2 === 0 ? "#6366f1" : "#8b5cf6"
              }, ${i % 2 === 0 ? "#ec4899" : "#3b82f6"})`,
              width: `${100 + i * 100}px`,
              height: `${100 + i * 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

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

        <div className="hidden md:flex space-x-8 ml-auto">
          {["Features", "Examples", "Testimonials", "Pricing"].map(
            (item, i) => (
              <a
                key={i}
                href={`#${item.toLowerCase()}`}
                className="hover:text-indigo-400 transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            )
          )}
        </div>

        <div className="flex items-center space-x-4 pl-5">
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-5 py-2.5 rounded-lg shadow-md transition-all duration-300 hover:shadow-indigo-500/30 hover:scale-105">
            Sign In
          </button>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-5 py-2.5 rounded-lg shadow-md transition-all duration-300 hover:shadow-indigo-500/30 hover:scale-105">
            Get Started
          </button>
        </div>
      </nav>

      {/* Header Section */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-8 relative">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
              Data Structures
            </span>{" "}
            & Algorithms
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Interactive visualizations to help you understand how data
            structures and algorithms work
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-gray-800/40 backdrop-blur-md rounded-xl p-4 border border-gray-700"
            >
              <div className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
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
                  className={`bg-gradient-to-br ${ds.color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl`}
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
              <p className="text-gray-400 mb-5">{ds.description}</p>

              {/* Operations */}
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-2">Operations:</div>
                <div className="flex flex-wrap gap-2">
                  {ds.operations.map((op, i) => (
                    <button
                      key={i}
                      onClick={() => handleClick(ds.id, "operation", op)}
                      className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md hover:bg-blue-500/40 transition-colors"
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              {/* Algorithms */}
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">Algorithms:</div>
                <div className="flex flex-wrap gap-2">
                  {ds.algorithms.slice(0, 3).map((algo, i) => (
                    <button
                      key={i}
                      onClick={() => handleClick(ds.id, "algorithm", algo)}
                      className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-md hover:bg-green-500/40 transition-colors"
                    >
                      {algo}
                    </button>
                  ))}
                  {ds.algorithms.length > 3 && (
                    <span className="text-xs bg-gray-700/50 px-2 py-1 rounded-md">
                      +{ds.algorithms.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between mt-4">
                <button
                  className="flex items-center text-indigo-400 group-hover:text-indigo-300 transition-colors text-sm font-medium"
                  onClick={() => navigate(`/visualizer/${ds.id}`)}
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
                  title="Quick Demo"
                >
                  <Play size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Ready to Explore?</h2>
              <p className="text-indigo-100 max-w-2xl mx-auto mb-8 text-lg">
                Start visualizing how data structures and algorithms work in
                real-time.
              </p>
              <button
                className="bg-white text-indigo-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center mx-auto"
                onClick={() => navigate("/visualizer/array")}
              >
                Start with Arrays
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-12 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <span className="text-lg font-bold">DSA Visualizer</span>
              </div>
              <p className="text-gray-400 text-sm">
                Making Data Structures and Algorithms accessible through
                interactive visualizations.
              </p>
            </div>

            {["Product", "Company", "Support"].map((category, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{category}</h4>
                <ul className="space-y-2 text-sm">
                  {["Features", "Examples", "Pricing", "Testimonials"].map(
                    (item, j) => (
                      <li key={j}>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} DSA Visualizer. All rights
              reserved.
            </div>

            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition p-2 bg-gray-800 rounded-lg"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition p-2 bg-gray-800 rounded-lg"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition p-2 bg-gray-800 rounded-lg"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Visualizer;
