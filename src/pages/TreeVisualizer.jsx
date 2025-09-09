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

// TreeNode class for binary search tree
class TreeNode {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

export default function TreeVisualizer() {
  const { dsId } = useParams();

  // UI/control states
  const [treeSize, setTreeSize] = useState(5);
  const [speed, setSpeed] = useState(600);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [displayTree, setDisplayTree] = useState([]);
  const [operationValue, setOperationValue] = useState("");
  const [showControls, setShowControls] = useState(true);
  const [algorithmDescription, setAlgorithmDescription] = useState("");
  const [selectedOperation, setSelectedOperation] = useState("");
  const [traversalResult, setTraversalResult] = useState("");

  // Internal refs
  const animationRef = useRef(null);
  const originalTreeRef = useRef(null);
  const mountedRef = useRef(false);

  const operationInfo = {
    insert: "Insert a new node into the binary search tree.",
    search: "Search for a value in the binary search tree.",
    delete: "Delete a node from the binary search tree.",
    "in-order": "In-order traversal: left, root, right.",
    "pre-order": "Pre-order traversal: root, left, right.",
    "post-order": "Post-order traversal: left, right, root.",
    "level-order": "Level-order traversal: breadth-first level by level.",
    none: "Select an operation to visualize how it works on the binary search tree.",
  };

  // Convert tree to array for visualization (level-order)
  const treeToArray = (root) => {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
      const node = queue.shift();
      if (node) {
        result.push(node.value);
        queue.push(node.left || null);
        queue.push(node.right || null);
      } else {
        result.push(null);
      }
    }
    
    // Remove trailing nulls
    while (result.length > 0 && result[result.length - 1] === null) {
      result.pop();
    }
    
    return result;
  };

  // Convert array to tree (level-order)
  const arrayToTree = (arr) => {
    if (arr.length === 0) return null;
    
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    
    while (i < arr.length) {
      const current = queue.shift();
      
      if (arr[i] !== null && arr[i] !== undefined) {
        current.left = new TreeNode(arr[i]);
        queue.push(current.left);
      }
      i++;
      
      if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
        current.right = new TreeNode(arr[i]);
        queue.push(current.right);
      }
      i++;
    }
    
