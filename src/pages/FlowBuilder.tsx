import { useState } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import { useFlowStore } from '@/lib/store';
import { nodeTypes } from '@/components/flow-builder/node-types';
import { NodePalette } from '@/components/flow-builder/node-palette';
import { NodeProperties } from '@/components/flow-builder/node-properties';
import { FlowDebugger } from '@/components/flow-builder/flow-debugger';
import { Button } from '@/components/ui/button';
import { Bug, Play, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import '@xyflow/react/dist/style.css';

export function FlowBuilder() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showDebugger, setShowDebugger] = useState(false);
  const [showPalette, setShowPalette] = useState(true);
  
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    simulateFlow,
    isFlowRunning,
    debugLogs,
  } = useFlowStore();

  const handleSimulateFlow = async () => {
    await simulateFlow();
    setShowDebugger(true);
  };

  return (
    <div className="w-full h-screen relative flex">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => setSelectedNode(node.id)}
          onPaneClick={() => setSelectedNode(null)}
        >
          <Background />
          <Controls />
          <div className="absolute top-4 right-4">
            <Button
              onClick={handleSimulateFlow}
              disabled={isFlowRunning}
            >
              {isFlowRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Flow
                </>
              )}
            </Button>
          </div>
        </ReactFlow>
      </div>

      <div
        className={cn(
          "w-80 border-l bg-card transition-all duration-300",
          showPalette ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedNode ? (
          <NodeProperties nodeId={selectedNode} />
        ) : (
          <NodePalette />
        )}
      </div>

      <div
        className={cn(
          "absolute left-0 right-0 bottom-0 bg-card border-t shadow-lg transition-all duration-300 transform",
          showDebugger ? "translate-y-0" : "translate-y-full"
        )}
        style={{
          width: showPalette ? 'calc(100% - 20rem)' : '100%'
        }}
      >
        <div 
          className={cn(
            "absolute -top-8 left-1/2 transform -translate-x-1/2 cursor-pointer",
            "bg-card border border-b-0 rounded-t-lg px-4 py-1.5 shadow-sm",
            "flex items-center gap-2 hover:bg-accent transition-colors"
          )}
          onClick={() => setShowDebugger(!showDebugger)}
        >
          <Bug className="h-4 w-4" />
          <span className="text-sm font-medium">Debugger</span>
          {debugLogs.length > 0 && (
            <span className="h-2 w-2 rounded-full bg-primary" />
          )}
        </div>
        <FlowDebugger onClose={() => setShowDebugger(false)} />
      </div>
    </div>
  );
}