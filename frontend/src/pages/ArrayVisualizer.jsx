// ArrayVisualizer.jsx
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

/**
 * Drop-in Array Visualizer component.
 * - Reads :algorithm or :operation from URL via useParams()
 * - Generates step sequence (steps[]) from an immutable snapshot (originalArrayRef)
 * - Plays steps with configurable speed
 * - Provides controls: play/pause, prev/next, reset, random array, custom array input
 */

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export default function ArrayVisualizer() {
  const { algorithm, operation } = useParams();

  // --- UI / control states
  const [arraySize, setArraySize] = useState(10);
  const [speed, setSpeed] = useState(600); // ms per step
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState([]); // step = { array, highlighted, compared, sorted, pivot, description }
  const [displayArray, setDisplayArray] = useState([]); // what is rendered (from current step or original)
  const [targetValue, setTargetValue] = useState(50);
  const [customArrayInput, setCustomArrayInput] = useState("");
  const [showControls, setShowControls] = useState(true);
  const [algorithmDescription, setAlgorithmDescription] = useState("");

  // internal refs
  const animationRef = useRef(null);
  const originalArrayRef = useRef([]); // snapshot used for step generation (prevents regen while animating)
  const mountedRef = useRef(false);

  // algorithm descriptions
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

  // ---------- Utility: set the original array snapshot ----------
  const setOriginalArray = (arr) => {
    originalArrayRef.current = [...arr];
    setDisplayArray([...arr]);
  };

  // ---------- Generate a new random array ----------
  const generateRandomArray = (size = arraySize) => {
    const arr = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 96) + 5
    );
    setOriginalArray(arr);
    resetVisualizationState();
  };

  // ---------- Apply custom array input ----------
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

  // ---------- Reset visualization state (not the original array) ----------
  const resetVisualizationState = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setSteps([]);
    setDisplayArray([...originalArrayRef.current]);
    setAlgorithmDescription(algorithmInfo[algorithm] || algorithmInfo.none);
    clearTimeout(animationRef.current);
  };

  // ---------- Step helpers ----------
  const pushStep = (out, obj = {}) => {
    // Normalize fields to avoid undefined checks later
    out.push({
      array: obj.array ? [...obj.array] : undefined,
      highlighted: obj.highlighted ? [...obj.highlighted] : [],
      compared: obj.compared ? [...obj.compared] : [],
      sorted: obj.sorted ? [...obj.sorted] : [],
      pivot: typeof obj.pivot === "number" ? obj.pivot : null,
      description: obj.description || "",
    });
  };

  // ---------- Algorithms: generate steps from original snapshot ----------
  const generateStepsForAlgorithm = (algo) => {
    const arr0 = [...originalArrayRef.current]; // immutable snapshot
    const out = [];

    if (!algo) {
      setSteps([]);
      setAlgorithmDescription(algorithmInfo.none);
      return;
    }

    setAlgorithmDescription(algorithmInfo[algo] || "");

    // --- SEARCH: Linear Search ---
    if (algo === "linear-search") {
      for (let i = 0; i < arr0.length; i++) {
        pushStep(out, {
          array: arr0,
          highlighted: [i],
          description: `Checking index ${i} (value ${arr0[i]})`,
        });
        if (arr0[i] === targetValue) {
          pushStep(out, {
            array: arr0,
            highlighted: [i],
            description: `Found ${targetValue} at index ${i}`,
          });
          break;
        }
      }
      if (
        out.length === 0 ||
        !out[out.length - 1].description.includes("Found")
      ) {
        pushStep(out, {
          array: arr0,
          description: `Target ${targetValue} not found`,
        });
      }
    }

    // --- SEARCH: Binary Search (on a sorted copy) ---
    else if (algo === "binary-search") {
      const sorted = [...arr0].sort((a, b) => a - b);
      pushStep(out, {
        array: sorted,
        description: "Array sorted for binary search",
      });

      let left = 0,
        right = sorted.length - 1;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        pushStep(out, {
          array: sorted,
          highlighted: [mid],
          compared: [left, right],
          description: `Checking mid index ${mid} (value ${sorted[mid]})`,
        });
        if (sorted[mid] === targetValue) {
          pushStep(out, {
            array: sorted,
            highlighted: [mid],
            description: `Found ${targetValue} at index ${mid}`,
          });
          break;
        } else if (sorted[mid] < targetValue) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
      if (left > right)
        pushStep(out, {
          array: sorted,
          description: `Target ${targetValue} not found`,
        });
    }

    // --- SORT: Bubble Sort ---
    else if (algo === "bubble-sort") {
      const arr = [...arr0];
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          pushStep(out, {
            array: arr,
            highlighted: [j, j + 1],
            description: `Compare indices ${j} & ${j + 1}`,
          });
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            pushStep(out, {
              array: arr,
              highlighted: [j, j + 1],
              description: `Swap ${arr[j]} & ${arr[j + 1]}`,
            });
          }
        }
        // optionally mark sorted tail
        const sortedTail = Array.from({ length: i + 1 }, (_, k) => n - 1 - k);
        pushStep(out, {
          array: arr,
          sorted: sortedTail.slice(),
          description: `Element at index ${n - i - 1} is in final position`,
        });
      }
      pushStep(out, {
        array: arr,
        sorted: Array.from({ length: n }, (_, k) => k),
        description: `Sorted`,
      });
    }

    // --- SORT: Selection Sort ---
    else if (algo === "selection-sort") {
      const arr = [...arr0];
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        pushStep(out, {
          array: arr,
          highlighted: [i],
          description: `Selecting index ${i} as current minimum`,
        });
        for (let j = i + 1; j < n; j++) {
          pushStep(out, {
            array: arr,
            highlighted: [minIdx, j],
            description: `Compare indices ${minIdx} & ${j}`,
          });
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
            pushStep(out, {
              array: arr,
              highlighted: [minIdx],
              description: `New min at index ${minIdx}`,
            });
          }
        }
        if (minIdx !== i) {
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          pushStep(out, {
            array: arr,
            highlighted: [i, minIdx],
            description: `Swap index ${i} & ${minIdx}`,
          });
        }
        pushStep(out, {
          array: arr,
          sorted: Array.from({ length: i + 1 }, (_, k) => k),
          description: `Index ${i} in final position`,
        });
      }
      pushStep(out, {
        array: arr,
        sorted: Array.from({ length: n }, (_, k) => k),
        description: "Sorted",
      });
    }

    // --- SORT: Insertion Sort ---
    else if (algo === "insertion-sort") {
      const arr = [...arr0];
      const n = arr.length;
      for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        pushStep(out, {
          array: arr,
          highlighted: [i],
          description: `Take key ${key} at index ${i}`,
        });
        while (j >= 0 && arr[j] > key) {
          pushStep(out, {
            array: arr,
            highlighted: [j, j + 1],
            description: `Shift ${arr[j]} right`,
          });
          arr[j + 1] = arr[j];
          j -= 1;
          pushStep(out, {
            array: arr,
            highlighted: [j + 1],
            description: `Continue searching insertion point`,
          });
        }
        arr[j + 1] = key;
        pushStep(out, {
          array: arr,
          highlighted: [j + 1],
          sorted: Array.from({ length: i + 1 }, (_, k) => k),
          description: `Insert ${key} at index ${j + 1}`,
        });
      }
      pushStep(out, {
        array: arr,
        sorted: Array.from({ length: n }, (_, k) => k),
        description: "Sorted",
      });
    }

    // --- SORT: Quick Sort (Lomuto partition) ---
    else if (algo === "quick-sort") {
      const arr = [...arr0];
      const n = arr.length;

      function partition(l, r) {
        const pivot = arr[r];
        let i = l - 1;
        pushStep(out, {
          array: arr,
          pivot: r,
          description: `Partition range [${l},${r}] using pivot index ${r} (value ${pivot})`,
        });
        for (let j = l; j <= r - 1; j++) {
          pushStep(out, {
            array: arr,
            highlighted: [j, r],
            description: `Compare index ${j} with pivot`,
          });
          if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            pushStep(out, {
              array: arr,
              highlighted: [i, j],
              description: `Swap index ${i} & ${j}`,
            });
          }
        }
        [arr[i + 1], arr[r]] = [arr[r], arr[i + 1]];
        pushStep(out, {
          array: arr,
          highlighted: [i + 1, r],
          pivot: i + 1,
          description: `Swap pivot to index ${i + 1}`,
        });
        return i + 1;
      }

      function quick(l, r) {
        if (l < r) {
          const p = partition(l, r);
          quick(l, p - 1);
          quick(p + 1, r);
        }
      }

      quick(0, n - 1);
      pushStep(out, {
        array: arr,
        sorted: Array.from({ length: n }, (_, k) => k),
        description: "Sorted",
      });
    }

    // If algorithm not recognized we push a placeholder
    else {
      pushStep(out, {
        array: arr0,
        description: `Algorithm "${algo}" not implemented yet.`,
      });
    }

    setSteps(out);
    setCurrentStepIndex(0);
    setDisplayArray(
      out.length > 0 && out[0].array
        ? [...out[0].array]
        : [...originalArrayRef.current]
    );
    // auto-start if we were navigated by an algorithm param
    setTimeout(() => {
      setIsPlaying(Boolean(algorithm)); // auto-play if algorithm is present
    }, 50);
  };

  // ---------- Generate steps whenever algorithm param is present (but NOT when displayArray changes) ----------
  useEffect(() => {
    // On mount, set up initial random array if not set
    if (!mountedRef.current) {
      generateRandomArray(arraySize);
      mountedRef.current = true;
    }
    // if algorithm param exists, create steps
    if (algorithm) {
      generateStepsForAlgorithm(algorithm);
    } else {
      // when no algorithm in URL, clear steps and show original array
      setSteps([]);
      setCurrentStepIndex(0);
      setDisplayArray([...originalArrayRef.current]);
      setAlgorithmDescription(algorithmInfo.none);
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm]); // only run when algorithm changes

  // ---------- Animation playback effect ----------
  useEffect(() => {
    // advance when isPlaying true
    if (isPlaying && steps.length > 0) {
      // schedule next step
      if (currentStepIndex < steps.length - 1) {
        animationRef.current = setTimeout(() => {
          setCurrentStepIndex((s) => s + 1);
        }, clamp(speed, 50, 5000));
      } else {
        // reached end
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(animationRef.current);
  }, [isPlaying, currentStepIndex, steps, speed]);

  // ---------- Reflect current step into displayed array & decorations ----------
  useEffect(() => {
    if (steps.length === 0) return;
    const step = steps[clamp(currentStepIndex, 0, steps.length - 1)];
    if (!step) return;
    if (step.array) setDisplayArray([...step.array]);
    setAlgorithmDescription(step.description || "");
    // highlight/comparison/sorted/pivot info saved in step but for rendering we just use step fields
    // (we won't separately store highlightedIndices etc; we reference step when rendering)
  }, [currentStepIndex, steps]);

  // ---------- Manual controls ----------
  const play = () => {
    if (steps.length === 0) {
      if (algorithm) generateStepsForAlgorithm(algorithm);
      else return;
    }
    setIsPlaying(true);
  };
  const pause = () => setIsPlaying(false);
  const next = () => {
    setIsPlaying(false);
    setCurrentStepIndex((s) => clamp(s + 1, 0, Math.max(0, steps.length - 1)));
  };
  const prev = () => {
    setIsPlaying(false);
    setCurrentStepIndex((s) => clamp(s - 1, 0, Math.max(0, steps.length - 1)));
  };
  const reset = () => {
    pause();
    setCurrentStepIndex(0);
    setDisplayArray([...originalArrayRef.current]);
    // if algorithm present, regenerate steps
    if (algorithm) {
      setTimeout(() => generateStepsForAlgorithm(algorithm), 50);
    } else {
      setSteps([]);
    }
  };

  // ---------- Render ----------
  // When rendering decorations for the current step we reference the current step object
  const currentStepObj =
    steps.length > 0
      ? steps[clamp(currentStepIndex, 0, steps.length - 1)]
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Array Visualizer
            <span className="text-base font-medium text-gray-300 ml-3">
              {algorithm
                ? `— ${algorithm.replace(/-/g, " ")}`
                : operation
                ? `— ${operation}`
                : ""}
            </span>
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowControls((s) => !s)}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md"
              title="Toggle controls"
            >
              <Sliders size={16} /> {showControls ? "Hide" : "Show"}
            </button>

            <button
              onClick={reset}
              className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md"
              title="Reset"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualization area */}
          <div className="lg:col-span-2 bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Visualization</h2>
              <p className="text-sm text-gray-400 mt-1">
                {algorithmDescription}
              </p>
            </div>

            <div className="flex items-end justify-center h-64 bg-gray-900/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-end w-full gap-1 px-2">
                {displayArray.map((val, idx) => {
                  const step = currentStepObj;
                  const highlighted = step?.highlighted?.includes(idx);
                  const compared = step?.compared?.includes(idx);
                  const sorted = step?.sorted?.includes(idx);
                  const pivot = step?.pivot === idx;

                  let barColor = "bg-blue-600";
                  if (sorted) barColor = "bg-green-500";
                  else if (pivot) barColor = "bg-purple-500";
                  else if (compared) barColor = "bg-red-500";
                  else if (highlighted) barColor = "bg-yellow-400";

                  const widthPercent = `${Math.max(
                    6,
                    Math.floor(90 / Math.max(5, displayArray.length))
                  )}%`;

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center"
                      style={{ width: widthPercent }}
                    >
                      <div
                        className={`${barColor} rounded-t-md w-full flex items-end justify-center transition-all duration-200`}
                        style={{ height: `${val * 2}px`, minHeight: 20 }}
                        title={`index ${idx} — ${val}`}
                      >
                        <span className="text-[10px] text-white px-1 pb-1">
                          {val}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        [{idx}]
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* step controls */}
            <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={prev}
                  disabled={currentStepIndex === 0}
                  className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                </button>

                {!isPlaying ? (
                  <button
                    onClick={play}
                    className="px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <Play size={16} /> Play
                  </button>
                ) : (
                  <button
                    onClick={pause}
                    className="px-5 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2"
                  >
                    <Pause size={16} /> Pause
                  </button>
                )}

                <button
                  onClick={next}
                  disabled={currentStepIndex >= Math.max(0, steps.length - 1)}
                  className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                >
                  <ChevronRight size={18} />
                </button>

                <button
                  onClick={() => {
                    generateRandomArray(arraySize);
                  }}
                  className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
                  title="Random array"
                >
                  <RotateCcw size={18} />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-400">
                  Step:{" "}
                  <span className="text-white font-medium">
                    {clamp(currentStepIndex + 1, 1, Math.max(1, steps.length))}
                  </span>{" "}
                  /{" "}
                  <span className="text-white font-medium">
                    {Math.max(1, steps.length)}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  Array:{" "}
                  <span className="text-white font-medium">
                    {displayArray.length}
                  </span>
                </div>
              </div>
            </div>

            {/* speed slider */}
            <div className="mt-4">
              <label className="text-sm text-gray-400">
                Speed:{" "}
                <span className="text-white font-medium">{speed} ms</span>
              </label>
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>

          {/* RIGHT SIDEBAR: controls & legend */}
          {showControls && (
            <aside className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Controls</h3>

              <div className="mb-4">
                <label className="text-sm text-gray-400">
                  Array Size: {arraySize}
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={arraySize}
                  onChange={(e) => setArraySize(Number(e.target.value))}
                  className="w-full my-2"
                />
                <button
                  onClick={() => generateRandomArray(arraySize)}
                  className="w-full py-2 rounded-md bg-indigo-600 hover:bg-indigo-700"
                >
                  Generate
                </button>
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-400">
                  Custom Array (comma separated)
                </label>
                <div className="flex gap-2 mt-2">
                  <input
                    className="flex-1 bg-gray-700 px-3 py-2 rounded-md text-sm placeholder-gray-300"
                    placeholder="e.g. 5,3,8,1,9"
                    value={customArrayInput}
                    onChange={(e) => setCustomArrayInput(e.target.value)}
                  />
                  <button
                    onClick={applyCustomArray}
                    className="px-3 py-2 bg-gray-700 rounded-md"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {(algorithm === "linear-search" ||
                algorithm === "binary-search") && (
                <div className="mb-4">
                  <label className="text-sm text-gray-400">Target value</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={targetValue}
                    onChange={(e) => setTargetValue(Number(e.target.value))}
                    className="w-full mt-2 bg-gray-700 px-3 py-2 rounded-md"
                  />
                  <button
                    onClick={() => generateStepsForAlgorithm(algorithm)}
                    className="w-full mt-3 py-2 bg-green-600 rounded-md"
                  >
                    Regenerate Steps
                  </button>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-sm text-gray-300 mb-2">Legend</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded" />{" "}
                    <span className="text-sm text-gray-400">Normal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded" />{" "}
                    <span className="text-sm text-gray-400">
                      Current / Highlight
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded" />{" "}
                    <span className="text-sm text-gray-400">Compared</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded" />{" "}
                    <span className="text-sm text-gray-400">Sorted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded" />{" "}
                    <span className="text-sm text-gray-400">Pivot</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    setShowControls(false);
                  }}
                  className="w-full py-2 bg-gray-700 rounded-md"
                >
                  Hide Sidebar
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
