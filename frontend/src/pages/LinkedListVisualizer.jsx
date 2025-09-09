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

// Node class for linked list
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

  // Internal refs
  const animationRef = useRef(null);
  const originalListRef = useRef([]);
  const mountedRef = useRef(false);

  const operationInfo = {
    "insert-front": "Insert a new node at the front of the linked list.",
    "insert-end": "Insert a new node at the end of the linked list.",
    "insert-at": "Insert a new node at a specific position in the linked list.",
    "delete-front": "Delete the node at the front of the linked list.",
    "delete-end": "Delete the node at the end of the linked list.",
    "delete-at": "Delete a node at a specific position in the linked list.",
    search: "Search for a value in the linked list.",
    traverse: "Traverse through all nodes of the linked list.",
    none: "Select an operation to visualize how it works on the linked list.",
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
    originalListRef.current = [...list];
    setDisplayList([...list]);
  };

  const generateRandomList = (size = listSize) => {
    const list = Array.from(
      { length: Math.min(5, size) },
      () => Math.floor(Math.random() * 96) + 5
    );
    setOriginalList(list);
    resetVisualizationState();
  };

  const resetVisualizationState = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setSteps([]);
    setDisplayList([...originalListRef.current]);
    setAlgorithmDescription(
      selectedOperation ? operationInfo[selectedOperation] : operationInfo.none
    );
    clearTimeout(animationRef.current);
  };

  // Linked List operation implementations
  const generateStepsForOperation = (operation) => {
    if (!operation) return;
    setAlgorithmDescription(operationInfo[operation] || "");
    
    const listArray = [...originalListRef.current];
    const head = arrayToList(listArray);
    const out = [];

    // Insert at front operation
    if (operation === "insert-front") {
      if (!operationValue) {
        alert("Please enter a value to insert");
        return;
      }
      const value = parseInt(operationValue, 10);

      out.push({
        list: listToArray(head),
        highlighted: [],
        description: `Preparing to insert ${value} at the front of the linked list.`,
      });

      const newHead = new ListNode(value, head);
      out.push({
        list: listToArray(newHead),
        highlighted: [0],
        description: `Inserted ${value} at the front of the linked list.`,
      });
    }

    // Insert at end operation
    else if (operation === "insert-end") {
      if (!operationValue) {
        alert("Please enter a value to insert");
        return;
      }
      const value = parseInt(operationValue, 10);

      out.push({
        list: listToArray(head),
        highlighted: [],
        description: `Preparing to insert ${value} at the end of the linked list.`,
      });

      if (head === null) {
        const newHead = new ListNode(value);
        out.push({
          list: listToArray(newHead),
          highlighted: [0],
          description: `Inserted ${value} at the end of the linked list.`,
        });
      } else {
        let current = head;
        let index = 0;
        
        // Highlight traversal to the end
        while (current !== null) {
          out.push({
            list: listToArray(head),
            highlighted: [index],
            description: `Traversing to the end of the list...`,
          });
          
          if (current.next === null) break;
          current = current.next;
          index++;
        }
        
        current.next = new ListNode(value);
        out.push({
          list: listToArray(head),
          highlighted: [index + 1],
          description: `Inserted ${value} at the end of the linked list.`,
        });
      }
    }

    // Insert at position operation
    else if (operation === "insert-at") {
      if (!operationValue) {
        alert("Please enter a value to insert");
        return;
      }
      if (!operationIndex) {
        alert("Please enter a position to insert at");
        return;
      }
      
      const value = parseInt(operationValue, 10);
      const position = parseInt(operationIndex, 10);
      
      if (position < 0 || position > listArray.length) {
        out.push({
          list: listToArray(head),
          highlighted: [],
          description: `Invalid position! Position must be between 0 and ${listArray.length}.`,
        });
      } else {
        out.push({
          list: listToArray(head),
          highlighted: [],
          description: `Preparing to insert ${value} at position ${position}.`,
        });

        if (position === 0) {
          const newHead = new ListNode(value, head);
          out.push({
            list: listToArray(newHead),
            highlighted: [0],
            description: `Inserted ${value} at position ${position}.`,
          });
        } else {
          let current = head;
          let index = 0;
          
          // Traverse to the position before insertion point
          while (index < position - 1) {
            out.push({
              list: listToArray(head),
              highlighted: [index],
              description: `Traversing to position ${position}...`,
            });
            
            current = current.next;
            index++;
          }
          
          const newNode = new ListNode(value, current.next);
          current.next = newNode;
          
          out.push({
            list: listToArray(head),
            highlighted: [position],
            description: `Inserted ${value} at position ${position}.`,
          });
        }
      }
    }

    // Delete from front operation
    else if (operation === "delete-front") {
      if (head === null) {
        out.push({
          list: listToArray(head),
          highlighted: [],
          description: "Linked list is empty! Cannot delete from front.",
        });
      } else {
        const deletedValue = head.value;
        out.push({
          list: listToArray(head),
          highlighted: [0],
          description: `Preparing to delete ${deletedValue} from the front.`,
        });

        const newHead = head.next;
        out.push({
          list: listToArray(newHead),
          highlighted: [],
          description: `Deleted ${deletedValue} from the front.`,
        });
      }
    }

    // Delete from end operation
    else if (operation === "delete-end") {
      if (head === null) {
        out.push({
          list: listToArray(head),
          highlighted: [],
          description: "Linked list is empty! Cannot delete from end.",
        });
      } else if (head.next === null) {
        // Only one node
        const deletedValue = head.value;
        out.push({
          list: listToArray(head),
          highlighted: [0],
          description: `Preparing to delete ${deletedValue} from the end.`,
        });

        out.push({
          list: [],
          highlighted: [],
          description: `Deleted ${deletedValue} from the end.`,
        });
      } else {
        let current = head;
        let prev = null;
        let index = 0;
        
        // Traverse to the end
        while (current.next !== null) {
          out.push({
            list: listToArray(head),
            highlighted: [index],
            description: `Traversing to the end...`,
          });
          
          prev = current;
          current = current.next;
          index++;
        }
        
        const deletedValue = current.value;
        out.push({
          list: listToArray(head),
          highlighted: [index],
          description: `Preparing to delete ${deletedValue} from the end.`,
        });

        prev.next = null;
        out.push({
          list: listToArray(head),
          highlighted: [],
          description: `Deleted ${deletedValue} from the end.`,
        });
      }
    }

    // Delete at position operation
    else if (operation === "delete-at") {
      if (!operationIndex) {
        alert("Please enter a position to delete from");
        return;
      }
      
      const position = parseInt(operationIndex, 10);
      
      if (head === null) {
        out.push({
          list: listToArray(head),
          highlighted: [],
          description: "Linked list is empty! Cannot delete.",
        });
      } else if (position < 0 || position >= listArray.length) {
        out.push({
          list: listToArray(head),
          highlighted: [],
          description: `Invalid position! Position must be between 0 and ${listArray.length - 1}.`,
        });
      } else {
        out.push({
          list: listToArray(head),
          highlighted: [],
          description: `Preparing to delete node at position ${position}.`,
        });

        if (position === 0) {
          const deletedValue = head.value;
          const newHead = head.next;
          out.push({
            list: listToArray(newHead),
            highlighted: [],
            description: `Deleted ${deletedValue} from position ${position}.`,
          });
        } else {
          let current = head;
          let prev = null;
          let index = 0;
          
          // Traverse to the position
          while (index < position) {
            out.push({
              list: listToArray(head),
              highlighted: [index],
              description: `Traversing to position ${position}...`,
            });
            
            prev = current;
            current = current.next;
            index++;
          }
          
          const deletedValue = current.value;
          out.push({
            list: listToArray(head),
            highlighted: [position],
            description: `Preparing to delete ${deletedValue} from position ${position}.`,
          });

          prev.next = current.next;
          out.push({
            list: listToArray(head),
            highlighted: [],
            description: `Deleted ${deletedValue} from position ${position}.`,
          });
        }
      }
    }

    // Search operation
    else if (operation === "search") {
      if (!operationValue) {
        alert("Please enter a value to search for");
        return;
      }
      const value = parseInt(operationValue, 10);
      
      out.push({
        list: listToArray(head),
        highlighted: [],
        description: `Searching for value ${value} in the linked list.`,
      });

      let current = head;
      let index = 0;
      let found = false;
      
      while (current !== null) {
        out.push({
          list: listToArray(head),
          highlighted: [index],
          description: `Checking position ${index} (value: ${current.value})...`,
        });
        
        if (current.value === value) {
          found = true;
          break;
        }
        
        current = current.next;
        index++;
      }
      
      if (found) {
        out.push({
          list: listToArray(head),
          highlighted: [index],
          description: `Found ${value} at position ${index}.`,
        });
      } else {
        out.push({
          list: listToArray(head),
          highlighted: [],
          description: `Value ${value} not found in the linked list.`,
        });
      }
    }

    // Traverse operation
    else if (operation === "traverse") {
      out.push({
        list: listToArray(head),
        highlighted: [],
        description: "Starting traversal of the linked list.",
      });

      let current = head;
      let index = 0;
      
      while (current !== null) {
        out.push({
          list: listToArray(head),
          highlighted: [index],
          description: `Position ${index}: ${current.value}`,
        });
        
        current = current.next;
        index++;
      }
      
      out.push({
        list: listToArray(head),
        highlighted: [],
        description: `Finished traversal. Linked list has ${index} nodes.`,
      });
    }

    setSteps(out);
    setCurrentStepIndex(0);
    setDisplayList(out.length > 0 ? [...out[0].list] : listArray);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Linked List Visualizer</h1>
          <div className="flex items-center gap-2">
            <select
              value={selectedOperation}
              onChange={(e) => setSelectedOperation(e.target.value)}
              className="bg-gray-700 px-3 py-2 rounded"
            >
              <option value="">Select Operation</option>
              <option value="insert-front">Insert at Front</option>
              <option value="insert-end">Insert at End</option>
              <option value="insert-at">Insert at Position</option>
              <option value="delete-front">Delete from Front</option>
              <option value="delete-end">Delete from End</option>
              <option value="delete-at">Delete at Position</option>
              <option value="search">Search</option>
              <option value="traverse">Traverse</option>
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
                <label className="block mb-2">Initial List Size: {listSize}</label>
                <input
                  type="range"
                  min="3"
                  max="10"
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
                <label className="block mb-2">
                  Value: {operationValue}
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

              {(selectedOperation === "insert-at" || selectedOperation === "delete-at") && (
                <div>
                  <label className="block mb-2">
                    Position: {operationIndex}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={operationIndex}
                    onChange={(e) => setOperationIndex(e.target.value)}
                    className="w-full bg-gray-700 px-3 py-2 rounded"
                    placeholder="Enter position"
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

        {/* Visualization Area */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="flex flex-col items-center mb-6">
            <div className="h-12 w-full bg-gray-700 mb-2 flex items-center justify-center text-sm text-gray-400">
              Head of Linked List
            </div>
            
            <div className="flex flex-wrap justify-center gap-1 mb-2">
              {displayList.length === 0 ? (
                <div className="text-gray-500 text-lg py-10">
                  Linked List is empty
                </div>
              ) : (
                displayList.map((value, index) => {
                  const isHighlighted =
                    currentStepObj?.highlighted?.includes(index);

                  return (
                    <div key={index} className="flex items-center">
                      <div
                        className={`flex flex-col items-center justify-center transition-all duration-300 ${
                          isHighlighted
                            ? "bg-indigo-500"
                            : "bg-gray-600"
                        }`}
                        style={{
                          height: "60px",
                          width: "60px",
                          borderRadius: "50%",
                        }}
                      >
                        <span className="text-lg font-bold">{value}</span>
                      </div>
                      {index < displayList.length - 1 && (
                        <div className="mx-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="h-12 w-full bg-gray-700 mt-2 flex items-center justify-center text-sm text-gray-400">
              {displayList.length > 0 ? "Null" : "End of Linked List"}
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

        {/* Linked List Info */}
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <h2 className="text-xl font-bold mb-2">Linked List Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300">
                Current Size: {displayList.length}
              </p>
              <p className="text-gray-300">
                Head Element:{" "}
                {displayList.length > 0
                  ? displayList[0]
                  : "None"}
              </p>
            </div>
            <div>
              <p className="text-gray-300">
                Tail Element:{" "}
                {displayList.length > 0
                  ? displayList[displayList.length - 1]
                  : "None"}
              </p>
              <p className="text-gray-300">
                Status:{" "}
                {displayList.length === 0
                  ? "Empty"
                  : "Contains nodes"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}