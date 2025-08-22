import { create } from 'zustand';
import { Node, Edge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { nodeRegistry } from './node-registry';

interface DebugLog {
  nodeId: string;
  nodeName: string;
  type: 'info' | 'error' | 'output';
  message: string;
  timestamp: number;
  data?: any;
}

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  runningEdges: string[];
  debugLogs: DebugLog[];
  flowStartTime: number | null;
  flowEndTime: number | null;
  isFlowRunning: boolean;
  errorNodes: string[];
  addNode: (node: Node) => void;
  updateNode: (id: string, data: any) => void;
  removeNode: (id: string) => void;
  toggleNodeEnabled: (id: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  simulateFlow: () => Promise<void>;
  setRunningEdges: (edges: string[]) => void;
  addDebugLog: (log: Omit<DebugLog, 'timestamp'>) => void;
  clearDebugLogs: () => void;
  setErrorNodes: (nodes: string[]) => void;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  runningEdges: [],
  debugLogs: [],
  flowStartTime: null,
  flowEndTime: null,
  isFlowRunning: false,
  errorNodes: [],
  setRunningEdges: (edges) => set({ runningEdges: edges }),
  addDebugLog: (log) => set((state) => ({
    debugLogs: [...state.debugLogs, { ...log, timestamp: Date.now() }]
  })),
  clearDebugLogs: () => set({ 
    debugLogs: [],
    flowStartTime: null,
    flowEndTime: null,
    errorNodes: [],
  }),
  setErrorNodes: (nodes) => set({ errorNodes: nodes }),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  updateNode: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    })),
  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
    })),
  toggleNodeEnabled: (id) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: { ...node.data, disabled: !node.data.disabled },
            }
          : node
      ),
    })),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set((state) => ({ 
    edges: typeof edges === 'function' ? edges(state.edges) : edges 
  })),
  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }));
  },
  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },
  onConnect: (connection) => {
    set((state) => ({
      edges: [
        ...state.edges,
        {
          id: `${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
          type: 'smoothstep',
        },
      ],
    }));
  },
  simulateFlow: async () => {
    const { nodes, edges, setRunningEdges, addDebugLog, clearDebugLogs, setErrorNodes } = get();
    const firstNode = nodes.find(node => node.data.isFirstNode);
    if (!firstNode) {
      addDebugLog({
        nodeId: 'system',
        nodeName: 'System',
        type: 'error',
        message: 'No starting node found in the flow',
      });
      return;
    }

    clearDebugLogs();
    set({ 
      flowStartTime: Date.now(),
      isFlowRunning: true,
      errorNodes: [],
    });

    setRunningEdges([]);

    const processNode = async (nodeId: string, context = { variables: {} }) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      if (node.data.disabled) {
        const outgoingEdges = edges.filter(e => e.source === nodeId);
        await Promise.all(outgoingEdges.map(async edge => {
          setRunningEdges([edge.id]);
          await processNode(edge.target as string, context);
        }));
        return;
      }

      const plugin = nodeRegistry.getPlugin(node.data.type as string);
      if (!plugin) return;

      try {
        addDebugLog({
          nodeId: node.id,
          nodeName: String(node.data.label),
          type: 'info',
          message: `Executing ${String(node.data.label)}`,
        });

        const result = await plugin.execute?.(node.data.inputs || {}, context);

        if (result) {
          Object.entries(result).forEach(([key, value]) => {
            context.variables[`${node.id}.${key}`] = value;
          });

          addDebugLog({
            nodeId: node.id,
            nodeName: String(node.data.label),
            type: 'output',
            message: 'Execution completed',
            data: result,
          });
        }

        const outgoingEdges = edges.filter(e => e.source === nodeId);
        
        if (node.data.type === 'condition') {
          const isTrue = result?.result === true;
          const matchingEdges = outgoingEdges.filter(edge => 
            (isTrue && edge.sourceHandle === 'true') || (!isTrue && edge.sourceHandle === 'false')
          );

          await Promise.all(matchingEdges.map(async edge => {
            setRunningEdges([edge.id]);
            await processNode(edge.target as string, { ...context });
          }));
        } else {
          await Promise.all(outgoingEdges.map(async edge => {
            setRunningEdges([edge.id]);
            await processNode(edge.target as string, context);
          }));
        }
      } catch (error: any) {
        set(state => ({ errorNodes: [...state.errorNodes, node.id] }));
        addDebugLog({
          nodeId: node.id,
          nodeName: String(node.data.label),
          type: 'error',
          message: error.message,
        });
      }
    };

    try {
      await processNode(firstNode.id);
    } finally {
      set({ 
        flowEndTime: Date.now(),
        isFlowRunning: false,
      });
      setRunningEdges([]);
    }
  },
}));