    return root;
  };

  // Generate a balanced BST from sorted array
  const sortedArrayToBST = (arr, start = 0, end = arr.length - 1) => {
    if (start > end) return null;
    
    const mid = Math.floor((start + end) / 2);
    const root = new TreeNode(arr[mid]);
    
    root.left = sortedArrayToBST(arr, start, mid - 1);
    root.right = sortedArrayToBST(arr, mid + 1, end);
    
    return root;
  };

  const setOriginalTree = (tree) => {
    originalTreeRef.current = tree;
    setDisplayTree(treeToArray(tree));
  };

  const generateRandomTree = (size = treeSize) => {
    // Generate sorted array of unique values
    const values = new Set();
    while (values.size < size) {
      values.add(Math.floor(Math.random() * 90) + 10);
    }
    const sortedValues = Array.from(values).sort((a, b) => a - b);
    
    // Create balanced BST
    const tree = sortedArrayToBST(sortedValues);
    setOriginalTree(tree);
    resetVisualizationState();
  };

  const resetVisualizationState = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setSteps([]);
    setDisplayTree(treeToArray(originalTreeRef.current));
    setAlgorithmDescription(
      selectedOperation ? operationInfo[selectedOperation] : operationInfo.none
    );
    setTraversalResult("");
    clearTimeout(animationRef.current);
  };

  // Tree operation implementations
  const generateStepsForOperation = (operation) => {
    if (!operation) return;
    setAlgorithmDescription(operationInfo[operation] || "");
    
    const tree = originalTreeRef.current;
    const out = [];
    let traversalValues = [];

    // Insert operation
    if (operation === "insert") {
      if (!operationValue) {
        alert("Please enter a value to insert");
        return;
      }
      const value = parseInt(operationValue, 10);

      out.push({
        tree: treeToArray(tree),
        highlighted: [],
        description: `Preparing to insert ${value} into the binary search tree.`,
      });

      const insertRecursive = (node, val, path = []) => {
        if (!node) {
          out.push({
            tree: treeToArray(tree),
            highlighted: [...path],
            description: `Found insertion point for ${val}.`,
          });
          return new TreeNode(val);
        }

        out.push({
          tree: treeToArray(tree),
          highlighted: [...path, node.value],
          description: `Comparing ${val} with ${node.value}.`,
        });

        if (val < node.value) {
          out.push({
            tree: treeToArray(tree),
            highlighted: [...path, node.value],
            description: `${val} < ${node.value}, moving to left subtree.`,
          });
          node.left = insertRecursive(node.left, val, [...path, node.value]);
        } else if (val > node.value) {
          out.push({
            tree: treeToArray(tree),
            highlighted: [...path, node.value],
            description: `${val} > ${node.value}, moving to right subtree.`,
          });
          node.right = insertRecursive(node.right, val, [...path, node.value]);
        } else {
          out.push({
            tree: treeToArray(tree),
            highlighted: [...path, node.value],
            description: `${val} already exists in the tree.`,
          });
        }

        return node;
      };

      // Clone the tree for insertion
      const cloneTree = (node) => {
        if (!node) return null;
        const newNode = new TreeNode(node.value);
        newNode.left = cloneTree(node.left);
        newNode.right = cloneTree(node.right);
        return newNode;
      };

      const newTree = cloneTree(tree);
      insertRecursive(newTree, value, []);
      
      // Final state after insertion
      out.push({
        tree: treeToArray(newTree),
        highlighted: [value],
        description: `Inserted ${value} into the tree.`,
      });
      
      // Update the original tree reference
      originalTreeRef.current = newTree;
    }

    // Search operation
    else if (operation === "search") {
      if (!operationValue) {
        alert("Please enter a value to search for");
        return;
      }
      const value = parseInt(operationValue, 10);

      out.push({
        tree: treeToArray(tree),
        highlighted: [],
        description: `Searching for value ${value} in the binary search tree.`,
      });

      const searchRecursive = (node, val, path = []) => {
        if (!node) {
          out.push({
            tree: treeToArray(tree),
            highlighted: [...path],
            description: `Value ${val} not found in the tree.`,
          });
          return false;
        }

        out.push({
          tree: treeToArray(tree),
          highlighted: [...path, node.value],
          description: `Comparing ${val} with ${node.value}.`,
        });

        if (val === node.value) {
          out.push({
            tree: treeToArray(tree),
            highlighted: [...path, node.value],
            description: `Found ${val} in the tree!`,
          });
          return true;
        } else if (val < node.value) {
          out.push({
            tree: treeToArray(tree),
            highlighted: [...path, node.value],
            description: `${val} < ${node.value}, moving to left subtree.`,
          });
          return searchRecursive(node.left, val, [...path, node.value]);
        } else {
          out.push({
            tree: treeToArray(tree),
            highlighted: [...path, node.value],
            description: `${val} > ${node.value}, moving to right subtree.`,
          });
          return searchRecursive(node.right, val, [...path, node.value]);
        }
      };

      searchRecursive(tree, value, []);
    }

    // Delete operation
    else if (operation === "delete") {
      if (!operationValue) {
        alert("Please enter a value to delete");
        return;
      }
      const value = parseInt(operationValue, 10);

      out.push({
        tree: treeToArray(tree),
        highlighted: [],
        description: `Preparing to delete ${value} from the binary search tree.`,
      });

      // Clone the tree for deletion
      const cloneTree = (node) => {
        if (!node) return null;
        const newNode = new TreeNode(node.value);
        newNode.left = cloneTree(node.left);
        newNode.right = cloneTree(node.right);
        return newNode;
      };

      const newTree = cloneTree(tree);
      
      const deleteRecursive = (node, val, path = []) => {
        if (!node) {
          out.push({
            tree: treeToArray(newTree),
            highlighted: [...path],
            description: `Value ${val} not found in the tree.`,
          });
          return null;
        }

        out.push({
          tree: treeToArray(newTree),
          highlighted: [...path, node.value],
          description: `Comparing ${val} with ${node.value}.`,
        });

        if (val < node.value) {
          out.push({
            tree: treeToArray(newTree),
            highlighted: [...path, node.value],
            description: `${val} < ${node.value}, moving to left subtree.`,
          });
          node.left = deleteRecursive(node.left, val, [...path, node.value]);
        } else if (val > node.value) {
          out.push({
            tree: treeToArray(newTree),
            highlighted: [...path, node.value],
            description: `${val} > ${node.value}, moving to right subtree.`,
          });
          node.right = deleteRecursive(node.right, val, [...path, node.value]);
        } else {
          // Node to delete found
          out.push({
            tree: treeToArray(newTree),
            highlighted: [...path, node.value],
            description: `Found node ${val} to delete.`,
          });

          // Case 1: No child
          if (!node.left && !node.right) {
            out.push({
              tree: treeToArray(newTree),
              highlighted: [...path, node.value],
              description: `Node ${val} has no children, simply removing it.`,
            });
            return null;
          }
          
          // Case 2: One child
          if (!node.left) {
            out.push({
              tree: treeToArray(newTree),
              highlighted: [...path, node.value],
              description: `Node ${val} has only right child, replacing with right child.`,
            });
            return node.right;
          }
          if (!node.right) {
            out.push({
              tree: treeToArray(newTree),
              highlighted: [...path, node.value],
              description: `Node ${val} has only left child, replacing with left child.`,
            });
            return node.left;
          }
          
          // Case 3: Two children
          out.push({
            tree: treeToArray(newTree),
            highlighted: [...path, node.value],
            description: `Node ${val} has two children, finding inorder successor.`,
          });
          
          // Find inorder successor (min value in right subtree)
          let successor = node.right;
          let successorPath = [...path, node.value];
          while (successor.left) {
            successorPath.push(successor.value);
            successor = successor.left;
          }
          
          out.push({
            tree: treeToArray(newTree),
            highlighted: [...successorPath, successor.value],
            description: `Inorder successor is ${successor.value}, replacing ${val} with it.`,
          });
          
          // Copy the successor value and delete the successor
          node.value = successor.value;
          node.right = deleteRecursive(node.right, successor.value, [...path, node.value]);
        }
        
        return node;
      };

      deleteRecursive(newTree, value, []);
      
      // Final state after deletion
      out.push({
        tree: treeToArray(newTree),
        highlighted: [],
        description: `Deleted ${value} from the tree.`,
      });
      
      // Update the original tree reference
      originalTreeRef.current = newTree;
    }

    // Traversal operations
    else if (operation.includes("order")) {
      out.push({
        tree: treeToArray(tree),
        highlighted: [],
        description: `Starting ${operation.replace("-", " ")} traversal.`,
      });

      const values = [];
      
      if (operation === "in-order") {
        const inOrder = (node, path = []) => {
          if (!node) return;
          
          // Traverse left subtree
          if (node.left) {
            out.push({
              tree: treeToArray(tree),
              highlighted: [...path, node.value],
              description: `Moving to left child of ${node.value}.`,
            });
            inOrder(node.left, [...path, node.value]);
          }
          
          // Visit node
          values.push(node.value);
          out.push({
            tree: treeToArray(tree),
            highlighted: [...path, node.value],
            description: `Visiting node ${node.value}. In-order result: ${values.join(", ")}`,
          });
          
          // Traverse right subtree
          if (node.right) {
            out.push({
              tree: treeToArray(tree),
              highlighted: [...path, node.value],
              description: `Moving to right child of ${node.value}.`,
            });
            inOrder(node.right, [...path, node.value]);
          }
        };
        
        inOrder(tree, []);
      }
      else if (operation === "pre-order") {
        const preOrder = (node, path = []) => {
          if (!node) return;
          
          // Visit node
          values.push(node.value);
          out.push({
            tree: treeToArray(tree),
            highlighted: [...path, node.value],
            description: `Visiting node ${node.value}. Pre-order result: ${values.join(", ")}`,
          });
          
          // Traverse left subtree
          if (node.left) {
            out.push({
              tree: treeToArray(tree),
              highlighted: [...path, node.value],
              description: `Moving to left child of ${node.value}.`,
            });
            preOrder(node.left, [...path, node.value]);
          }
          
          // Traverse right subtree
          if (node.right) {
            out.push({
              tree: treeToArray(tree),
              highlighted: [...path, node.value],
              description: `Moving to right child of ${node.value}.`,
            });
            preOrder(node.right, [...path, node.value]);
          }
        };
        
        preOrder(tree, []);
      }
      else if (operation === "post-order") {
        const postOrder = (node, path = []) => {
          if (!node) return;
          
          // Traverse left subtree
          if (node.left) {
            out.push({
              tree: treeToArray(tree),
              highlighted: [...path, node.value],
              description: `Moving to left child of ${node.value}.`,
            });
            postOrder(node.left, [...path, node.value]);
          }
          
          // Traverse right subtree
          if (node.right) {
            out.push({
              tree: treeToArray(tree),
              highlighted: [...path, node.value],
              description: `Moving to right child of ${node.value}.`,
            });
            postOrder(node.right, [...path, node.value]);
          }
          
          // Visit node
          values.push(node.value);
          out.push({
            tree: treeToArray(tree),
            highlighted: [...path, node.value],
            description: `Visiting node ${node.value}. Post-order result: ${values.join(", ")}`,
          });
        };
        
        postOrder(tree, []);
      }
      else if (operation === "level-order") {
        const queue = tree ? [{node: tree, level: 0, path: []}] : [];
        
        while (queue.length > 0) {
          const {node, level, path} = queue.shift();
          
          values.push(node.value);
          out.push({
            tree: treeToArray(tree),
            highlighted: [...path, node.value],
            description: `Visiting node ${node.value} at level ${level}. Level-order result: ${values.join(", ")}`,
          });
          
          if (node.left) {
            queue.push({
              node: node.left, 
              level: level + 1, 
              path: [...path, node.value]
            });
          }
          if (node.right) {
            queue.push({
              node: node.right, 
              level: level + 1, 
              path: [...path, node.value]
            });
          }
        }
      }
      
      setTraversalResult(values.join(", "));
    }

    setSteps(out);
    setCurrentStepIndex(0);
    setDisplayTree(out.length > 0 ? [...out[0].tree] : treeToArray(tree));
    setTimeout(() => setIsPlaying(true), 50);
  };

  useEffect(() => {
    if (!mountedRef.current) {
      generateRandomTree(treeSize);
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
      setDisplayTree([...steps[currentStepIndex].tree]);
    }
  }, [currentStepIndex, steps]);

  const currentStepObj = steps[currentStepIndex] || null;

  // Calculate tree levels for visualization
  const calculateTreeLevels = (treeArray) => {
    if (treeArray.length === 0) return [];
    
    const levels = [];
    let level = 0;
    let levelStart = 0;
    let levelEnd = 0;
    
    while (levelStart < treeArray.length) {
      const levelNodes = [];
      const levelCount = Math.pow(2, level);
      levelEnd = Math.min(levelStart + levelCount, treeArray.length);
      
      for (let i = levelStart; i < levelEnd; i++) {
        levelNodes.push(treeArray[i]);
      }
      
      levels.push(levelNodes);
      levelStart = levelEnd;
      level++;
    }
    
    return levels;
  };

  const treeLevels = calculateTreeLevels(displayTree);

  if (dsId !== "tree") {
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
          <h1 className="text-3xl font-bold">Binary Search Tree Visualizer</h1>
          <div className="flex items-center gap-2">
            <select
              value={selectedOperation}
              onChange={(e) => setSelectedOperation(e.target.value)}
              className="bg-gray-700 px-3 py-2 rounded"
            >
              <option value="">Select Operation</option>
              <option value="insert">Insert</option>
              <option value="search">Search</option>
              <option value="delete">Delete</option>
              <option value="in-order">In-order Traversal</option>
              <option value="pre-order">Pre-order Traversal</option>
              <option value="post-order">Post-order Traversal</option>
              <option value="level-order">Level-order Traversal</option>
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
                <label className="block mb-2">Initial Tree Size: {treeSize}</label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={treeSize}
                  onChange={(e) => {
                    const newSize = parseInt(e.target.value);
                    setTreeSize(newSize);
                    generateRandomTree(newSize);
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

              <div className="md:col-span-3 flex justify-center gap-2">
                <button
                  onClick={() => generateRandomTree()}
                  className="bg-gray-700 px-4 py-2 rounded"
                >
                  Reset Tree
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Visualization Area */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="flex flex-col items-center mb-6">
            <div className="h-12 w-full bg-gray-700 mb-2 flex items-center justify-center text-sm text-gray-400">
              Root of Binary Search Tree
            </div>
            
            <div className="flex flex-col items-center justify-center mb-2">
              {treeLevels.length === 0 ? (
                <div className="text-gray-500 text-lg py-10">
                  Tree is empty
                </div>
              ) : (
                treeLevels.map((level, levelIndex) => (
                  <div key={levelIndex} className="flex justify-center items-center my-2">
                    {level.map((value, nodeIndex) => {
                      const isHighlighted = currentStepObj?.highlighted?.includes(value);
                      
                      return value !== null ? (
                        <div
                          key={`${levelIndex}-${nodeIndex}`}
                          className={`flex items-center justify-center mx-2 transition-all duration-300 ${
                            isHighlighted
                              ? "bg-indigo-500"
                              : "bg-gray-600"
                          }`}
                          style={{
                            height: "50px",
                            width: "50px",
                            borderRadius: "50%",
                          }}
                        >
                          <span className="text-lg font-bold">{value}</span>
                        </div>
                      ) : (
                        <div
                          key={`${levelIndex}-${nodeIndex}`}
                          className="flex items-center justify-center mx-2 opacity-0"
                          style={{
                            height: "50px",
                            width: "50px",
                          }}
                        >
                          <span className="text-lg font-bold">-</span>
                        </div>
                      );
                    })}
                  </div>
                ))
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
            {traversalResult && (
              <p className="mt-2 text-green-300">
                Traversal Result: {traversalResult}
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

        {/* Tree Info */}
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <h2 className="text-xl font-bold mb-2">Tree Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300">
                Number of Nodes: {displayTree.filter(val => val !== null).length}
              </p>
              <p className="text-gray-300">
                Height: {treeLevels.length}
              </p>
            </div>
            <div>
              <p className="text-gray-300">
                Root Value:{" "}
                {displayTree.length > 0
                  ? displayTree[0] || "None"
                  : "None"}
              </p>
              <p className="text-gray-300">
                Type: Binary Search Tree
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}