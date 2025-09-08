// Home.jsx
import React, { useState, useEffect } from "react";

const Home = () => {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      title: "Interactive Data Structures",
      description:
        "Visualize how arrays, linked lists, trees, and graphs work in real-time",
      icon: "📊",
    },
    {
      title: "Algorithm Animations",
      description:
        "Step through sorting, searching, and pathfinding algorithms with detailed explanations",
      icon: "🔍",
    },
    {
      title: "Learn by Doing",
      description:
        "Adjust parameters and see how algorithms behave differently under various conditions",
      icon: "🎮",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold">DV</span>
          </div>
          <span className="text-xl font-bold">DSA Visualizer</span>
        </div>

        <div className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-indigo-400 transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-indigo-400 transition-colors">
            Data Structures
          </a>
          <a href="#" className="hover:text-indigo-400 transition-colors">
            Algorithms
          </a>
          <a href="#" className="hover:text-indigo-400 transition-colors">
            About
          </a>
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Visualize Data Structures & Algorithms
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              An interactive learning platform that helps you understand how
              data structures and algorithms work through visualization.
            </p>
            <div className="flex space-x-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Start Exploring
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors">
                View Examples
              </button>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-indigo-600 rounded-full mix-blend-soft-light filter blur-xl opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-purple-600 rounded-full mix-blend-soft-light filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>

              <div className="relative bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-6 border border-gray-700 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-medium">Binary Search Tree</div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                      50
                    </div>
                  </div>

                  <div className="flex justify-between mb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                      25
                    </div>
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                      75
                    </div>
                  </div>

                  <div className="flex justify-between px-6">
                    <div className="w-6 h-6 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold text-xs">
                      10
                    </div>
                    <div className="w-6 h-6 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold text-xs">
                      40
                    </div>
                    <div className="w-6 h-6 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold text-xs">
                      60
                    </div>
                    <div className="w-6 h-6 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold text-xs">
                      90
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-center space-x-2">
                  <div className="px-3 py-1 bg-gray-700 rounded-md text-xs">
                    Insert
                  </div>
                  <div className="px-3 py-1 bg-gray-700 rounded-md text-xs">
                    Search
                  </div>
                  <div className="px-3 py-1 bg-gray-700 rounded-md text-xs">
                    Delete
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Use Our Visualizer?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700 transition-all duration-300 hover:border-indigo-500 ${
                currentFeature === index ? "scale-105 border-indigo-500" : ""
              }`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Master DSA?</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
            Join thousands of students and developers who have improved their
            understanding of data structures and algorithms through
            visualization.
          </p>
          <button className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">DV</span>
              </div>
              <span className="text-lg font-bold">DSA Visualizer</span>
            </div>

            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>

            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fab fa-github text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm mt-8">
            &copy; {new Date().getFullYear()} DSA Visualizer. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
