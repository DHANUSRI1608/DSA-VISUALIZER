// Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Github, Twitter, Linkedin, Play, Code, BarChart3, Brain, Zap, ChevronRight, Star } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Interactive Data Structures",
      description: "Visualize how arrays, linked lists, trees, and graphs work in real-time",
      icon: <BarChart3 size={32} />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Algorithm Animations",
      description: "Step through sorting, searching, and pathfinding algorithms with detailed explanations",
      icon: <Play size={32} />,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Learn by Doing",
      description: "Adjust parameters and see how algorithms behave differently under various conditions",
      icon: <Code size={32} />,
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "Build Intuition",
      description: "Develop a deeper understanding of computational thinking and problem solving",
      icon: <Brain size={32} />,
      color: "from-green-500 to-teal-500"
    }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Computer Science Student",
      content: "This platform completely changed how I understand algorithms. The visualizations make complex concepts so much easier to grasp.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
    },
    {
      name: "Sarah Williams",
      role: "Software Engineer",
      content: "I wish I had this when I was preparing for interviews. The interactive quizzes helped me master data structures in weeks.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80"
    },
    {
      name: "Michael Chen",
      role: "Bootcamp Instructor",
      content: "I recommend this to all my students. The way it breaks down each step of an algorithm is incredible for visual learners.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=798&q=80"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "50+", label: "Visualizations" },
    { value: "95%", label: "Satisfaction Rate" },
    { value: "300+", label: "Practice Problems" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 blur-xl animate-pulse"
            style={{
              background: `linear-gradient(45deg, ${i % 2 === 0 ? '#6366f1' : '#8b5cf6'}, ${i % 2 === 0 ? '#ec4899' : '#3b82f6'})`,
              width: `${100 + i * 100}px`,
              height: `${100 + i * 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className={`bg-gray-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">DSA Visualizer</span>
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
          {/* Text */}
          <div className="md:w-1/2">
            <div className={`transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">Visualize</span> Data Structures
                <br />& Algorithms
              </h1>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                An interactive learning platform that helps you truly understand how data structures and algorithms work through dynamic visualization. Master complex concepts with real-time animations and interactive examples.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => navigate("/visualizer")}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-4 rounded-lg font-medium shadow-lg transition-all duration-300 hover:shadow-indigo-500/40 flex items-center justify-center"
                >
                  Start Visualizing Now
                  <ChevronRight size={20} className="ml-2" />
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-lg font-medium border border-gray-700 transition-all duration-300 flex items-center justify-center">
                  View Examples
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">{stat.value}</div>
                  <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visualization Preview */}
          <div className="md:w-1/2 flex justify-center relative">
            <div className="relative bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700 shadow-2xl overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-600 rounded-full opacity-20 blur-3xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></div>
                  Binary Search Tree Visualization
                </h3>
                
                <div className="bg-gray-900/80 rounded-xl p-4 border border-gray-700">
                  {/* Tree visualization */}
                  <div className="flex flex-col items-center space-y-6 py-4">
                    {/* Root */}
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                        50
                      </div>
                      <div className="absolute top-full left-1/2 w-0.5 h-10 bg-indigo-500 transform -translate-x-1/2"></div>
                    </div>

                    {/* Level 1 */}
                    <div className="flex justify-center space-x-16 relative">
                      {[25, 75].map((n, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -top-10 left-1/2 w-16 h-0.5 bg-indigo-500 transform -translate-x-1/2 rotate-45"></div>
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {n}
                          </div>
                          <div className="absolute top-full left-1/2 w-0.5 h-8 bg-indigo-500 transform -translate-x-1/2"></div>
                        </div>
                      ))}
                    </div>

                    {/* Level 2 */}
                    <div className="flex justify-center space-x-24">
                      {[10, 40, 60, 90].map((n, i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-xs shadow">
                          {n}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center gap-3">
                  {["Insert", "Search", "Delete", "Traverse"].map((btn, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm cursor-pointer transition-all duration-300 hover:scale-105"
                    >
                      {btn}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

     <section id="features" className="py-16 bg-gray-900/50 relative">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-3xl font-bold text-center mb-4">
      Powerful Learning Features
    </h2>
    <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
      Our platform offers everything you need to master Data Structures and Algorithms through interactive visualization
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => {
        // Define color variants that match your overall theme
        const colorVariants = [
          "from-indigo-600 to-purple-600",
          "from-blue-600 to-indigo-600", 
          "from-purple-600 to-pink-600",
          "from-blue-500 to-cyan-500"
        ];
        
        return (
          <div
            key={index}
            className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
          >
            <div className={`bg-gradient-to-br ${colorVariants[index]} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
          </div>
        );
      })}
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-16 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Ready to Master DSA?</h2>
              <p className="text-indigo-100 max-w-2xl mx-auto mb-8 text-lg">
                Join thousands of students and developers who have improved their understanding of data structures and algorithms through visualization.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-white text-indigo-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center">
                  Start Learning Now
                  <ChevronRight size={20} className="ml-2" />
                </button>
                <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  View Free Examples
                </button>
              </div>
              <p className="text-indigo-200 text-sm mt-6">No credit card required. Free plan includes access to all basic features.</p>
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
                Making Data Structures and Algorithms accessible through interactive visualizations.
              </p>
            </div>
            
            {["Product", "Company", "Support"].map((category, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{category}</h4>
                <ul className="space-y-2 text-sm">
                  {["Features", "Examples", "Pricing", "Testimonials"].map((item, j) => (
                    <li key={j}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} DSA Visualizer. All rights reserved.
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition p-2 bg-gray-800 rounded-lg">
                <Github size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition p-2 bg-gray-800 rounded-lg">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition p-2 bg-gray-800 rounded-lg">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;