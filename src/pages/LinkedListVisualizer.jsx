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
  Plus,
  Minus,
  List,
  Link,
} from "lucide-react";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ListNode class for linked list
class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

export default function LinkedListVisualizer() {
  const { dsId } = useParams();

  // UI/control states
  const [listSize, setListSize] = useState(5);
  const [speed, setSpeed] = useState(600);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [operationValue, setOperationValue] = useState("");
  const [operationIndex, setOperationIndex] = useState("");
  const [showControls, setShowControls] = useState(true);
  const [algorithmDescription, setAlgorithmDescription] = useState("");
  const [selectedOperation, setSelectedOperation] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState("operations");

  // Internal refs
  const animationRef = useRef(null);
  const originalListRef = useRef(null);
  const mountedRef = useRef(false);

  const operationInfo = {
    insert: {
      name: "Insert",
      description: "Insert a new node into the linked list.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      category: "operations",
      icon: <Plus size={18} className="text-green-400" />,
    },
    "insert-head": {
      name: "Insert at Head",
      description: "Insert a new node at the beginning of the linked list.",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      category: "operations",
      icon: <Plus size={18} className="text-blue-400" />,
    },
    "insert-tail": {
      name: "Insert at Tail",
      description: "Insert a new node at the end of the linked list.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      category: "operations",
      icon: <Plus size={18} className="text-purple-400" />,
    },
    search: {
      name: "Search",
      description: "Search for a value in the linked list.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      category: "operations",
      icon: <Search size={18} className="text-yellow-400" />,
    },
    delete: {
      name: "Delete",
      description: "Delete a node from the linked list.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      category: "operations",
      icon: <Minus size={18} className="text-red-400" />,
    },
    "delete-head": {
      name: "Delete Head",
      description: "Delete the first node from the linked list.",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      category: "operations",
      icon: <Minus size={18} className="text-pink-400" />,
    },
    "delete-tail": {
      name: "Delete Tail",
      description: "Delete the last node from the linked list.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      category: "operations",
      icon: <Minus size={18} className="text-indigo-400" />,
    },
    reverse: {
      name: "Reverse",
      description: "Reverse the entire linked list.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      category: "operations",
      icon: <ArrowDownUp size={18} className="text-orange-400" />,
    },
    none: {
      name: "Select Operation",
      description:
        "Select an operation to visualize how it works on the linked list.",
      timeComplexity: "",
      spaceComplexity: "",
      category: "",
      icon: null,
    },
  };

  // Convert linked list to array for visualization
  const listToArray = (head) => {
    const result = [];
    let current = head;
    while (current !== null) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  };

  // Convert array to linked list
  const arrayToList = (arr) => {
    if (arr.length === 0) return null;

    let head = new ListNode(arr[0]);
    let current = head;

    for (let i = 1; i < arr.length; i++) {
      current.next = new ListNode(arr[i]);
      current = current.next;
    }

    return head;
  };

  const setOriginalList = (list) => {
    originalListRef.current = list;
    setDisplayList(listToArray(list));
  };

  const generateRandomList = (size = listSize) => {
    const values = new Set();
    while (values.size < size) {
      values.add(Math.floor(Math.random() * 90) + 10);
    }

    const list = arrayToList(Array.from(values));
    setOriginalList(list);
    resetVisualizationState();
  };

  const resetVisualizationState = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setSteps([]);
    setDisplayList(listToArray(originalListRef.current));
    setAlgorithmDescription(
      selectedOperation
        ? operationInfo[selectedOperation].description
        : operationInfo.none.description
    );
    clearTimeout(animationRef.current);
  };

  // Linked list operation implementations
  const generateStepsForOperation = (operation) => {
    if (!operation) return;
    setAlgorithmDescription(operationInfo[operation].description || "");

    const list = originalListRef.current;
    const out = [];

    // Insert at head operation
    if (operation === "insert-head") {
      if (!operationValue) {
        alert("Please enter a value to insert");
        return;
      }
      const value = parseInt(operationValue, 10);

      out.push({
        list: listToArray(list),
        highlighted: [],
        description: `Preparing to insert ${value} at the head of the linked list.`,
      });

      // Clone the list for insertion
      const cloneList = (node) => {
        if (!node) return null;
        return new ListNode(node.value, cloneList(node.next));
      };

      const newList = cloneList(list);
      const newNode = new ListNode(value, newList);

      out.push({
        list: listToArray(newList),
        highlighted: [],
        description: `Created new node with value ${value}.`,
      });

      out.push({
        list: listToArray(newNode),
        highlighted: [0],
        description: `Inserted ${value} at the head of the list.`,
      });

      // Update the original list reference
      originalListRef.current = newNode;
    }

    // Insert at tail operation
    else if (operation === "insert-tail") {
      if (!operationValue) {
        alert("Please enter a value to insert");
        return;
      }
      const value = parseInt(operationValue, 10);

      out.push({
        list: listToArray(list),
        highlighted: [],
        description: `Preparing to insert ${value} at the tail of the linked list.`,
      });

      // Clone the list for insertion
      const cloneList = (node) => {
        if (!node) return null;
        return new ListNode(node.value, cloneList(node.next));
      };

      const newList = cloneList(list);

      if (!newList) {
        // Empty list case
        const newNode = new ListNode(value);
        out.push({
          list: listToArray(newNode),
          highlighted: [0],
          description: `List was empty, inserted ${value} as the first node.`,
        });
        originalListRef.current = newNode;
        return;
      }

      let current = newList;
      let index = 0;

      out.push({
        list: listToArray(newList),
        highlighted: [index],
        description: `Starting at head, moving to tail.`,
      });

      while (current.next !== null) {
        current = current.next;
        index++;

        out.push({
          list: listToArray(newList),
          highlighted: [index],
          description: `Moving to next node, position ${index}.`,
        });
      }

      current.next = new ListNode(value);

      out.push({
        list: listToArray(newList),
        highlighted: [index + 1],
        description: `Inserted ${value} at the tail of the list.`,
      });

      // Update the original list reference
      originalListRef.current = newList;
    }

    // Insert at index operation
    else if (operation === "insert") {
      if (!operationValue) {
        alert("Please enter a value to insert");
        return;
      }
      if (!operationIndex && operationIndex !== 0) {
        alert("Please enter an index to insert at");
        return;
      }

      const value = parseInt(operationValue, 10);
      const index = parseInt(operationIndex, 10);

      out.push({
        list: listToArray(list),
        highlighted: [],
        description: `Preparing to insert ${value} at index ${index} of the linked list.`,
      });

      if (index < 0) {
        out.push({
          list: listToArray(list),
          highlighted: [],
          description: `Invalid index: ${index}. Index must be non-negative.`,
        });
        return;
      }

      // Clone the list for insertion
      const cloneList = (node) => {
        if (!node) return null;
        return new ListNode(node.value, cloneList(node.next));
      };

      const newList = cloneList(list);

      if (index === 0) {
        // Insert at head
        const newNode = new ListNode(value, newList);
        out.push({
          list: listToArray(newNode),
          highlighted: [0],
          description: `Inserted ${value} at index 0 (head).`,
        });
        originalListRef.current = newNode;
        return;
      }

      let current = newList;
      let pos = 0;

      out.push({
        list: listToArray(newList),
        highlighted: [pos],
        description: `Starting at head, moving to position ${index}.`,
      });

      while (pos < index - 1 && current.next !== null) {
        current = current.next;
        pos++;

        out.push({
          list: listToArray(newList),
          highlighted: [pos],
          description: `Moving to next node, position ${pos}.`,
        });
      }

      if (pos !== index - 1) {
        out.push({
          list: listToArray(newList),
          highlighted: [pos],
          description: `Index ${index} is out of bounds. List only has ${
            pos + 1
          } elements.`,
        });
        return;
      }

      const newNode = new ListNode(value, current.next);
      current.next = newNode;

      out.push({
        list: listToArray(newList),
        highlighted: [index],
        description: `Inserted ${value} at index ${index}.`,
      });

      // Update the original list reference
      originalListRef.current = newList;
    }

    // Search operation
    else if (operation === "search") {
      if (!operationValue) {
        alert("Please enter a value to search for");
        return;
      }
      const value = parseInt(operationValue, 10);

      out.push({
        list: listToArray(list),
        highlighted: [],
        description: `Searching for value ${value} in the linked list.`,
      });

      let current = list;
      let index = 0;
      let found = false;

      while (current !== null) {
        out.push({
          list: listToArray(list),
          highlighted: [index],
          description: `Checking node at index ${index} (value: ${current.value}).`,
        });

        if (current.value === value) {
          out.push({
            list: listToArray(list),
            highlighted: [index],
            description: `Found ${value} at index ${index}!`,
          });
          found = true;
          break;
        }

        current = current.next;
        index++;
      }

      if (!found) {
        out.push({
          list: listToArray(list),
          highlighted: [],
          description: `${value} not found in the list.`,
        });
      }
    }

    // Delete head operation
    else if (operation === "delete-head") {
      if (!list) {
        out.push({
          list: [],
          highlighted: [],
          description: `List is empty, nothing to delete.`,
        });
        return;
      }

      out.push({
        list: listToArray(list),
        highlighted: [0],
        description: `Preparing to delete the head node (value: ${list.value}).`,
      });

      const newList = list.next;

      out.push({
        list: listToArray(newList),
        highlighted: [],
        description: `Deleted head node. New head is ${
          newList ? newList.value : "null"
        }.`,
      });

      // Update the original list reference
      originalListRef.current = newList;
    }

    // Delete tail operation
    else if (operation === "delete-tail") {
      if (!list) {
        out.push({
          list: [],
          highlighted: [],
          description: `List is empty, nothing to delete.`,
        });
        return;
      }

      out.push({
        list: listToArray(list),
        highlighted: [],
        description: `Preparing to delete the tail node.`,
      });

      // Clone the list for deletion
      const cloneList = (node) => {
        if (!node) return null;
        return new ListNode(node.value, cloneList(node.next));
      };

      const newList = cloneList(list);

      if (!newList.next) {
        // Only one node
        out.push({
          list: [],
          highlighted: [],
          description: `Deleted the only node in the list. List is now empty.`,
        });
        originalListRef.current = null;
        return;
      }

      let current = newList;
      let index = 0;

      out.push({
        list: listToArray(newList),
        highlighted: [index],
        description: `Starting at head, moving to second last node.`,
      });

      while (current.next.next !== null) {
        current = current.next;
        index++;

        out.push({
          list: listToArray(newList),
          highlighted: [index],
          description: `Moving to next node, position ${index}.`,
        });
      }

      const deletedValue = current.next.value;
      current.next = null;

      out.push({
        list: listToArray(newList),
        highlighted: [index],
        description: `Deleted tail node with value ${deletedValue}.`,
      });

      // Update the original list reference
      originalListRef.current = newList;
    }

    // Delete at index operation
    else if (operation === "delete") {
      if (!operationIndex && operationIndex !== 0) {
        alert("Please enter an index to delete");
        return;
      }

      const index = parseInt(operationIndex, 10);

      if (!list) {
        out.push({
          list: [],
          highlighted: [],
          description: `List is empty, nothing to delete.`,
        });
        return;
      }

      out.push({
        list: listToArray(list),
        highlighted: [],
        description: `Preparing to delete node at index ${index}.`,
      });

      if (index < 0) {
        out.push({
          list: listToArray(list),
          highlighted: [],
          description: `Invalid index: ${index}. Index must be non-negative.`,
        });
        return;
      }

      // Clone the list for deletion
      const cloneList = (node) => {
        if (!node) return null;
        return new ListNode(node.value, cloneList(node.next));
      };

      const newList = cloneList(list);

      if (index === 0) {
        // Delete head
        const deletedValue = newList.value;
        const updatedList = newList.next;

        out.push({
          list: listToArray(updatedList),
          highlighted: [],
          description: `Deleted head node with value ${deletedValue}.`,
        });
        originalListRef.current = updatedList;
        return;
      }

      let current = newList;
      let pos = 0;

      out.push({
        list: listToArray(newList),
        highlighted: [pos],
        description: `Starting at head, moving to position ${index - 1}.`,
      });

      while (pos < index - 1 && current.next !== null) {
        current = current.next;
        pos++;

        out.push({
          list: listToArray(newList),
          highlighted: [pos],
          description: `Moving to next node, position ${pos}.`,
        });
      }

      if (current.next === null) {
        out.push({
          list: listToArray(newList),
          highlighted: [pos],
          description: `Index ${index} is out of bounds. List only has ${
            pos + 1
          } elements.`,
        });
        return;
      }

      const deletedValue = current.next.value;
      current.next = current.next.next;

      out.push({
        list: listToArray(newList),
        highlighted: [index],
        description: `Deleted node at index ${index} with value ${deletedValue}.`,
      });

      // Update the original list reference
      originalListRef.current = newList;
    }

    // Reverse operation
    else if (operation === "reverse") {
      if (!list) {
        out.push({
          list: [],
          highlighted: [],
          description: `List is empty, nothing to reverse.`,
        });
        return;
      }

      out.push({
        list: listToArray(list),
        highlighted: [],
        description: `Preparing to reverse the linked list.`,
      });

      // Clone the list for reversal
      const cloneList = (node) => {
        if (!node) return null;
        return new ListNode(node.value, cloneList(node.next));
      };

      const newList = cloneList(list);

      let prev = null;
      let current = newList;
      let next = null;
      let index = 0;

      out.push({
        list: listToArray(newList),
        highlighted: [index],
        description: `Starting reversal process. Current node: ${current.value}.`,
      });

      while (current !== null) {
        next = current.next;
        current.next = prev;
        prev = current;
        current = next;

        if (current) {
          index++;
          out.push({
            list:
              listToArray(prev) +
              (current ? "," + listToArray(current).join(",") : ""),
            highlighted: [index],
            description: `Reversed link. Moving to next node: ${current.value}.`,
          });
        }
      }

      out.push({
        list: listToArray(prev),
        highlighted: [],
        description: `List has been completely reversed.`,
      });

      // Update the original list reference
      originalListRef.current = prev;
    }

    setSteps(out);
    setCurrentStepIndex(0);
    setDisplayList(out.length > 0 ? [...out[0].list] : listToArray(list));
    setTimeout(() => setIsPlaying(true), 50);
  };

  useEffect(() => {
    if (!mountedRef.current) {
      generateRandomList(listSize);
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
      setDisplayList([...steps[currentStepIndex].list]);
    }
  }, [currentStepIndex, steps]);

  const currentStepObj = steps[currentStepIndex] || null;

  if (dsId !== "linked-list") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl">
        Visualization for {dsId} is coming soon!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 w-64 flex-shrink-0 transition-all duration-300 ${
          sidebarOpen ? "ml-0" : "-ml-64"
        } lg:ml-0`}
      >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold">Operations</h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1 rounded hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-sm uppercase text-gray-400 font-semibold mb-2">
              Categories
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory("operations")}
                className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center space-x-2 ${
                  activeCategory === "operations"
                    ? "bg-indigo-600"
                    : "hover:bg-gray-700"
                }`}
              >
                <List size={16} />
                <span>List Operations</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase text-gray-400 font-semibold mb-2">
              List Operations
            </h3>
            <div className="space-y-2">
              {Object.entries(operationInfo)
                .filter(
                  ([key, info]) =>
                    info.category === activeCategory && key !== "none"
                )
                .map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedOperation(key)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center space-x-2 ${
                      selectedOperation === key
                        ? "bg-indigo-600"
                        : "hover:bg-gray-700"
                    }`}
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
              <h1 className="text-3xl font-bold">Linked List Visualizer</h1>
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
                  <label className="block mb-2">List Size: {listSize}</label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={listSize}
                    onChange={(e) => {
                      const newSize = parseInt(e.target.value);
                      setListSize(newSize);
                      generateRandomList(newSize);
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
                  <label className="block mb-2">Value</label>
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

                {(selectedOperation === "insert" ||
                  selectedOperation === "delete") && (
                  <div>
                    <label className="block mb-2">Index</label>
                    <input
                      type="number"
                      min="0"
                      max="14"
                      value={operationIndex}
                      onChange={(e) => setOperationIndex(e.target.value)}
                      className="w-full bg-gray-700 px-3 py-2 rounded"
                      placeholder="Enter index"
                    />
                  </div>
                )}

                <div className="md:col-span-3 flex justify-center gap-2">
                  <button
                    onClick={() => generateRandomList()}
                    className="bg-gray-700 px-4 py-2 rounded"
                  >
                    Reset List
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Selected Operation Info */}
          {selectedOperation && (
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {operationInfo[selectedOperation].name}
                  </h2>
                  <p className="text-gray-300">
                    {operationInfo[selectedOperation].description}
                  </p>
                </div>
                <button
                  onClick={() => generateStepsForOperation(selectedOperation)}
                  className="bg-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Visualize Operation
                </button>
              </div>
              <div className="flex space-x-6 mt-3 text-sm">
                <div>
                  <span className="text-gray-400">Time Complexity: </span>
                  <span className="font-mono">
                    {operationInfo[selectedOperation].timeComplexity}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Space Complexity: </span>
                  <span className="font-mono">
                    {operationInfo[selectedOperation].spaceComplexity}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Visualization Area */}
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <div className="flex flex-col items-center mb-6">
              <div className="h-12 w-full bg-gray-700 mb-2 flex items-center justify-center text-sm text-gray-400">
                Head of Linked List
              </div>

              <div className="flex flex-wrap items-center justify-center mb-2">
                {displayList.length === 0 ? (
                  <div className="text-gray-500 text-lg py-10">
                    List is empty
                  </div>
                ) : (
                  displayList.map((value, index) => {
                    const isHighlighted =
                      currentStepObj?.highlighted?.includes(index);

                    return (
                      <div key={index} className="flex items-center">
                        <div
                          className={`flex flex-col items-center justify-center mx-2 transition-all duration-300 ${
                            isHighlighted ? "bg-indigo-500" : "bg-gray-600"
                          }`}
                          style={{
                            height: "70px",
                            width: "70px",
                            borderRadius: "10px",
                          }}
                        >
                          <span className="text-lg font-bold">{value}</span>
                          <div className="text-xs text-gray-300 mt-1">
                            Node {index}
                          </div>
                        </div>

                        {index < displayList.length - 1 && (
                          <div className="flex items-center">
                            <div className="h-1 w-6 bg-gray-500"></div>
                            <Link size={16} className="text-gray-400 mx-1" />
                            <div className="h-1 w-6 bg-gray-500"></div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
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

          {/* List Info */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">List Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-300">
                  Number of Nodes: {displayList.length}
                </p>
                <p className="text-gray-300">
                  Head Value: {displayList.length > 0 ? displayList[0] : "None"}
                </p>
              </div>
              <div>
                <p className="text-gray-300">
                  Tail Value:{" "}
                  {displayList.length > 0
                    ? displayList[displayList.length - 1]
                    : "None"}
                </p>
                <p className="text-gray-300">Type: Singly Linked List</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
