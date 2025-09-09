import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sliders,
} from "lucide-react";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export default function ArrayVisualizer() {
  const { dsId } = useParams();

  // UI/control states
  const [arraySize, setArraySize] = useState(10);
  const [speed, setSpeed] = useState(600);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [displayArray, setDisplayArray] = useState([]);
  const [targetValue, setTargetValue] = useState(50);
  const [customArrayInput, setCustomArrayInput] = useState("");
  const [showControls, setShowControls] = useState(true);
  const [algorithmDescription, setAlgorithmDescription] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");

  // Internal refs
  const animationRef = useRef(null);
  const originalArrayRef = useRef([]);
  const mountedRef = useRef(false);

  const algorithmInfo = {
    "linear-search":
      "Linear Search checks each element sequentially until it finds the target value.",
    "binary-search":
      "Binary Search requires a sorted array and repeatedly divides the search interval in half.",
    "bubble-sort":
      "Bubble Sort repeatedly swaps adjacent elements if they are in the wrong order.",
    "selection-sort":
      "Selection Sort finds the minimum element and swaps it with the first unsorted element.",
    "insertion-sort":
      "Insertion Sort builds the final array one item at a time by inserting each element into its proper position.",
    "quick-sort":
      "Quick Sort selects a 'pivot' element and partitions the array around the pivot.",
    none: "Select an algorithm to visualize how it works on the array.",
  };

  const setOriginalArray = (arr) => {
    originalArrayRef.current = [...arr];
    setDisplayArray([...arr]);
  };

  const generateRandomArray = (size = arraySize) => {
    const arr = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 96) + 5
    );
    setOriginalArray(arr);
    resetVisualizationState();
  };

  const applyCustomArray = () => {
    if (!customArrayInput) return;
    const parsed = customArrayInput
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => Number.isFinite(n));
    if (parsed.length === 0)
      return alert("Enter comma-separated numbers, e.g. 5,3,8,1");
    setArraySize(parsed.length);
    setOriginalArray(parsed);
    setCustomArrayInput("");
    resetVisualizationState();
  };

  const resetVisualizationState = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setSteps([]);
    setDisplayArray([...originalArrayRef.current]);
    setAlgorithmDescription(
      selectedAlgorithm ? algorithmInfo[selectedAlgorithm] : algorithmInfo.none
    );
    clearTimeout(animationRef.current);
  };

  // Algorithm implementations
  const generateStepsForAlgorithm = (algo) => {
    if (!algo) return;
    setAlgorithmDescription(algorithmInfo[algo] || "");
    const arr0 = [...originalArrayRef.current];
    const out = [];

    // Linear Search
    if (algo === "linear-search") {
      for (let i = 0; i < arr0.length; i++) {
        out.push({
          array: [...arr0],
          highlighted: [i],
          description: `Checking index ${i} (value: ${arr0[i]})`,
        });
        if (arr0[i] === targetValue) {
          out.push({
            array: [...arr0],
            highlighted: [i],
            description: `Found ${targetValue} at index ${i}!`,
          });
          break;
        }
      }
      if (
        out.length > 0 &&
        !out[out.length - 1].description.includes("Found")
      ) {
        out.push({
          array: [...arr0],
          highlighted: [],
          description: `${targetValue} not found in the array.`,
        });
      }
    }

    // Binary Search (requires sorted array)
    else if (algo === "binary-search") {
      const sortedArray = [...arr0].sort((a, b) => a - b);
      let low = 0;
      let high = sortedArray.length - 1;

      out.push({
        array: [...sortedArray],
        highlighted: [],
        description: "Starting binary search on sorted array",
      });

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        out.push({
          array: [...sortedArray],
          highlighted: [mid],
          description: `Checking middle element at index ${mid} (value: ${sortedArray[mid]})`,
        });

        if (sortedArray[mid] === targetValue) {
          out.push({
            array: [...sortedArray],
            highlighted: [mid],
            description: `Found ${targetValue} at index ${mid}!`,
          });
          break;
        } else if (sortedArray[mid] < targetValue) {
          out.push({
            array: [...sortedArray],
            highlighted: Array.from(
              { length: high - mid },
              (_, i) => mid + i + 1
            ),
            description: `${sortedArray[mid]} < ${targetValue}, searching right half`,
          });
          low = mid + 1;
        } else {
          out.push({
            array: [...sortedArray],
            highlighted: Array.from({ length: mid - low }, (_, i) => low + i),
            description: `${sortedArray[mid]} > ${targetValue}, searching left half`,
          });
          high = mid - 1;
        }
      }

      if (
        out.length > 0 &&
        !out[out.length - 1].description.includes("Found")
      ) {
        out.push({
          array: [...sortedArray],
          highlighted: [],
          description: `${targetValue} not found in the array.`,
        });
      }
    }

    // Bubble Sort
    else if (algo === "bubble-sort") {
      const arr = [...arr0];
      let n = arr.length;

      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          out.push({
            array: [...arr],
            highlighted: [j, j + 1],
            description: `Comparing ${arr[j]} and ${arr[j + 1]}`,
          });

          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            out.push({
              array: [...arr],
              highlighted: [j, j + 1],
              description: `Swapped ${arr[j + 1]} and ${arr[j]}`,
            });
          }
        }
        out.push({
          array: [...arr],
          highlighted: Array.from({ length: i + 1 }, (_, idx) => n - 1 - idx),
          description: `Pass ${i + 1} completed, ${i + 1} elements sorted`,
        });
      }
    }

    // Selection Sort
    else if (algo === "selection-sort") {
      const arr = [...arr0];
      const n = arr.length;

      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;

        out.push({
          array: [...arr],
          highlighted: [i],
          description: `Starting from index ${i}, looking for minimum`,
        });

        for (let j = i + 1; j < n; j++) {
          out.push({
            array: [...arr],
            highlighted: [minIdx, j],
            description: `Comparing ${arr[minIdx]} and ${arr[j]}`,
          });

          if (arr[j] < arr[minIdx]) {
            minIdx = j;
            out.push({
              array: [...arr],
              highlighted: [minIdx],
              description: `New minimum found: ${arr[minIdx]} at index ${minIdx}`,
            });
          }
        }

        if (minIdx !== i) {
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          out.push({
            array: [...arr],
            highlighted: [i, minIdx],
            description: `Swapped ${arr[minIdx]} and ${arr[i]}`,
          });
        }

        out.push({
          array: [...arr],
          highlighted: Array.from({ length: i + 1 }, (_, idx) => idx),
          description: `${i + 1} elements sorted`,
        });
      }
    }

    // Insertion Sort
    else if (algo === "insertion-sort") {
      const arr = [...arr0];
      const n = arr.length;

      for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;

        out.push({
          array: [...arr],
          highlighted: [i],
          description: `Selecting element ${key} at index ${i} for insertion`,
        });

        while (j >= 0 && arr[j] > key) {
          out.push({
            array: [...arr],
            highlighted: [j, j + 1],
            description: `Shifting ${arr[j]} to the right`,
          });

          arr[j + 1] = arr[j];
          j = j - 1;
        }

        arr[j + 1] = key;
        out.push({
          array: [...arr],
          highlighted: [j + 1],
          description: `Inserted ${key} at index ${j + 1}`,
        });
      }
    }

    // Quick Sort
    else if (algo === "quick-sort") {
      const arr = [...arr0];

      // Helper function for partitioning
      const partition = (arr, low, high, steps) => {
        const pivot = arr[high];
        let i = low - 1;

        steps.push({
          array: [...arr],
          highlighted: [high],
          description: `Selecting pivot: ${pivot} at index ${high}`,
        });

        for (let j = low; j < high; j++) {
          steps.push({
            array: [...arr],
            highlighted: [j, high],
            description: `Comparing ${arr[j]} with pivot ${pivot}`,
          });

          if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];

            if (i !== j) {
              steps.push({
                array: [...arr],
                highlighted: [i, j],
                description: `Swapped ${arr[j]} and ${arr[i]}`,
              });
            }
          }
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        steps.push({
          array: [...arr],
          highlighted: [i + 1, high],
          description: `Placed pivot ${pivot} at correct position ${i + 1}`,
        });

        return i + 1;
      };

      // Recursive quicksort implementation with steps tracking
      const quickSort = (arr, low, high, steps) => {
        if (low < high) {
          const pi = partition(arr, low, high, steps);

          steps.push({
            array: [...arr],
            highlighted: Array.from(
              { length: high - low + 1 },
              (_, idx) => low + idx
            ),
            description: `Partitioned from ${low} to ${high}, pivot at ${pi}`,
          });

          quickSort(arr, low, pi - 1, steps);
          quickSort(arr, pi + 1, high, steps);
        }
      };

      quickSort(arr, 0, arr.length - 1, out);

      out.push({
        array: [...arr],
        highlighted: Array.from({ length: arr.length }, (_, i) => i),
        description: "Array is now sorted!",
      });
    }

    setSteps(out);
    setCurrentStepIndex(0);
    setDisplayArray(out.length > 0 ? [...out[0].array] : [...arr0]);
    setTimeout(() => setIsPlaying(true), 50);
  };

  useEffect(() => {
    if (!mountedRef.current) {
      generateRandomArray(arraySize);
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
      setDisplayArray([...steps[currentStepIndex].array]);
    }
  }, [currentStepIndex, steps]);

  const currentStepObj = steps[currentStepIndex] || null;

  if (dsId !== "array") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl">
        Visualization for {dsId} is coming soon!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Array Visualizer</h1>
          <div className="flex items-center gap-2">
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="bg-gray-700 px-3 py-2 rounded"
            >
              <option value="">Select Algorithm</option>
              <option value="linear-search">Linear Search</option>
              <option value="binary-search">Binary Search</option>
              <option value="bubble-sort">Bubble Sort</option>
              <option value="selection-sort">Selection Sort</option>
              <option value="insertion-sort">Insertion Sort</option>
              <option value="quick-sort">Quick Sort</option>
            </select>
            <button
              onClick={() => generateStepsForAlgorithm(selectedAlgorithm)}
              disabled={!selectedAlgorithm}
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
                <label className="block mb-2">Array Size: {arraySize}</label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={arraySize}
                  onChange={(e) => {
                    const newSize = parseInt(e.target.value);
                    setArraySize(newSize);
                    generateRandomArray(newSize);
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
                  Target Value: {targetValue}
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={targetValue}
                  onChange={(e) => setTargetValue(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block mb-2">
                  Custom Array (comma-separated)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customArrayInput}
                    onChange={(e) => setCustomArrayInput(e.target.value)}
                    placeholder="e.g., 5,3,8,1,9"
                    className="flex-1 bg-gray-700 px-3 py-2 rounded"
                  />
                  <button
                    onClick={applyCustomArray}
                    className="bg-indigo-600 px-4 py-2 rounded"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => generateRandomArray()}
                    className="bg-gray-700 px-4 py-2 rounded"
                  >
                    Random
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visualization Area */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="h-64 flex items-end justify-center gap-1 mb-6">
            {displayArray.map((value, index) => {
              const isHighlighted =
                currentStepObj?.highlighted?.includes(index);
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center transition-all duration-300 ${
                    isHighlighted ? "bg-indigo-500" : "bg-gray-600"
                  }`}
                  style={{
                    height: `${value}%`,
                    width: `${90 / displayArray.length}%`,
                    minWidth: "10px",
                  }}
                >
                  <span className="text-xs -mt-6">{value}</span>
                </div>
              );
            })}
          </div>

          {/* Algorithm Description */}
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

        {/* Algorithm Info */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">About This Algorithm</h2>
          <p>{algorithmInfo[selectedAlgorithm] || algorithmInfo.none}</p>
        </div>
      </div>
    </div>
  );
}
