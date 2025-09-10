// Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Github,
  Twitter,
  Linkedin,
  Play,
  Code,
  BarChart3,
  Brain,
  Zap,
  ChevronRight,
  Star,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      title: "Interactive Data Structures",
      description:
        "Visualize how arrays, linked lists, trees, and graphs work in real-time",
      icon: <BarChart3 size={32} />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Algorithm Animations",
      description:
        "Step through sorting, searching, and pathfinding algorithms with detailed explanations",
      icon: <Play size={32} />,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Learn by Doing",
      description:
        "Adjust parameters and see how algorithms behave differently under various conditions",
      icon: <Code size={32} />,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Build Intuition",
      description:
        "Develop a deeper understanding of computational thinking and problem solving",
      icon: <Brain size={32} />,
      color: "from-green-500 to-teal-500",
    },
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Computer Science Student",
      content:
        "This platform completely changed how I understand algorithms. The visualizations make complex concepts so much easier to grasp.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=774&q=80",
    },
    {
      name: "Sarah Williams",
      role: "Software Engineer",
      content:
        "I wish I had this when I was preparing for interviews. The interactive quizzes helped me master data structures in weeks.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=776&q=80",
    },
    {
      name: "Michael Chen",
      role: "Bootcamp Instructor",
      content:
        "I recommend this to all my students. The way it breaks down each step of an algorithm is incredible for visual learners.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=798&q=80",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "50+", label: "Visualizations" },
    { value: "95%", label: "Satisfaction Rate" },
    { value: "300+", label: "Practice Problems" },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Enhanced Background with particles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Animated gradient blobs */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 blur-xl animate-pulse"
            style={{
              background: `linear-gradient(45deg, ${
                i % 2 === 0 ? "#6366f1" : "#8b5cf6"
              }, ${i % 2 === 0 ? "#ec4899" : "#3b82f6"})`,
              width: `${80 + i * 60}px`,
              height: `${80 + i * 60}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${15 + i * 5}s`,
            }}
          />
        ))}
        
        {/* Particle effect */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full opacity-30"
            style={{
              background: `linear-gradient(45deg, ${
                i % 3 === 0 ? "#6366f1" : i % 3 === 1 ? "#ec4899" : "#3b82f6"
              }, transparent)`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatParticle ${15 + Math.random() * 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav
        className={`bg-gray-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-500 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            DSA Visualizer
          </span>
        </div>

        <div className="hidden md:flex space-x-8 ml-auto">
          {["Features", "Examples", "Testimonials", "Pricing"].map((item, i) => (
            <a
              key={i}
              href={`#${item.toLowerCase()}`}
              className="hover:text-indigo-400 transition-colors duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 relative">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Text content */}
          <div className="md:w-1/2">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
                Visualize
              </span>{" "}
              Data Structures <br /> & Algorithms
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              An interactive learning platform that helps you truly understand
              how data structures and algorithms work through dynamic
              visualization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/visualizer")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-4 rounded-lg font-medium shadow-lg transition-all duration-300 hover:shadow-indigo-500/40 flex items-center justify-center"
              >
                Start Visualizing Now
                <ChevronRight size={20} className="ml-2" />
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-lg font-medium border border-gray-700 transition-all duration-300">
                View Examples
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative bg-gray-800/40 rounded-2xl p-6 border border-gray-700 shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Zap size={20} className="mr-2 text-indigo-400" />
                  Binary Search Tree
                </h3>
                <div className="text-xs bg-indigo-600/30 text-indigo-300 px-2 py-1 rounded-full">
                  Interactive
                </div>
              </div>
              
              <div className="bg-gray-900/80 rounded-xl p-4 border border-gray-700">
                {/* Tree visualization */}
                <div className="relative h-48 flex justify-center items-center">
                  {/* SVG connecting lines */}
                  <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Root to children */}
                    <line x1="50" y1="50" x2="30" y2="30" stroke="rgba(99, 102, 241, 0.5)" strokeWidth="1.5" />
                    <line x1="50" y1="50" x2="70" y2="30" stroke="rgba(99, 102, 241, 0.5)" strokeWidth="1.5" />
                    
                    {/* Left subtree connections */}
                    <line x1="30" y1="30" x2="20" y2="15" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="1.2" />
                    <line x1="30" y1="30" x2="40" y2="15" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="1.2" />
                    
                    {/* Right subtree connections */}
                    <line x1="70" y1="30" x2="60" y2="15" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="1.2" />
                    <line x1="70" y1="30" x2="80" y2="15" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="1.2" />
                  </svg>
                  
                  {/* Tree nodes */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {/* Root node */}
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg border-2 border-indigo-400 z-10 relative">
                      50
                    </div>
                  </div>
                  
                  {/* Left subtree */}
                  <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-purple-400 z-10">
                      25
                    </div>
                  </div>
                  
                  <div className="absolute top-1/8 left-1/6 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-pink-400 z-10">
                      10
                    </div>
                  </div>
                  
                  <div className="absolute top-1/8 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-pink-400 z-10">
                      35
                    </div>
                  </div>
                  
                  {/* Right subtree */}
                  <div className="absolute top-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-purple-400 z-10">
                      75
                    </div>
                  </div>
                  
                  <div className="absolute top-1/8 right-2/3 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-pink-400 z-10">
                      60
                    </div>
                  </div>
                  
                  <div className="absolute top-1/8 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-pink-400 z-10">
                      90
                    </div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="mt-4 pt-3 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      Visualizing: <span className="text-indigo-400">BST</span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex items-center text-xs text-gray-400">
                        <div className="w-3 h-3 rounded-full bg-indigo-600 mr-1"></div>
                        Root
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <div className="w-3 h-3 rounded-full bg-purple-600 mr-1"></div>
                        Branch
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <div className="w-3 h-3 rounded-full bg-pink-600 mr-1"></div>
                        Leaf
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button className="text-sm bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-lg transition-colors flex items-center">
                  <Play size={16} className="mr-1" />
                  Visualize Operations
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-900/50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">
            Powerful Learning Features
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Our platform offers everything you need to master DSA through
            interactive visualization
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`bg-gradient-to-br ${f.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-300">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/60 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center border-t border-gray-800">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} DSA Visualizer By Dhanusri & Dinesh. All
            rights reserved.
          </div>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition p-2 bg-gray-800 rounded-lg hover:bg-indigo-600"
            >
              <Github size={18} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition p-2 bg-gray-800 rounded-lg hover:bg-blue-400"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition p-2 bg-gray-800 rounded-lg hover:bg-blue-600"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </footer>

      {/* Add CSS for particle animation */}
      <style>{`
          @keyframes floatParticle {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(${Math.random() * 20}px, ${Math.random() * 20}px);
          }
          50% {
            transform: translate(${Math.random() * 10}px, ${Math.random() * 30}px);
          }
          75% {
            transform: translate(${Math.random() * 30}px, ${Math.random() * 10}px);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;