import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Menu,
  X,
  Plus,
  Minus,
  Eye,
  CheckSquare,
  AlertCircle,
  Layers,
  ArrowUp,
  ArrowDown,
  Package,
  Square,
} from "lucide-react";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export default function StackVisualizer() {
  const { dsId } = useParams();

  // UI/control states
  const [stackSize, setStackSize] = useState(8);
  const [speed, setSpeed] = useState(600);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [displayStack, setDisplayStack] = useState([]);
  const [operationValue, setOperationValue] = useState("");
  const [showControls, setShowControls] = useState(true);
  const [algorithmDescription, setAlgorithmDescription] = useState("");
  const [selectedOperation, setSelectedOperation] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start with sidebar closed on mobile
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [stackView, setStackView] = useState("vertical"); // 'vertical' or 'horizontal'

  // Internal refs
  const animationRef = useRef(null);
  const originalStackRef = useRef([]);
  const mountedRef = useRef(false);

  const operationInfo = {
    push: {
      name: "Push",
      description: "Adds an element to the top of the stack.",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      icon: <ArrowUp size={18} className="text-green-400" />
    },
    pop: {
      name: "Pop", 
      description: "Removes the top element from the stack.",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      icon: <ArrowDown size={18} className="text-red-400" />
    },
    peek: {
      name: "Peek",
      description: "Returns the top element without removing it.",
      timeComplexity: "O(1)", 
      spaceComplexity: "O(1)",
      icon: <Eye size={18} className="text-blue-400" />
    },
    "is-empty": {
      name: "Is Empty",
      description: "Checks if the stack is empty.",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      icon: <CheckSquare size={18} className="text-yellow-400" />
    },
    "is-full": {
      name: "Is Full",
      description: "Checks if the stack is full.",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      icon: <AlertCircle size={18} className="text-purple-400" />
    },
    none: {
      name: "Select Operation",
      description: "Select an operation to visualize how it works on the stack.",
      timeComplexity: "",
      spaceComplexity: "",
      icon: null
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const setOriginalStack = (stack) => {
    originalStackRef.current = [...stack];
    setDisplayStack([...stack]);
  };

  const generateRandomStack = (size = stackSize) => {
    const stack = Array.from(
      { length: Math.min(5, size) },
      () => Math.floor(Math.random() * 96) + 5
    );
    setOriginalStack(stack);
    resetVisualizationState();
    showNotification("Generated new random stack", "success");
  };

  const resetVisualizationState = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setSteps([]);
    setDisplayStack([...originalStackRef.current]);
    setAlgorithmDescription(
      selectedOperation ? operationInfo[selectedOperation].description : "Select an operation to visualize how it works on the stack."
    );
    clearTimeout(animationRef.current);
  };

  // Stack operation implementations
  const generateStepsForOperation = (operation) => {
    if (!operation || operation === "none") {
      showNotification("Please select an operation first", "warning");
      return;
    }
    
    setAlgorithmDescription(operationInfo[operation].description || "");
    const stack = [...originalStackRef.current];
    const out = [];

    // Push operation
    if (operation === "push") {
      if (!operationValue) {
        showNotification("Please enter a value to push", "warning");
        return;
      }
      const value = parseInt(operationValue, 10);
      
      if (isNaN(value)) {
        showNotification("Please enter a valid number", "warning");
        return;
      }

      if (stack.length >= stackSize) {
        out.push({
          stack: [...stack],
          highlighted: [],
          description: `Stack is full! Cannot push ${value}.`,
        });
      } else {
        out.push({
          stack: [...stack],
          highlighted: [],
          description: `Preparing to push ${value} to the stack.`,
        });

        const newStack = [...stack, value];
        out.push({
          stack: [...newStack],
          highlighted: [newStack.length - 1],
          description: `Pushed ${value} to the top of the stack.`,
        });
      }
    }

    // Pop operation
    else if (operation === "pop") {
      if (stack.length === 0) {
        out.push({
          stack: [...stack],
          highlighted: [],
          description: "Stack is empty! Cannot pop.",
        });
      } else {
        const topValue = stack[stack.length - 1];
        out.push({
          stack: [...stack],
          highlighted: [stack.length - 1],
          description: `Preparing to pop ${topValue} from the stack.`,
        });

        const newStack = stack.slice(0, -1);
        out.push({
          stack: [...newStack],
          highlighted: [],
          description: `Popped ${topValue} from the stack.`,
        });
      }
    }

    // Peek operation
    else if (operation === "peek") {
      if (stack.length === 0) {
        out.push({
          stack: [...stack],
          highlighted: [],
          description: "Stack is empty! Nothing to peek.",
        });
      } else {
        const topValue = stack[stack.length - 1];
        out.push({
          stack: [...stack],
          highlighted: [stack.length - 1],
          description: `Peeking at the top of the stack: ${topValue}.`,
        });
      }
    }

    // Is Empty operation
    else if (operation === "is-empty") {
      const isEmpty = stack.length === 0;
      out.push({
        stack: [...stack],
        highlighted: [],
        description: `Stack is ${isEmpty ? "empty" : "not empty"}.`,
      });
    }

    // Is Full operation
    else if (operation === "is-full") {
      const isFull = stack.length >= stackSize;
      out.push({
        stack: [...stack],
        highlighted: [],
        description: `Stack is ${isFull ? "full" : "not full"}.`,
      });
    }

    setSteps(out);
    setCurrentStepIndex(0);
    setDisplayStack(out.length > 0 ? [...out[0].stack] : [...stack]);
    setTimeout(() => setIsPlaying(true), 50);
  };

  useEffect(() => {
    if (!mountedRef.current) {
      generateRandomStack(stackSize);
      mountedRef.current = true;
    }
  }, []);

  useEffect(() => {
    // Clear any existing timeout
    clearTimeout(animationRef.current);

    if (isPlaying && steps.length > 0) {
      if (currentStepIndex < steps.length - 1) {
        // Use the speed value directly without clamping
        animationRef.current = setTimeout(() => {
          setCurrentStepIndex((s) => s + 1);
        }, speed);
      } else {
        setIsPlaying(false);
      }
    }

    return () => clearTimeout(animationRef.current);
  }, [isPlaying, currentStepIndex, steps, speed]);

  useEffect(() => {
    if (steps.length > 0 && currentStepIndex < steps.length) {
      setDisplayStack([...steps[currentStepIndex].stack]);
      setAlgorithmDescription(steps[currentStepIndex].description);
    }
  }, [currentStepIndex, steps]);

  const currentStepObj = steps[currentStepIndex] || null;

  if (dsId !== "stack") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl">
        Visualization for {dsId} is coming soon!
      </div>
    );
  }

  // Calculate stack item height based on stack size
  const getStackItemHeight = () => {
    if (stackSize <= 8) return "h-12";
    if (stackSize <= 12) return "h-10";
    return "h-8";
  };

  // Calculate container height based on stack size
  const getStackContainerHeight = () => {
    if (stackSize <= 8) return "h-96";
    if (stackSize <= 12) return "h-80";
    return "h-64";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${
          notification.type === "error" ? "bg-red-600" : 
          notification.type === "success" ? "bg-green-600" : 
          notification.type === "warning" ? "bg-yellow-600" : "bg-blue-600"
        }`}>
          <div className="flex items-center">
            <span className="mr-2">{notification.message}</span>
            <button onClick={() => setNotification({ show: false, message: "", type: "" })}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <div className={`bg-gray-800 w-64 flex-shrink-0 transition-all duration-300 ${sidebarOpen ? "ml-0" : "-ml-64"} lg:ml-0`}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold">Stack Operations</h2>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="lg:hidden p-1 rounded hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-sm uppercase text-gray-400 font-semibold mb-2">Stack Operations</h3>
            <div className="space-y-2">
              {Object.entries(operationInfo)
                .filter(([key, info]) => key !== "none")
                .map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedOperation(key);
                      resetVisualizationState();
                    }}
                    className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center space-x-2 ${
                      selectedOperation === key ? "bg-indigo-600" : "hover:bg-gray-700"
                    }`}
                  >
                    <span className="text-gray-400">{info.icon}</span>
                    <span>{info.name}</span>
                  </button>
                ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm uppercase text-gray-400 font-semibold mb-2">Stack Information</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Capacity:</span>
                <span>{stackSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Size:</span>
                <span>{displayStack.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Top Element:</span>
                <span>{displayStack.length > 0 ? displayStack[displayStack.length - 1] : "None"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={displayStack.length === 0 ? "text-yellow-400" : displayStack.length >= stackSize ? "text-red-400" : "text-green-400"}>
                  {displayStack.length === 0 ? "Empty" : displayStack.length >= stackSize ? "Full" : "Available"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="lg:hidden p-1 rounded hover:bg-gray-700"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-2xl lg:text-3xl font-bold">Stack Visualizer</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowControls(!showControls)}
                className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded text-sm lg:text-base"
              >
                <Sliders size={16} />
                {showControls ? "Hide Controls" : "Show Controls"}
              </button>
            </div>
          </div>

          {/* Controls Panel */}
          {showControls && (
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 text-gray-300">Stack Size: {stackSize}</label>
                  <div className="flex items-center space-x-2">
                    <Minus 
                      size={16} 
                      className="cursor-pointer text-gray-400 hover:text-white" 
                      onClick={() => {
                        const newSize = Math.max(5, stackSize - 1);
                        setStackSize(newSize);
                        generateRandomStack(newSize);
                      }} 
                    />
                    <input
                      type="range"
                      min="5"
                      max="10"
                      value={stackSize}
                      onChange={(e) => {
                        const newSize = parseInt(e.target.value);
                        setStackSize(newSize);
                        generateRandomStack(newSize);
                      }}
                      className="w-full"
                    />
                    <Plus 
                      size={16} 
                      className="cursor-pointer text-gray-400 hover:text-white" 
                      onClick={() => {
                        const newSize = Math.min(15, stackSize + 1);
                        setStackSize(newSize);
                        generateRandomStack(newSize);
                      }} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-300">Animation Speed: {speed}ms</label>
                  <div className="flex items-center space-x-2">
                    <Minus 
                      size={16} 
                      className="cursor-pointer text-gray-400 hover:text-white" 
                      onClick={() => setSpeed(prev => Math.max(50, prev - 100))} 
                    />
                    <input
                      type="range"
                      min="50"
                      max="2000"
                      step="50"
                      value={speed}
                      onChange={(e) => setSpeed(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <Plus 
                      size={16} 
                      className="cursor-pointer text-gray-400 hover:text-white" 
                      onClick={() => setSpeed(prev => Math.min(2000, prev + 100))} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-300">
                    Value for Push
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={operationValue}
                    onChange={(e) => setOperationValue(e.target.value)}
                    className="w-full bg-gray-700 px-3 py-2 rounded text-white"
                    placeholder="Enter value (1-100)"
                  />
                </div>

                <div className="md:col-span-3 flex justify-center gap-2">
                  <button
                    onClick={() => generateRandomStack()}
                    className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw size={16} className="inline mr-2" />
                    Reset Stack
                  </button>
                  <button
                    onClick={() => setStackView(stackView === "vertical" ? "horizontal" : "vertical")}
                    className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    {stackView === "vertical" ? "Horizontal View" : "Vertical View"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Selected Operation Info */}
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">
                  {selectedOperation ? operationInfo[selectedOperation].name : "No Operation Selected"}
                </h2>
                <p className="text-gray-300">
                  {selectedOperation ? operationInfo[selectedOperation].description : "Select an operation from the sidebar to get started."}
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <button
                  onClick={() => generateStepsForOperation(selectedOperation)}
                  disabled={!selectedOperation || selectedOperation === "none"}
                  className="bg-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Visualize Operation
                </button>
                <button
                  onClick={() => {
                    setSelectedOperation("none");
                    resetVisualizationState();
                  }}
                  className="bg-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            {selectedOperation && (
              <div className="flex space-x-6 mt-3 text-sm">
                <div>
                  <span className="text-gray-400">Time Complexity: </span>
                  <span className="font-mono">{operationInfo[selectedOperation].timeComplexity}</span>
                </div>
                <div>
                  <span className="text-gray-400">Space Complexity: </span>
                  <span className="font-mono">{operationInfo[selectedOperation].spaceComplexity}</span>
                </div>
              </div>
            )}
          </div>

          {/* Visualization Area */}
          <div className="bg-gray-800 p-4 lg:p-6 rounded-lg mb-6">
            {/* Stack View Toggle for Mobile */}
            <div className="flex justify-center mb-4 lg:hidden">
              <button
                onClick={() => setStackView(stackView === "vertical" ? "horizontal" : "vertical")}
                className="bg-gray-700 px-4 py-2 rounded text-sm"
              >
                {stackView === "vertical" ? "Switch to Horizontal View" : "Switch to Vertical View"}
              </button>
            </div>

            <div className={`flex ${stackView === "vertical" ? "flex-col" : "flex-col lg:flex-row"} items-center gap-6 mb-6`}>
              {/* Stack Visualization */}
              <div className={`${stackView === "vertical" ? "w-full lg:w-64" : "w-full lg:w-2/3"} flex ${stackView === "vertical" ? "flex-col-reverse" : "flex-row"} items-center justify-center`}>
                <div className={`${stackView === "vertical" ? getStackContainerHeight() : "h-64"} ${stackView === "vertical" ? "w-40" : "w-full"} flex ${stackView === "vertical" ? "flex-col-reverse" : "flex-row-reverse"} items-center ${stackView === "vertical" ? "gap-1" : "gap-2"} mb-2 relative`}>
                  {/* Stack pointer indicator */}
                  <div className={`absolute ${stackView === "vertical" ? "-right-10 top-0 bottom-0 flex items-center" : "-top-8 left-0 right-0 flex justify-center"}`}>
                    <div className="bg-indigo-500 text-white text-xs px-2 py-1 rounded">
                      Top
                    </div>
                  </div>
                  
                  {Array.from({ length: stackSize }).map((_, index) => {
                    const value = displayStack[index];
                    const isHighlighted =
                      currentStepObj?.highlighted?.includes(index);
                    const isEmptyCell = index >= displayStack.length;

                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-center transition-all duration-300 ${
                          isHighlighted
                            ? "bg-indigo-500"
                            : isEmptyCell
                            ? "bg-gray-700 border border-gray-600"
                            : "bg-gray-600"
                        } ${stackView === "vertical" ? `w-full ${getStackItemHeight()}` : "h-12 flex-1"} relative`}
                      >
                        {!isEmptyCell && (
                          <>
                            <span className="text-lg font-bold">{value}</span>
                            {index === displayStack.length - 1 && (
                              <div className={`absolute ${stackView === "vertical" ? "-top-5" : "-right-8 top-1/2 transform -translate-y-1/2"} text-xs text-indigo-300`}>
                                Top
                              </div>
                            )}
                          </>
                        )}
                        {isEmptyCell && (
                          <span className="text-gray-500 text-sm">Empty</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className={`mt-2 text-sm text-gray-400 ${stackView === "vertical" ? "" : "transform -rotate-90 origin-center"}`}>
                  {stackView === "vertical" ? "Bottom of Stack" : "Left: Bottom of Stack"}
                </div>
              </div>

              {/* Operation Description */}
              <div className={`${stackView === "vertical" ? "w-full" : "w-full lg:w-1/3"} text-center p-4 bg-gray-900 rounded-lg`}>
                <p className="text-lg font-semibold">{algorithmDescription}</p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentStepIndex(0)}
                disabled={currentStepIndex === 0 || steps.length === 0}
                className="p-2 rounded disabled:opacity-50 hover:bg-gray-700"
                title="Go to first step"
              >
                <RotateCcw size={20} />
              </button>

              <button
                onClick={() => setCurrentStepIndex((i) => Math.max(0, i - 1))}
                disabled={currentStepIndex === 0 || steps.length === 0}
                className="p-2 rounded disabled:opacity-50 hover:bg-gray-700"
                title="Previous step"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={steps.length === 0}
                className="bg-indigo-600 p-3 rounded-full disabled:opacity-50 hover:bg-indigo-700"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>

              <button
                onClick={() =>
                  setCurrentStepIndex((i) => Math.min(steps.length - 1, i + 1))
                }
                disabled={currentStepIndex === steps.length - 1 || steps.length === 0}
                className="p-2 rounded disabled:opacity-50 hover:bg-gray-700"
                title="Next step"
              >
                <ChevronRight size={20} />
              </button>

              <span className="text-sm text-gray-400">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </div>
          </div>

          {/* Stack Principles */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Stack Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-300 mb-2 flex items-center">
                  <Layers size={18} className="mr-2" />
                  LIFO Principle
                </h3>
                <p className="text-sm text-gray-300">
                  Stack follows the <strong>Last-In-First-Out (LIFO)</strong> principle where the last element
                  added is the first one to be removed. This is similar to a stack of plates - you can only take the top plate.
                </p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-300 mb-2 flex items-center">
                  <Package size={18} className="mr-2" />
                  Common Operations
                </h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li className="flex items-center"><Square size={12} className="mr-2 text-green-400" />Push: Add an element to the top</li>
                  <li className="flex items-center"><Square size={12} className="mr-2 text-red-400" />Pop: Remove the top element</li>
                  <li className="flex items-center"><Square size={12} className="mr-2 text-blue-400" />Peek: View the top element</li>
                  <li className="flex items-center"><Square size={12} className="mr-2 text-yellow-400" />isEmpty: Check if stack is empty</li>
                  <li className="flex items-center"><Square size={12} className="mr-2 text-purple-400" />isFull: Check if stack is full</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}