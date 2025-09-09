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

  // Internal refs
  const animationRef = useRef(null);
  const originalStackRef = useRef([]);
  const mountedRef = useRef(false);

  const operationInfo = {
    push: "Push operation adds an element to the top of the stack.",
    pop: "Pop operation removes the top element from the stack.",
    peek: "Peek operation returns the top element without removing it.",
    "is-empty": "Checks if the stack is empty.",
    "is-full": "Checks if the stack is full.",
    none: "Select an operation to visualize how it works on the stack.",
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
  };

  const resetVisualizationState = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setSteps([]);
    setDisplayStack([...originalStackRef.current]);
    setAlgorithmDescription(
      selectedOperation ? operationInfo[selectedOperation] : operationInfo.none
    );
    clearTimeout(animationRef.current);
  };

  // Stack operation implementations
  const generateStepsForOperation = (operation) => {
    if (!operation) return;
    setAlgorithmDescription(operationInfo[operation] || "");
    const stack = [...originalStackRef.current];
    const out = [];

    // Push operation
    if (operation === "push") {
      if (!operationValue) {
        alert("Please enter a value to push");
        return;
      }
      const value = parseInt(operationValue, 10);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Stack Visualizer</h1>
          <div className="flex items-center gap-2">
            <select
              value={selectedOperation}
              onChange={(e) => setSelectedOperation(e.target.value)}
              className="bg-gray-700 px-3 py-2 rounded"
            >
              <option value="">Select Operation</option>
              <option value="push">Push</option>
              <option value="pop">Pop</option>
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
                <label className="block mb-2">Stack Size: {stackSize}</label>
                <input
                  type="range"
                  min="5"
                  max="15"
                  value={stackSize}
                  onChange={(e) => {
                    const newSize = parseInt(e.target.value);
                    setStackSize(newSize);
                    generateRandomStack(newSize);
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
                  Value for Push: {operationValue}
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
                  onClick={() => generateRandomStack()}
                  className="bg-gray-700 px-4 py-2 rounded"
                >
                  Reset Stack
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Visualization Area */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="h-96 flex flex-col-reverse items-center justify-end gap-1 mb-6">
            {Array.from({ length: stackSize }).map((_, index) => {
              const value = displayStack[index];
              const isHighlighted =
                currentStepObj?.highlighted?.includes(index);
              const isEmptyCell = index >= displayStack.length;

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
                    width: "120px",
                  }}
                >
                  {!isEmptyCell && (
                    <span className="text-lg font-bold">{value}</span>
                  )}
                  {isEmptyCell && (
                    <span className="text-gray-500 text-sm">Empty</span>
                  )}
                </div>
              );
            })}
            <div className="mt-2 text-sm text-gray-400">Top of Stack ↑</div>
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

        {/* Stack Info */}
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <h2 className="text-xl font-bold mb-2">Stack Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300">
                Current Size: {displayStack.length}
              </p>
              <p className="text-gray-300">Capacity: {stackSize}</p>
            </div>
            <div>
              <p className="text-gray-300">
                Top Element:{" "}
                {displayStack.length > 0
                  ? displayStack[displayStack.length - 1]
                  : "None"}
              </p>
              <p className="text-gray-300">
                Status:{" "}
                {displayStack.length >= stackSize
                  ? "Full"
                  : displayStack.length === 0
                  ? "Empty"
                  : "Available"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
