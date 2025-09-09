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

// Graph class implementation
class Graph {
  constructor(directed = false) {
    this.nodes = new Map();
    this.edges = [];
    this.directed = directed;
  }

  addNode(id, value = id) {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, { id, value, edges: [] });
    }
    return this.nodes.get(id);
  }

  addEdge(from, to, weight = 1) {
    const fromNode = this.addNode(from);
    const toNode = this.addNode(to);
    
    fromNode.edges.push({ to, weight });
    if (!this.directed) {
      toNode.edges.push({ from, weight });
    }
    
    this.edges.push({ from, to, weight });
    return this.edges[this.edges.length - 1];
  }

  getNode(id) {
    return this.nodes.get(id);
  }

  getNodes() {
    return Array.from(this.nodes.values());
  }

  getEdges() {
    return this.edges;
  }
}

export default function GraphVisualizer() {
  const { dsId } = useParams();

  // UI/control states
  const [graphSize, setGraphSize] = useState(6);
  const [speed, setSpeed] = useState(600);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [displayGraph, setDisplayGraph] = useState({ nodes: [], edges: [] });
  const [operationValue, setOperationValue] = useState("");
  const [showControls, setShowControls] = useState(true);
  const [algorithmDescription, setAlgorithmDescription] = useState("");
  const [selectedOperation, setSelectedOperation] = useState("");
  const [startNode, setStartNode] = useState("A");
  const [endNode, setEndNode] = useState("F");
  const [graphType, setGraphType] = useState("undirected");

  // Internal refs
  const animationRef = useRef(null);
  const originalGraphRef = useRef(null);
  const mountedRef = useRef(false);

  const operationInfo = {
    "bfs": "Breadth-First Search: Explores all neighbor nodes at the present depth before moving on to nodes at the next depth level.",
    "dfs": "Depth-First Search: Explores as far as possible along each branch before backtracking.",
    "dijkstra": "Dijkstra's Algorithm: Finds the shortest path between nodes in a graph with non-negative edge weights.",
    "prim": "Prim's Algorithm: Finds a minimum spanning tree for a weighted undirected graph.",
    "topological": "Topological Sort: Linear ordering of vertices such that for every directed edge u→v, u comes before v in the ordering.",
    "none": "Select an algorithm to visualize how it works on the graph.",
  };

  // Generate positions for nodes in a circular layout
  const generateNodePositions = (nodes, width = 500, height = 400) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    const angleStep = (2 * Math.PI) / nodes.length;
    
    return nodes.map((node, index) => {
      const angle = index * angleStep;
      return {
        id: node.id,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        value: node.value
      };
    });
  };

  const setOriginalGraph = (graph) => {
    originalGraphRef.current = graph;
    const nodes = graph.getNodes();
    const edges = graph.getEdges();
    const positionedNodes = generateNodePositions(nodes);
    setDisplayGraph({ nodes: positionedNodes, edges });
  };

  const generateRandomGraph = (size = graphSize) => {
    const graph = new Graph(graphType === "directed");
    
    // Create nodes
    for (let i = 0; i < size; i++) {
      const nodeId = String.fromCharCode(65 + i); // A, B, C, ...
      graph.addNode(nodeId);
    }
    
    // Create edges - ensure the graph is connected
    const nodes = graph.getNodes();
    
    // Create a minimum spanning tree to ensure connectivity
    for (let i = 1; i < nodes.length; i++) {
      const from = nodes[Math.floor(Math.random() * i)].id;
      const to = nodes[i].id;
      const weight = Math.floor(Math.random() * 9) + 1; // 1-9
      graph.addEdge(from, to, weight);
    }
    
    // Add some additional random edges
    const extraEdges = Math.floor(size * 0.8);
    for (let i = 0; i < extraEdges; i++) {
      const fromIndex = Math.floor(Math.random() * nodes.length);
      let toIndex = Math.floor(Math.random() * nodes.length);
      
      // Ensure we don't create self-loops or duplicate edges
      while (toIndex === fromIndex) {
        toIndex = Math.floor(Math.random() * nodes.length);
      }
      
      const from = nodes[fromIndex].id;
      const to = nodes[toIndex].id;
      const weight = Math.floor(Math.random() * 9) + 1; // 1-9
      
      // Check if edge already exists
      const edgeExists = graph.getEdges().some(edge => 
        (edge.from === from && edge.to === to) || 
        (!graph.directed && edge.from === to && edge.to === from)
      );
      
      if (!edgeExists) {
        graph.addEdge(from, to, weight);
      }
    }
    
    setOriginalGraph(graph);
    resetVisualizationState();
  };

  const resetVisualizationState = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setSteps([]);
    
    const graph = originalGraphRef.current;
    const nodes = graph.getNodes();
    const edges = graph.getEdges();
    const positionedNodes = generateNodePositions(nodes);
    setDisplayGraph({ nodes: positionedNodes, edges });
    
    setAlgorithmDescription(
      selectedOperation ? operationInfo[selectedOperation] : operationInfo.none
    );
    clearTimeout(animationRef.current);
  };

  // Graph algorithm implementations
  const generateStepsForOperation = (operation) => {
    if (!operation) return;
    setAlgorithmDescription(operationInfo[operation] || "");
    
    const graph = originalGraphRef.current;
    const out = [];
    const nodes = graph.getNodes();
    const edges = graph.getEdges();
    const positionedNodes = generateNodePositions(nodes);

    // BFS algorithm
    if (operation === "bfs") {
      out.push({
        graph: { nodes: positionedNodes, edges },
        highlightedNodes: [],
        highlightedEdges: [],
        description: `Starting BFS from node ${startNode}.`,
      });

      const visited = new Set();
      const queue = [startNode];
      visited.add(startNode);

      while (queue.length > 0) {
        const current = queue.shift();
        
        out.push({
          graph: { nodes: positionedNodes, edges },
          highlightedNodes: [...visited],
          highlightedEdges: edges.filter(edge => 
            visited.has(edge.from) && visited.has(edge.to)
          ).map(edge => `${edge.from}-${edge.to}`),
          description: `Visiting node ${current}.`,
        });

        const currentNode = graph.getNode(current);
        for (const edge of currentNode.edges) {
          const neighbor = edge.to;
          
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
            
            out.push({
              graph: { nodes: positionedNodes, edges },
              highlightedNodes: [...visited],
              highlightedEdges: edges.filter(edge => 
                visited.has(edge.from) && visited.has(edge.to)
              ).map(edge => `${edge.from}-${edge.to}`),
              description: `Discovered node ${neighbor} from ${current}.`,
            });
          }
        }
      }

      out.push({
        graph: { nodes: positionedNodes, edges },
        highlightedNodes: [...visited],
        highlightedEdges: edges.filter(edge => 
          visited.has(edge.from) && visited.has(edge.to)
        ).map(edge => `${edge.from}-${edge.to}`),
        description: `BFS complete. Visited ${visited.size} nodes.`,
      });
    }

    // DFS algorithm
    else if (operation === "dfs") {
      out.push({
        graph: { nodes: positionedNodes, edges },
        highlightedNodes: [],
        highlightedEdges: [],
        description: `Starting DFS from node ${startNode}.`,
      });

      const visited = new Set();
      const stack = [startNode];
      
      // Initial state
      out.push({
        graph: { nodes: positionedNodes, edges },
        highlightedNodes: [startNode],
        highlightedEdges: [],
        description: `Pushing node ${startNode} to stack.`,
      });

      while (stack.length > 0) {
        const current = stack.pop();
        
        if (!visited.has(current)) {
          visited.add(current);
          
          out.push({
            graph: { nodes: positionedNodes, edges },
            highlightedNodes: [...visited],
            highlightedEdges: edges.filter(edge => 
              visited.has(edge.from) && visited.has(edge.to)
            ).map(edge => `${edge.from}-${edge.to}`),
            description: `Visiting node ${current}.`,
          });

          const currentNode = graph.getNode(current);
          for (const edge of currentNode.edges) {
            const neighbor = edge.to;
            
            if (!visited.has(neighbor)) {
              stack.push(neighbor);
              
              out.push({
                graph: { nodes: positionedNodes, edges },
                highlightedNodes: [...visited],
                highlightedEdges: [
                  ...edges.filter(edge => 
                    visited.has(edge.from) && visited.has(edge.to)
                  ).map(edge => `${edge.from}-${edge.to}`),
                  `${current}-${neighbor}`
                ],
                description: `Pushing node ${neighbor} to stack.`,
              });
            }
          }
        }
      }

      out.push({
        graph: { nodes: positionedNodes, edges },
        highlightedNodes: [...visited],
        highlightedEdges: edges.filter(edge => 
          visited.has(edge.from) && visited.has(edge.to)
        ).map(edge => `${edge.from}-${edge.to}`),
        description: `DFS complete. Visited ${visited.size} nodes.`,
      });
    }

    // Dijkstra's algorithm
    else if (operation === "dijkstra") {
      out.push({
        graph: { nodes: positionedNodes, edges },
        highlightedNodes: [],
        highlightedEdges: [],
        description: `Starting Dijkstra's algorithm from node ${startNode} to node ${endNode}.`,
      });

      const distances = {};
      const previous = {};
      const visited = new Set();
      const unvisited = new Set();
      
      // Initialize distances
      for (const node of nodes) {
        distances[node.id] = node.id === startNode ? 0 : Infinity;
        unvisited.add(node.id);
      }
      
      out.push({
        graph: { nodes: positionedNodes, edges },
        highlightedNodes: [startNode],
        highlightedEdges: [],
        description: `Initialized distances. ${startNode}: 0, others: Infinity.`,
      });

      while (unvisited.size > 0) {
        // Find node with smallest distance
        let current = null;
        for (const node of unvisited) {
          if (current === null || distances[node] < distances[current]) {
            current = node;
          }
        }
        
        if (distances[current] === Infinity) break;
        
        unvisited.delete(current);
        visited.add(current);
        
        out.push({
          graph: { nodes: positionedNodes, edges },
          highlightedNodes: [...visited],
          highlightedEdges: edges.filter(edge => 
            visited.has(edge.from) && visited.has(edge.to)
          ).map(edge => `${edge.from}-${edge.to}`),
          description: `Visiting node ${current} with distance ${distances[current]}.`,
        });

        // If we reached the target node
        if (current === endNode) {
          // Reconstruct path
          const path = [];
          let node = endNode;
          while (node !== startNode) {
            path.unshift(node);
            node = previous[node];
          }
          path.unshift(startNode);
          
          // Highlight path
          const pathEdges = [];
          for (let i = 0; i < path.length - 1; i++) {
            pathEdges.push(`${path[i]}-${path[i+1]}`);
          }
          
          out.push({
            graph: { nodes: positionedNodes, edges },
            highlightedNodes: path,
            highlightedEdges: pathEdges,
            description: `Shortest path found! Distance: ${distances[endNode]}. Path: ${path.join(" → ")}`,
          });
          
          break;
        }

        // Update distances to neighbors
        const currentNode = graph.getNode(current);
        for (const edge of currentNode.edges) {
          const neighbor = edge.to;
          if (!visited.has(neighbor)) {
            const alt = distances[current] + edge.weight;
            if (alt < distances[neighbor]) {
              distances[neighbor] = alt;
              previous[neighbor] = current;
              
              out.push({
                graph: { nodes: positionedNodes, edges },
                highlightedNodes: [...visited, neighbor],
                highlightedEdges: [
                  ...edges.filter(edge => 
                    visited.has(edge.from) && visited.has(edge.to)
                  ).map(edge => `${edge.from}-${edge.to}`),
                  `${current}-${neighbor}`
                ],
                description: `Updated distance to ${neighbor}: ${alt}.`,
              });
            }
          }
        }
      }
    }

    // Prim's algorithm
    else if (operation === "prim") {
      out.push({
        graph: { nodes: positionedNodes, edges },
        highlightedNodes: [],
        highlightedEdges: [],
        description: `Starting Prim's algorithm for minimum spanning tree from node ${startNode}.`,
      });

      const inMST = new Set([startNode]);
      const mstEdges = [];
      
      out.push({
        graph: { nodes: positionedNodes, edges },
        highlightedNodes: [startNode],
        highlightedEdges: [],
        description: `Added node ${startNode} to MST.`,
      });

      while (inMST.size < nodes.length) {
        let minEdge = null;
        let minWeight = Infinity;
        
        // Find minimum weight edge connecting MST to non-MST node
        for (const node of inMST) {
          const currentNode = graph.getNode(node);
          for (const edge of currentNode.edges) {
            if (!inMST.has(edge.to) && edge.weight < minWeight) {
              minEdge = { from: node, to: edge.to, weight: edge.weight };
              minWeight = edge.weight;
            }
          }
        }
        
        if (minEdge === null) break;
        
        inMST.add(minEdge.to);
        mstEdges.push(minEdge);
        
        out.push({
          graph: { nodes: positionedNodes, edges },
          highlightedNodes: [...inMST],
          highlightedEdges: mstEdges.map(edge => `${edge.from}-${edge.to}`),
          description: `Added edge ${minEdge.from}-${minEdge.to} (weight: ${minEdge.weight}) to MST.`,
        });
      }
      
      out.push({
        graph: { nodes: positionedNodes, edges },
        highlightedNodes: [...inMST],
        highlightedEdges: mstEdges.map(edge => `${edge.from}-${edge.to}`),
        description: `Prim's algorithm complete. MST has ${mstEdges.length} edges.`,
      });
    }

    setSteps(out);
    setCurrentStepIndex(0);
    setDisplayGraph(out.length > 0 ? {...out[0].graph} : { nodes: positionedNodes, edges });
    setTimeout(() => setIsPlaying(true), 50);
  };

  useEffect(() => {
    if (!mountedRef.current) {
      generateRandomGraph(graphSize);
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
      setDisplayGraph({...steps[currentStepIndex].graph});
    }
  }, [currentStepIndex, steps]);

  const currentStepObj = steps[currentStepIndex] || null;

  if (dsId !== "graph") {
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
          <h1 className="text-3xl font-bold">Graph Visualizer</h1>
          <div className="flex items-center gap-2">
            <select
              value={selectedOperation}
              onChange={(e) => setSelectedOperation(e.target.value)}
              className="bg-gray-700 px-3 py-2 rounded"
            >
              <option value="">Select Algorithm</option>
              <option value="bfs">Breadth-First Search</option>
              <option value="dfs">Depth-First Search</option>
              <option value="dijkstra">Dijkstra's Algorithm</option>
              <option value="prim">Prim's Algorithm</option>
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
                <label className="block mb-2">Graph Size: {graphSize}</label>
                <input
                  type="range"
                  min="4"
                  max="10"
                  value={graphSize}
                  onChange={(e) => {
                    const newSize = parseInt(e.target.value);
                    setGraphSize(newSize);
                    generateRandomGraph(newSize);
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
                <label className="block mb-2">Graph Type</label>
                <select
                  value={graphType}
                  onChange={(e) => {
                    setGraphType(e.target.value);
                    generateRandomGraph(graphSize);
                  }}
                  className="w-full bg-gray-700 px-3 py-2 rounded"
                >
                  <option value="undirected">Undirected</option>
                  <option value="directed">Directed</option>
                </select>
              </div>

              <div>
                <label className="block mb-2">Start Node</label>
                <select
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value)}
                  className="w-full bg-gray-700 px-3 py-2 rounded"
                >
                  {displayGraph.nodes.map(node => (
                    <option key={node.id} value={node.id}>{node.id}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">End Node (for Dijkstra)</label>
                <select
                  value={endNode}
                  onChange={(e) => setEndNode(e.target.value)}
                  className="w-full bg-gray-700 px-3 py-2 rounded"
                >
                  {displayGraph.nodes.map(node => (
                    <option key={node.id} value={node.id}>{node.id}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3 flex justify-center gap-2">
                <button
                  onClick={() => generateRandomGraph()}
                  className="bg-gray-700 px-4 py-2 rounded"
                >
                  Generate New Graph
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Visualization Area */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative" style={{ width: '500px', height: '400px' }}>
              <svg width="500" height="400" className="border border-gray-600 rounded">
                {/* Draw edges */}
                {displayGraph.edges.map((edge, index) => {
                  const fromNode = displayGraph.nodes.find(n => n.id === edge.from);
                  const toNode = displayGraph.nodes.find(n => n.id === edge.to);
                  
                  if (!fromNode || !toNode) return null;
                  
                  const isHighlighted = currentStepObj?.highlightedEdges?.includes(`${edge.from}-${edge.to}`) || 
                                      currentStepObj?.highlightedEdges?.includes(`${edge.to}-${edge.from}`);
                  
                  // Calculate arrow points for directed graphs
                  const dx = toNode.x - fromNode.x;
                  const dy = toNode.y - fromNode.y;
                  const length = Math.sqrt(dx * dx + dy * dy);
                  const unitDx = dx / length;
                  const unitDy = dy / length;
                  
                  // Adjust start and end points to node radius (20px)
                  const startX = fromNode.x + unitDx * 20;
                  const startY = fromNode.y + unitDy * 20;
                  const endX = toNode.x - unitDx * 20;
                  const endY = toNode.y - unitDy * 20;
                  
                  // Arrowhead points
                  const arrowLength = 10;
                  const arrowWidth = 6;
                  
                  return (
                    <g key={`${edge.from}-${edge.to}-${index}`}>
                      {/* Edge line */}
                      <line
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                        stroke={isHighlighted ? "#8b5cf6" : "#4b5563"}
                        strokeWidth="2"
                        markerEnd={graphType === "directed" ? "url(#arrowhead)" : undefined}
                      />
                      
                      {/* Edge weight */}
                      <text
                        x={(fromNode.x + toNode.x) / 2 + 5}
                        y={(fromNode.y + toNode.y) / 2 + 5}
                        fill="#d1d5db"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}
                
                {/* Draw nodes */}
                {displayGraph.nodes.map((node) => {
                  const isHighlighted = currentStepObj?.highlightedNodes?.includes(node.id);
                  
                  return (
                    <g key={node.id}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="20"
                        fill={isHighlighted ? "#8b5cf6" : "#4b5563"}
                        stroke="#9ca3af"
                        strokeWidth="2"
                        className="cursor-pointer"
                      />
                      <text
                        x={node.x}
                        y={node.y}
                        textAnchor="middle"
                        dy=".3em"
                        fill="white"
                        fontSize="16"
                        fontWeight="bold"
                      >
                        {node.id}
                      </text>
                    </g>
                  );
                })}
                
                {/* Arrowhead definition for directed graphs */}
                {graphType === "directed" && (
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
                    </marker>
                  </defs>
                )}
              </svg>
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
          <h2 className="text-xl font-bold mb-2">About This Algorithm</h2>
          <p>{operationInfo[selectedOperation] || operationInfo.none}</p>
        </div>

        {/* Graph Info */}
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <h2 className="text-xl font-bold mb-2">Graph Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300">
                Number of Nodes: {displayGraph.nodes.length}
              </p>
              <p className="text-gray-300">
                Number of Edges: {displayGraph.edges.length}
              </p>
            </div>
            <div>
              <p className="text-gray-300">
                Graph Type: {graphType === "directed" ? "Directed" : "Undirected"}
              </p>
              <p className="text-gray-300">
                Density: {(displayGraph.edges.length / (displayGraph.nodes.length * (displayGraph.nodes.length - 1) / 2)).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}