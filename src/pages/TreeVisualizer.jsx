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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState("operations");

  // Internal refs
  const animationRef = useRef(null);
  const originalTreeRef = useRef(null);
  const mountedRef = useRef(false);

  const operationInfo = {
    insert: {
      name: "Insert",
      description: "Insert a new node into the binary search tree.",
      timeComplexity: "O(h)",
      spaceComplexity: "O(1)",
      category: "operations",
      icon: <Plus size={18} className="text-green-400" />
    },
    search: {
      name: "Search",
      description: "Search for a value in the binary search tree.",
      timeComplexity: "O(h)",
      spaceComplexity: "O(1)",
      category: "operations",
      icon: <Search size={18} className="text-blue-400" />
    },
    delete: {
      name: "Delete",
      description: "Delete a node from the binary search tree.",
      timeComplexity: "O(h)",
      spaceComplexity: "O(1)",
      category: "operations",
      icon: <Minus size={18} className="text-red-400" />
    },
    "in-order": {
      name: "In-order Traversal",
      description: "In-order traversal: left, root, right.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(h)",
      category: "traversals",
      icon: <ArrowDownUp size={18} className="text-yellow-400" />
    },
    "pre-order": {
      name: "Pre-order Traversal",
      description: "Pre-order traversal: root, left, right.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(h)",
      category: "traversals",
      icon: <ArrowDownUp size={18} className="text-purple-400" />
    },
    "post-order": {
      name: "Post-order Traversal",
      description: "Post-order traversal: left, right, root.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(h)",
      category: "traversals",
      icon: <ArrowDownUp size={18} className="text-pink-400" />
    },
    "level-order": {
      name: "Level-order Traversal",
      description: "Level-order traversal: breadth-first level by level.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      category: "traversals",
      icon: <ArrowDownUp size={18} className="text-indigo-400" />
    },
    none: {
      name: "Select Operation",
      description: "Select an operation to visualize how it works on the binary search tree.",
      timeComplexity: "",
      spaceComplexity: "",
      category: "",
      icon: null
    }
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
      selectedOperation ? operationInfo[selectedOperation].description : operationInfo.none.description
    );
    setTraversalResult("");
    clearTimeout(animationRef.current);
  };

  // Tree operation implementations
  const generateStepsForOperation = (operation) => {
    if (!operation) return;
    setAlgorithmDescription(operationInfo[operation].description || "");
    
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex">
      {/* Sidebar */}
      <div className={`bg-gray-800 w-64 flex-shrink-0 transition-all duration-300 ${sidebarOpen ? "ml-0" : "-ml-64"} lg:ml-0`}>
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
            <h3 className="text-sm uppercase text-gray-400 font-semibold mb-2">Categories</h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory("operations")}
                className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center space-x-2 ${activeCategory === "operations" ? "bg-indigo-600" : "hover:bg-gray-700"}`}
              >
                <Edit3 size={16} />
                <span>Tree Operations</span>
              </button>
              <button
                onClick={() => setActiveCategory("traversals")}
                className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center space-x-2 ${activeCategory === "traversals" ? "bg-indigo-600" : "hover:bg-gray-700"}`}
              >
                <ArrowDownUp size={16} />
                <span>Tree Traversals</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase text-gray-400 font-semibold mb-2">
              {activeCategory === "operations" ? "Tree Operations" : "Tree Traversals"}
            </h3>
            <div className="space-y-2">
              {Object.entries(operationInfo)
                .filter(([key, info]) => info.category === activeCategory && key !== "none")
                .map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedOperation(key)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center space-x-2 ${selectedOperation === key ? "bg-indigo-600" : "hover:bg-gray-700"}`}
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
              <h1 className="text-3xl font-bold">Binary Search Tree Visualizer</h1>
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
                  <label className="block mb-2">Tree Size: {treeSize}</label>
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
                    Value
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

          {/* Selected Operation Info */}
          {selectedOperation && (
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{operationInfo[selectedOperation].name}</h2>
                  <p className="text-gray-300">{operationInfo[selectedOperation].description}</p>
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
                  <span className="font-mono">{operationInfo[selectedOperation].timeComplexity}</span>
                </div>
                <div>
                  <span className="text-gray-400">Space Complexity: </span>
                  <span className="font-mono">{operationInfo[selectedOperation].spaceComplexity}</span>
                </div>
              </div>
            </div>
          )}

          {/* Traversal Result */}
          {traversalResult && (
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-bold mb-2">Traversal Result</h2>
              <p className="text-gray-300">{traversalResult}</p>
            </div>
          )}

          {/* Visualization Area */}
          <div className="bg-gray-800 p-6 rounded-lg mb-6 relative">
            <div className="flex flex-col items-center mb-6 relative" id="tree-container">
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {treeLevels.map((level, levelIndex) =>
                  level.map((value, nodeIndex) => {
                    if (value === null) return null;

                    // Calculate parent index
                    const parentIndex = Math.floor(nodeIndex / 2);
                    if (levelIndex === 0 || treeLevels[levelIndex - 1][parentIndex] === null) return null;

                    const parentId = `node-${levelIndex - 1}-${parentIndex}`;
                    const childId = `node-${levelIndex}-${nodeIndex}`;

                    const parentEl = document.getElementById(parentId);
                    const childEl = document.getElementById(childId);

                    if (parentEl && childEl) {
                      const parentRect = parentEl.getBoundingClientRect();
                      const childRect = childEl.getBoundingClientRect();
                      const containerRect = document.getElementById("tree-container").getBoundingClientRect();

                      // Centers of nodes
                      const x1 = parentRect.left + parentRect.width / 2 - containerRect.left;
                      const y1 = parentRect.top + parentRect.height / 2 - containerRect.top;
                      const x2 = childRect.left + childRect.width / 2 - containerRect.left;
                      const y2 = childRect.top + childRect.height / 2 - containerRect.top;

                      // Calculate angle for offset
                      const dx = x2 - x1;
                      const dy = y2 - y1;
                      const angle = Math.atan2(dy, dx);
                      const r = parentRect.width / 2; // radius of the circle

                      // Offset so line starts/ends at the edge of nodes
                      const x1Offset = x1 + r * Math.cos(angle);
                      const y1Offset = y1 + r * Math.sin(angle);
                      const x2Offset = x2 - r * Math.cos(angle);
                      const y2Offset = y2 - r * Math.sin(angle);

                      return (
                        <line
                          key={`${parentId}-${childId}`}
                          x1={x1Offset}
                          y1={y1Offset}
                          x2={x2Offset}
                          y2={y2Offset}
                          stroke="white"
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                        />
                      );
                    }
                    return null;
                  })
                )}

                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="10"
                    refY="3.5"
                    orient="auto"
                    fill="white"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" />
                  </marker>
                </defs>
              </svg>

              <div className="flex flex-col items-center justify-center mb-2">
                {treeLevels.length === 0 ? (
                  <div className="text-gray-500 text-lg py-10">Tree is empty</div>
                ) : (
                  treeLevels.map((level, levelIndex) => (
                    <div key={levelIndex} className="flex justify-center items-center my-2">
                      {level.map((value, nodeIndex) => {
                        const isHighlighted = currentStepObj?.highlighted?.includes(value);
                        return value !== null ? (
                          <div
                            key={`${levelIndex}-${nodeIndex}`}
                            id={`node-${levelIndex}-${nodeIndex}`}
                            className={`flex items-center justify-center mx-2 transition-all duration-300 ${
                              isHighlighted ? "bg-indigo-500" : "bg-gray-600"
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

            {/* Step Description */}
            {currentStepObj && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300">{currentStepObj.description}</p>
              </div>
            )}

            {/* Playback Controls */}
            {steps.length > 0 && (
              <div className="flex items-center justify-center mt-4 space-x-4">
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex(0);
                  }}
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  <RotateCcw size={20} />
                </button>
                <button
                  onClick={() => {
                    if (currentStepIndex > 0) {
                      setIsPlaying(false);
                      setCurrentStepIndex(currentStepIndex - 1);
                    }
                  }}
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  onClick={() => {
                    if (currentStepIndex < steps.length - 1) {
                      setIsPlaying(false);
                      setCurrentStepIndex(currentStepIndex + 1);
                    }
                  }}
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
          
          {/* Tree Info */}
          <div className="bg-gray-800 p-4 rounded-lg">
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
    </div>
  );
}