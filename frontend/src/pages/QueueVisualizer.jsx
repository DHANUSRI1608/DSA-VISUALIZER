import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Plus,
  Minus,
} from "lucide-react";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

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

  // Internal refs
  const animationRef = useRef(null);
  const originalQueueRef = useRef([]);
  const mountedRef = useRef(false);

  const operationInfo = {
    enqueue: "Enqueue operation adds an element to the rear of the queue.",
    dequeue: "Dequeue operation removes an element from the front of the queue.",
    peek: "Peek operation returns the front element without removing it.",
    "is-empty": "Checks if the queue is empty.",
    "is-full": "Checks if the queue is full.",
    none: "Select an operation to visualize how it works on the queue.",
  };

  const setOriginalQueue = (queue) => {
    originalQueueRef.current = [...queue];
    setDisplayQueue([...queue]);
  };

  const generateRandomQueue = (size = queueSize) => {
    const queue = Array.from(
      { length: Math.min(5, size) },
      () => Math.floor(Math.random() * 96) + 5
    );
    setOriginalQueue(queue);
    resetVisualizationState();
  };

  const resetVisualizationState = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setSteps([]);
    setDisplayQueue([...originalQueueRef.current]);
    setAlgorithmDescription(
      selectedOperation ? operationInfo[selectedOperation] : operationInfo.none
    );
    clearTimeout(animationRef.current);
  };

  // Queue operation implementations
  const generateStepsForOperation = (operation) => {
    if (!operation) return;
    setAlgorithmDescription(operationInfo[operation] || "");
    const queue = [...originalQueueRef.current];
    const out = [];

    // Enqueue operation
    if (operation === "enqueue") {
      if (!operationValue) {
        alert("Please enter a value to enqueue");
        return;
      }
      const value = parseInt(operationValue, 10);

      if (queue.length >= queueSize) {
        out.push({
          queue: [...queue],
          highlighted: [],
          description: `Queue is full! Cannot enqueue ${value}.`,
        });
      } else {
        out.push({
          queue: [...queue],
          highlighted: [],
          description: `Preparing to enqueue ${value} to the rear of the queue.`,
        });

        const newQueue = [...queue, value];
        out.push({
          queue: [...newQueue],
          highlighted: [newQueue.length - 1],
          description: `Enqueued ${value} to the rear of the queue.`,
        });
      }
    }

    // Dequeue operation
    else if (operation === "dequeue") {
      if (queue.length === 0) {
        out.push({
          queue: [...queue],
          highlighted: [],
          description: "Queue is empty! Cannot dequeue.",
        });
      } else {
        const frontValue = queue[0];
        out.push({
          queue: [...queue],
          highlighted: [0],
          description: `Preparing to dequeue ${frontValue} from the front of the queue.`,
        });

        const newQueue = queue.slice(1);
        out.push({
          queue: [...newQueue],
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
          highlighted: [],
          description: "Queue is empty! Nothing to peek.",
        });
      } else {
        const frontValue = queue[0];
        out.push({
          queue: [...queue],
          highlighted: [0],
          description: `Peeking at the front of the queue: ${frontValue}.`,
        });
      }
    }

    // Is Empty operation
    else if (operation === "is-empty") {
      const isEmpty = queue.length === 0;
      out.push({
        queue: [...queue],
        highlighted: [],
        description: `Queue is ${isEmpty ? "empty" : "not empty"}.`,
      });
    }

    // Is Full operation
    else if (operation === "is-full") {
      const isFull = queue.length >= queueSize;
      out.push({
        queue: [...queue],
        highlighted: [],
        description: `Queue is ${isFull ? "full" : "not full"}.`,
      });
    }

    setSteps(out);
    setCurrentStepIndex(0);
    setDisplayQueue(out.length > 0 ? [...out[0].queue] : [...queue]);
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
      setDisplayQueue([...steps[currentStepIndex].queue]);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Queue Visualizer</h1>
          <div className="flex items-center gap-2">
            <select
              value={selectedOperation}
              onChange={(e) => setSelectedOperation(e.target.value)}
              className="bg-gray-700 px-3 py-2 rounded"
            >
              <option value="">Select Operation</option>
              <option value="enqueue">Enqueue</option>
              <option value="dequeue">Dequeue</option>
              <option value="peek">Peek</option>
              <option value="is-empty">Is Empty</option>
              <option value="is-full">Is Full</option>
            </select>
            <button
              onClick={() => generateStepsForOperation(selectedOperation)}
              disabled={!selectedOperation}
              className="bg-indigo-600 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start
            </button>
          </div>
        </div>

        {/* Controls Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowControls(!showControls)}
            className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded"
          >
            <Sliders size={16} />
            {showControls ? "Hide Controls" : "Show Controls"}
          </button>
        </div>

        {/* Controls Panel */}
        {showControls && (
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2">Queue Size: {queueSize}</label>
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
              </div>

              <div>
                <label className="block mb-2">Speed: {speed}ms</label>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-2">
                  Value for Enqueue: {operationValue}
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={operationValue}
                  onChange={(e) => setOperationValue(e.target.value)}
                  className="w-full bg-gray-700 px-3 py-2 rounded"
                  placeholder="Enter value"
                />
              </div>

              <div className="md:col-span-3 flex justify-center gap-2">
                <button
                  onClick={() => generateRandomQueue()}
                  className="bg-gray-700 px-4 py-2 rounded"
                >
                  Reset Queue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Visualization Area */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="flex flex-col items-center mb-6">
            <div className="h-12 w-full bg-gray-700 mb-2 flex items-center justify-center text-sm text-gray-400">
              Front of Queue
            </div>
            
            <div className="flex flex-wrap justify-center gap-1 mb-2">
              {Array.from({ length: queueSize }).map((_, index) => {
                const value = displayQueue[index];
                const isHighlighted =
                  currentStepObj?.highlighted?.includes(index);
                const isEmptyCell = index >= displayQueue.length;

                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center justify-center transition-all duration-300 ${
                      isHighlighted
                        ? "bg-indigo-500"
                        : isEmptyCell
                        ? "bg-gray-700 border border-gray-600"
                        : "bg-gray-600"
                    }`}
                    style={{
                      height: "50px",
                      width: "80px",
                    }}
                  >
                    {!isEmptyCell && (
                      <span className="text-lg font-bold">{value}</span>
                    )}
                    {isEmptyCell && (
                      <span className="text-gray-500 text-xs">Empty</span>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="h-12 w-full bg-gray-700 mt-2 flex items-center justify-center text-sm text-gray-400">
              Rear of Queue
            </div>
          </div>

          {/* Operation Description */}
          <div className="text-center mb-6">
            <p className="text-lg">{algorithmDescription}</p>
            {currentStepObj && (
              <p className="mt-2 text-indigo-300">
                {currentStepObj.description}
              </p>
            )}
          </div>

          {/* Playback Controls */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentStepIndex(0)}
              disabled={currentStepIndex === 0}
              className="p-2 rounded disabled:opacity-50"
            >
              <RotateCcw size={20} />
            </button>

            <button
              onClick={() => setCurrentStepIndex((i) => Math.max(0, i - 1))}
              disabled={currentStepIndex === 0}
              className="p-2 rounded disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={steps.length === 0}
              className="bg-indigo-600 p-2 rounded disabled:opacity-50"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <button
              onClick={() =>
                setCurrentStepIndex((i) => Math.min(steps.length - 1, i + 1))
              }
              disabled={currentStepIndex === steps.length - 1}
              className="p-2 rounded disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>

            <span className="text-sm">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
        </div>

        {/* Operation Info */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">About This Operation</h2>
          <p>{operationInfo[selectedOperation] || operationInfo.none}</p>
        </div>

        {/* Queue Info */}
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <h2 className="text-xl font-bold mb-2">Queue Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300">
                Current Size: {displayQueue.length}
              </p>
              <p className="text-gray-300">Capacity: {queueSize}</p>
            </div>
            <div>
              <p className="text-gray-300">
                Front Element:{" "}
                {displayQueue.length > 0
                  ? displayQueue[0]
                  : "None"}
              </p>
              <p className="text-gray-300">
                Rear Element:{" "}
                {displayQueue.length > 0
                  ? displayQueue[displayQueue.length - 1]
                  : "None"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}