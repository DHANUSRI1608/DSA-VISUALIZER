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
  Clock,
  ArrowRight,
  ArrowLeft,
  Square,
} from "lucide-react";

export default function QueueVisualizer() {
  const { dsId } = useParams();

  // UI/control states
  const [queueSize, setQueueSize] = useState(8);
  const [speed, setSpeed] = useState(600);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [displayQueue, setDisplayQueue] = useState([]);
  const [operationValue, setOperationValue] = useState("");
  const [showControls, setShowControls] = useState(true);
  const [algorithmDescription, setAlgorithmDescription] = useState("");
  const [selectedOperation, setSelectedOperation] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Pointers for front and rear of the queue
  const [frontIndex, setFrontIndex] = useState(-1);
  const [rearIndex, setRearIndex] = useState(-1);

  // Internal refs
  const animationRef = useRef(null);
  const originalQueueRef = useRef([]);
  const mountedRef = useRef(false);

  const operationInfo = {
    enqueue: {
      name: "Enqueue",
      description: "Adds an element to the rear of the queue.",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      icon: <ArrowRight size={18} className="text-green-400" />
    },
    dequeue: {
      name: "Dequeue", 
      description: "Removes an element from the front of the queue.",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      icon: <ArrowLeft size={18} className="text-red-400" />
    },
    peek: {
      name: "Peek",
      description: "Returns the front element without removing it.",
      timeComplexity: "O(1)", 
      spaceComplexity: "O(1)",
      icon: <Eye size={18} className="text-blue-400" />
    },
    "is-empty": {
      name: "Is Empty",
      description: "Checks if the queue is empty.",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      icon: <CheckSquare size={18} className="text-yellow-400" />
    },
    "is-full": {
      name: "Is Full",
      description: "Checks if the queue is full.",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      icon: <AlertCircle size={18} className="text-purple-400" />
    },
    none: {
      name: "Select Operation",
      description: "Select an operation to visualize how it works on the queue.",
      timeComplexity: "",
      spaceComplexity: "",
      icon: null
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const setOriginalQueue = (queue) => {
    originalQueueRef.current = [...queue];
    setDisplayQueue([...queue]);
    
    // Set front and rear pointers
    if (queue.length > 0) {
      setFrontIndex(0);
      setRearIndex(queue.length - 1);
    } else {
      setFrontIndex(-1);
      setRearIndex(-1);
    }
  };

  const generateRandomQueue = (size = queueSize) => {
    const queue = Array.from(
      { length: Math.min(5, size) },
      () => Math.floor(Math.random() * 96) + 5
    );
    setOriginalQueue(queue);
    resetVisualizationState();
    showNotification("Generated new random queue", "success");
  };

  const resetVisualizationState = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setSteps([]);
    setDisplayQueue([...originalQueueRef.current]);
    setAlgorithmDescription(
      selectedOperation ? operationInfo[selectedOperation].description : "Select an operation to visualize how it works on the queue."
    );
    clearTimeout(animationRef.current);
    
    // Reset pointers
    if (originalQueueRef.current.length > 0) {
      setFrontIndex(0);
      setRearIndex(originalQueueRef.current.length - 1);
    } else {
      setFrontIndex(-1);
      setRearIndex(-1);
    }
  };

  // Queue operation implementations
  const generateStepsForOperation = (operation) => {
    if (!operation || operation === "none") {
      showNotification("Please select an operation first", "warning");
      return;
    }
    
    setAlgorithmDescription(operationInfo[operation].description || "");
    const queue = [...originalQueueRef.current];
    const out = [];
    let currentFront = frontIndex;
    let currentRear = rearIndex;

    // Enqueue operation
    if (operation === "enqueue") {
      if (!operationValue) {
        showNotification("Please enter a value to enqueue", "warning");
        return;
      }
      const value = parseInt(operationValue, 10);
      
      if (isNaN(value)) {
        showNotification("Please enter a valid number", "warning");
        return;
      }

      if (queue.length >= queueSize) {
        out.push({
          queue: [...queue],
          front: currentFront,
          rear: currentRear,
          highlighted: [],
          description: `Queue is full! Cannot enqueue ${value}.`,
        });
      } else {
        out.push({
          queue: [...queue],
          front: currentFront,
          rear: currentRear,
          highlighted: [],
          description: `Preparing to enqueue ${value} to the rear of the queue.`,
        });

        const newQueue = [...queue, value];
        const newRear = newQueue.length - 1;
        const newFront = currentFront === -1 ? 0 : currentFront;
        
        out.push({
          queue: [...newQueue],
          front: newFront,
          rear: newRear,
          highlighted: [newRear],
          description: `Enqueued ${value} to the rear of the queue.`,
        });
      }
    }

    // Dequeue operation
    else if (operation === "dequeue") {
      if (queue.length === 0) {
        out.push({
          queue: [...queue],
          front: currentFront,
          rear: currentRear,
          highlighted: [],
          description: "Queue is empty! Cannot dequeue.",
        });
      } else {
        const frontValue = queue[0];
        out.push({
          queue: [...queue],
          front: currentFront,
          rear: currentRear,
          highlighted: [currentFront],
          description: `Preparing to dequeue ${frontValue} from the front of the queue.`,
        });

        const newQueue = queue.slice(1);
        const newFront = newQueue.length > 0 ? 0 : -1;
        const newRear = newQueue.length > 0 ? newQueue.length - 1 : -1;
        
        out.push({
          queue: [...newQueue],
          front: newFront,
          rear: newRear,
          highlighted: [],
          description: `Dequeued ${frontValue} from the queue.`,
        });
      }
    }

    // Peek operation
    else if (operation === "peek") {
      if (queue.length === 0) {
        out.push({
          queue: [...queue],
          front: currentFront,
          rear: currentRear,
          highlighted: [],
          description: "Queue is empty! Nothing to peek.",
        });
      } else {
        const frontValue = queue[0];
        out.push({
          queue: [...queue],
          front: currentFront,
          rear: currentRear,
          highlighted: [currentFront],
          description: `Peeking at the front of the queue: ${frontValue}.`,
        });
      }
    }

    // Is Empty operation
    else if (operation === "is-empty") {
      const isEmpty = queue.length === 0;
      out.push({
        queue: [...queue],
        front: currentFront,
        rear: currentRear,
        highlighted: [],
        description: `Queue is ${isEmpty ? "empty" : "not empty"}.`,
      });
    }

    // Is Full operation
    else if (operation === "is-full") {
      const isFull = queue.length >= queueSize;
      out.push({
        queue: [...queue],
        front: currentFront,
        rear: currentRear,
        highlighted: [],
        description: `Queue is ${isFull ? "full" : "not full"}.`,
      });
    }

    setSteps(out);
    setCurrentStepIndex(0);
    if (out.length > 0) {
      setDisplayQueue([...out[0].queue]);
      setFrontIndex(out[0].front);
      setRearIndex(out[0].rear);
    } else {
      setDisplayQueue([...queue]);
    }
    setTimeout(() => setIsPlaying(true), 50);
  };

  useEffect(() => {
    if (!mountedRef.current) {
      generateRandomQueue(queueSize);
      mountedRef.current = true;
    }
  }, []);

  useEffect(() => {
    // Clear any existing timeout
    clearTimeout(animationRef.current);

    if (isPlaying && steps.length > 0) {
      if (currentStepIndex < steps.length - 1) {
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
      setDisplayQueue([...steps[currentStepIndex].queue]);
      setFrontIndex(steps[currentStepIndex].front);
      setRearIndex(steps[currentStepIndex].rear);
      setAlgorithmDescription(steps[currentStepIndex].description);
    }
  }, [currentStepIndex, steps]);

  const currentStepObj = steps[currentStepIndex] || null;

  if (dsId !== "queue") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl">
        Visualization for {dsId} is coming soon!
      </div>
    );
  }

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
          <h2 className="text-xl font-bold">Queue Operations</h2>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="lg:hidden p-1 rounded hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-sm uppercase text-gray-400 font-semibold mb-2">Queue Operations</h3>
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
            <h3 className="text-sm uppercase text-gray-400 font-semibold mb-2">Queue Information</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Capacity:</span>
                <span>{queueSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Size:</span>
                <span>{displayQueue.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Front Element:</span>
                <span>{displayQueue.length > 0 ? displayQueue[0] : "None"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rear Element:</span>
                <span>{displayQueue.length > 0 ? displayQueue[displayQueue.length - 1] : "None"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={displayQueue.length === 0 ? "text-yellow-400" : displayQueue.length >= queueSize ? "text-red-400" : "text-green-400"}>
                  {displayQueue.length === 0 ? "Empty" : displayQueue.length >= queueSize ? "Full" : "Available"}
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
              <h1 className="text-2xl lg:text-3xl font-bold">Queue Visualizer</h1>
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
                  <label className="block mb-2 text-gray-300">Queue Size: {queueSize}</label>
                  <div className="flex items-center space-x-2">
                    <Minus 
                      size={16} 
                      className="cursor-pointer text-gray-400 hover:text-white" 
                      onClick={() => {
                        const newSize = Math.max(5, queueSize - 1);
                        setQueueSize(newSize);
                        generateRandomQueue(newSize);
                      }} 
                    />
                    <input
                      type="range"
                      min="5"
                      max="15"
                      value={queueSize}
                      onChange={(e) => {
                        const newSize = parseInt(e.target.value);
                        setQueueSize(newSize);
                        generateRandomQueue(newSize);
                      }}
                      className="w-full"
                    />
                    <Plus 
                      size={16} 
                      className="cursor-pointer text-gray-400 hover:text-white" 
                      onClick={() => {
                        const newSize = Math.min(15, queueSize + 1);
                        setQueueSize(newSize);
                        generateRandomQueue(newSize);
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
                    Value for Enqueue
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
                    onClick={() => generateRandomQueue()}
                    className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw size={16} className="inline mr-2" />
                    Reset Queue
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
            <div className="flex flex-col items-center mb-6">
              {/* Queue Table Visualization */}
              <div className="w-full mb-6">
                <div className="flex justify-between mb-4">
                  <div className="flex items-center text-green-400">
                    <ArrowRight size={18} className="mr-2" />
                    <span>Enqueue (Rear)</span>
                  </div>
                  <div className="flex items-center text-red-400">
                    <span>Dequeue (Front)</span>
                    <ArrowLeft size={18} className="ml-2" />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <div className="bg-gray-700 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-8 gap-2">
                      {Array.from({ length: queueSize }).map((_, index) => {
                        const value = displayQueue[index];
                        const isHighlighted = currentStepObj?.highlighted?.includes(index);
                        const isEmptyCell = index >= displayQueue.length;
                        const isFront = index === frontIndex;
                        const isRear = index === rearIndex;
                        
                        return (
                          <div key={index} className="flex flex-col items-center">
                            <div className="text-xs text-gray-400 mb-1">Index {index}</div>
                            <div 
                              className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all ${
                                isHighlighted
                                  ? "bg-indigo-500 border-indigo-300 shadow-lg"
                                  : isEmptyCell
                                  ? "bg-gray-800 border-gray-600"
                                  : "bg-gray-600 border-gray-500"
                              } ${isFront ? "border-blue-400" : ""} ${isRear ? "border-green-400" : ""}`}
                            >
                              {!isEmptyCell ? (
                                <span className="text-lg font-bold">{value}</span>
                              ) : (
                                <span className="text-gray-500 text-sm">Empty</span>
                              )}
                            </div>
                            <div className="mt-2 text-xs">
                              {isFront && isRear && (
                                <span className="text-purple-400 font-semibold">Front/Rear</span>
                              )}
                              {isFront && !isRear && (
                                <span className="text-blue-400 font-semibold">Front</span>
                              )}
                              {isRear && !isFront && (
                                <span className="text-green-400 font-semibold">Rear</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4 px-4">
                  <div className="text-sm text-gray-400 flex items-center">
                    <div className="w-3 h-3 bg-blue-400 mr-2 rounded-sm"></div>
                    Front Index: {frontIndex >= 0 ? frontIndex : "None"}
                  </div>
                  <div className="text-sm text-gray-400 flex items-center">
                    <div className="w-3 h-3 bg-green-400 mr-2 rounded-sm"></div>
                    Rear Index: {rearIndex >= 0 ? rearIndex : "None"}
                  </div>
                </div>
              </div>

              {/* Operation Description */}
              <div className="w-full text-center p-4 bg-gray-900 rounded-lg">
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

          {/* Queue Principles */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Queue Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-300 mb-2 flex items-center">
                  <Clock size={18} className="mr-2" />
                  FIFO Principle
                </h3>
                <p className="text-sm text-gray-300">
                  Queue follows the <strong>First-In-First-Out (FIFO)</strong> principle where the first element
                  added is the first one to be removed. This is similar to a line of people waiting - the first person in line is the first to be served.
                </p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-300 mb-2">
                  Common Operations
                </h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 mr-2 rounded-sm"></div>
                    <span className="font-semibold">Enqueue:</span> Add an element to the rear
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 bg-red-400 mr-2 rounded-sm"></div>
                    <span className="font-semibold">Dequeue:</span> Remove an element from the front
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 mr-2 rounded-sm"></div>
                    <span className="font-semibold">Peek:</span> View the front element
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 mr-2 rounded-sm"></div>
                    <span className="font-semibold">isEmpty:</span> Check if queue is empty
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 bg-purple-400 mr-2 rounded-sm"></div>
                    <span className="font-semibold">isFull:</span> Check if queue is full
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}