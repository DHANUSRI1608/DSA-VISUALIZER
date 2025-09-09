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
  Search,
  ArrowUpDown,
  Circle,
  MousePointer,
  Edit3,
  Zap,
  GitMerge,
  ArrowDownUp,
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
  const [targetValue, setTargetValue] = useState();
  const [customArrayInput, setCustomArrayInput] = useState("");
  const [showControls, setShowControls] = useState(true);
  const [algorithmDescription, setAlgorithmDescription] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState("search");

  // Internal refs
  const animationRef = useRef(null);
  const originalArrayRef = useRef([]);
  const mountedRef = useRef(false);

  const algorithmInfo = {
    "linear-search": {
      name: "Linear Search",
      description: "Checks each element sequentially until it finds the target value.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      category: "search",
      icon: <Search size={18} />
    },
    "binary-search": {
      name: "Binary Search",
      description: "Requires a sorted array and repeatedly divides the search interval in half.",
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
      category: "search",
      icon: <Search size={18} className="transform rotate-90" />
    },
    "bubble-sort": {
      name: "Bubble Sort",
      description: "Repeatedly swaps adjacent elements if they are in the wrong order.",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      category: "sort",
      icon: <Circle size={18} className="text-blue-400" />
    },
    "selection-sort": {
      name: "Selection Sort",
      description: "Finds the minimum element and swaps it with the first unsorted element.",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      category: "sort",
      icon: <MousePointer size={18} className="text-green-400" />
    },
    "insertion-sort": {
      name: "Insertion Sort",
      description: "Builds the final array one item at a time by inserting each element into its proper position.",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      category: "sort",
      icon: <Edit3 size={18} className="text-yellow-400" />
    },
    "quick-sort": {
      name: "Quick Sort",
      description: "Selects a 'pivot' element and partitions the array around the pivot.",
      timeComplexity: "O(n log n) average, O(n²) worst",
      spaceComplexity: "O(log n)",
      category: "sort",
      icon: <Zap size={18} className="text-purple-400" />
    },
    "merge-sort": {
      name: "Merge Sort",
      description: "Divides the array into halves, sorts them, and then merges them.",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      category: "sort",
      icon: <GitMerge size={18} className="text-pink-400" />
    },
    none: {
      name: "Select Algorithm",
      description: "Select an algorithm to visualize how it works on the array.",
      timeComplexity: "",
      spaceComplexity: "",
      category: "",
      icon: null
    }
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
      selectedAlgorithm ? algorithmInfo[selectedAlgorithm].description : algorithmInfo.none.description
    );
    clearTimeout(animationRef.current);
  };

  // Algorithm implementations
  const generateStepsForAlgorithm = (algo) => {
    if (!algo) return;
    setAlgorithmDescription(algorithmInfo[algo].description || "");
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

    // Merge Sort
    else if (algo === "merge-sort") {
      const arr = [...arr0];
      
      const merge = (arr, l, m, r, steps) => {
        const n1 = m - l + 1;
        const n2 = r - m;
        
        // Create temp arrays
        const L = new Array(n1);
        const R = new Array(n2);
        
        // Copy data to temp arrays
        for (let i = 0; i < n1; i++) L[i] = arr[l + i];
        for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
        
        // Merge the temp arrays back
        let i = 0, j = 0, k = l;
        
        while (i < n1 && j < n2) {
          steps.push({
            array: [...arr],
            highlighted: [l + i, m + 1 + j],
            description: `Comparing ${L[i]} and ${R[j]}`,
          });
          
          if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
          } else {
            arr[k] = R[j];
            j++;
          }
          k++;
        }
        
        // Copy remaining elements
        while (i < n1) {
          arr[k] = L[i];
          i++;
          k++;
        }
        
        while (j < n2) {
          arr[k] = R[j];
          j++;
          k++;
        }
      };
      
      const mergeSort = (arr, l, r, steps) => {
        if (l >= r) return;
        
        const m = l + Math.floor((r - l) / 2);
        
        steps.push({
          array: [...arr],
          highlighted: Array.from({ length: r - l + 1 }, (_, i) => l + i),
          description: `Splitting array from index ${l} to ${r}`,
        });
        
        mergeSort(arr, l, m, steps);
        mergeSort(arr, m + 1, r, steps);
        
        steps.push({
          array: [...arr],
          highlighted: Array.from({ length: r - l + 1 }, (_, i) => l + i),
          description: `Merging subarrays from ${l} to ${m} and ${m+1} to ${r}`,
        });
        
        merge(arr, l, m, r, steps);
      };
      
      mergeSort(arr, 0, arr.length - 1, out);
      
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

  const handleTargetValueChange = (e) => {
  const value = e.target.value;

  if (value === "") {
    setTargetValue(""); // allow clearing
  } else {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      setTargetValue(parsed);
    }
  }
};


  const currentStepObj = steps[currentStepIndex] || null;

  if (dsId !== "array") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl">
        Visualization for {dsId} is coming soon!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex">
      {/* Sidebar */}
      <div className={`bg-gray-800 w-64 flex-shrink-0 transition-all duration-300 ${sidebarOpen ? "ml-0" : "-ml-64"} lg:ml-0`}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold">Algorithms</h2>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="lg:hidden p-1 rounded hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-sm uppercase text-gray-400 font-semibold mb-2">Categories</h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory("search")}
                className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center space-x-2 ${activeCategory === "search" ? "bg-indigo-600" : "hover:bg-gray-700"}`}
              >
                <Search size={16} />
                <span>Search Algorithms</span>
              </button>
              <button
                onClick={() => setActiveCategory("sort")}
                className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center space-x-2 ${activeCategory === "sort" ? "bg-indigo-600" : "hover:bg-gray-700"}`}
              >
                <ArrowDownUp size={16} />
                <span>Sorting Algorithms</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase text-gray-400 font-semibold mb-2">
              {activeCategory === "search" ? "Search Algorithms" : "Sorting Algorithms"}
            </h3>
            <div className="space-y-2">
              {Object.entries(algorithmInfo)
                .filter(([key, info]) => info.category === activeCategory && key !== "none")
                .map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedAlgorithm(key)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center space-x-2 ${selectedAlgorithm === key ? "bg-indigo-600" : "hover:bg-gray-700"}`}
                  >
                    <span className="text-gray-400">{info.icon}</span>
                    <span>{info.name}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="lg:hidden p-1 rounded hover:bg-gray-700"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-3xl font-bold">Array Visualizer</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowControls(!showControls)}
                className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded"
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
                    Target Value
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      placeholder=""
                      value={targetValue}
                      onChange={handleTargetValueChange}
                      className="flex-1 bg-gray-700 px-3 py-2 rounded"
                    /> 
                  </div>
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

          {/* Selected Algorithm Info */}
          {selectedAlgorithm && (
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{algorithmInfo[selectedAlgorithm].name}</h2>
                  <p className="text-gray-300">{algorithmInfo[selectedAlgorithm].description}</p>
                </div>
                <button
                  onClick={() => generateStepsForAlgorithm(selectedAlgorithm)}
                  className="bg-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Visualize Algorithm
                </button>
              </div>
              <div className="flex space-x-6 mt-3 text-sm">
                <div>
                  <span className="text-gray-400">Time Complexity: </span>
                  <span className="font-mono">{algorithmInfo[selectedAlgorithm].timeComplexity}</span>
                </div>
                <div>
                  <span className="text-gray-400">Space Complexity: </span>
                  <span className="font-mono">{algorithmInfo[selectedAlgorithm].spaceComplexity}</span>
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
        </div>
      </div>
    </div>
  );
}