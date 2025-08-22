import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Power } from 'lucide-react';
import { useFlowStore } from '@/lib/store';
import { nodeRegistry } from '@/lib/node-registry';
import { cn } from '@/lib/utils';
import { NodePalette } from '@/components/flow-builder/node-palette';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function BaseNode({ data, id }: { data: any; id: string }) {
  const [dropdownTrigger, setDropdownTrigger] = useState<string | null>(null);
  const { addNode, setEdges, removeNode, toggleNodeEnabled } = useFlowStore();
  const { errorNodes } = useFlowStore();
  
  const plugin = nodeRegistry.getPlugin(data.type);
  const Icon = plugin?.icon;
  const hasError = errorNodes.includes(id);
  
  const isConnected = (handleId?: string) => {
    const edges = useFlowStore.getState().edges;
    return edges.some(edge => 
      edge.source === id && (!handleId || edge.sourceHandle === handleId)
    );
  };

  const handleAddNode = (nodeType: string) => {
    const plugin = nodeRegistry.getPlugin(nodeType);
    if (!plugin) return;

    const newNode = {
      id: `${nodeType}-${Date.now()}`,
      type: 'base',
      position: {
        x: data.position?.x || 250,
        y: (data.position?.y || 50) + 200
      },
      data: { 
        type: nodeType,
        label: plugin.name,
      },
    };

    addNode(newNode);

    setEdges(edges => [
      ...edges,
      {
        id: `${id}-${newNode.id}`,
        source: id,
        target: newNode.id,
        type: 'smoothstep',
        sourceHandle: dropdownTrigger || undefined,
      },
    ]);

    setDropdownTrigger(null);
  };

  const isConditionNode = data.type === 'condition';

  return (
    <Card className={cn(
      "min-w-[280px] border-2 relative",
      data.disabled && "opacity-50",
      isConnected() && !isConditionNode && "mb-16",
      isConditionNode && "mb-32",
      hasError && "border-destructive bg-destructive/5",
      hasError && "animate-pulse"
    )}>
      {!data.isFirstNode && (
        <Handle
          type="target"
          position={Position.Top}
          className="!border-0 !bg-transparent"
        />
      )}
      
      <div className="flex items-start p-4 gap-3">
        {Icon && (
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: hasError ? 'hsl(var(--destructive))' : `${plugin?.color}20` }}
          >
            <Icon 
              className="h-5 w-5" 
              style={{ color: hasError ? 'white' : plugin?.color }}
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <CardTitle className="text-base font-semibold truncate">{data.label}</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">{data.type}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleNodeEnabled(id)}
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center",
              data.disabled ? "text-muted-foreground" : "text-green-500"
            )}
          >
            <Power className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => removeNode(id)}
            className="w-6 h-6 rounded-full flex items-center justify-center text-destructive/50 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {isConditionNode ? (
        <div className="absolute -bottom-32 left-0 right-0 flex justify-between px-24">
          <div className="flex flex-col items-center relative">
            <Handle
              type="source"
              position={Position.Bottom}
              id="true"
              className="!border-0 !bg-transparent"
            />
            <span className="text-xs font-medium mt-1 text-green-600">True</span>
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={cn(
                    "mt-2 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center cursor-pointer",
                    isConnected('true') ? "opacity-50 cursor-not-allowed" : "hover:border-primary"
                  )}
                  onClick={() => !isConnected('true') && setDropdownTrigger('true')}
                >
                  <Plus className="h-4 w-4" />
                </div>
              </PopoverTrigger>
              {!isConnected('true') && (
                <PopoverContent className="w-80 p-0" align="center">
                  <NodePalette onSelect={handleAddNode} />
                </PopoverContent>
              )}
            </Popover>
          </div>
          <div className="flex flex-col items-center relative">
            <Handle
              type="source"
              position={Position.Bottom}
              id="false"
              className="!border-0 !bg-transparent"
            />
            <span className="text-xs font-medium mt-1 text-red-600">False</span>
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={cn(
                    "mt-2 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center cursor-pointer",
                    isConnected('false') ? "opacity-50 cursor-not-allowed" : "hover:border-primary"
                  )}
                  onClick={() => !isConnected('false') && setDropdownTrigger('false')}
                >
                  <Plus className="h-4 w-4" />
                </div>
              </PopoverTrigger>
              {!isConnected('false') && (
                <PopoverContent className="w-80 p-0" align="center">
                  <NodePalette onSelect={handleAddNode} />
                </PopoverContent>
              )}
            </Popover>
          </div>
        </div>
      ) : (
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <Handle
            type="source"
            position={Position.Bottom}
            className="!border-0 !bg-transparent"
          />
          <Popover>
            <PopoverTrigger asChild>
              <div
                className={cn(
                  "mt-2 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center cursor-pointer",
                  isConnected() ? "opacity-50 cursor-not-allowed" : "hover:border-primary"
                )}
                onClick={() => !isConnected() && setDropdownTrigger(null)}
              >
                <Plus className="h-4 w-4" />
              </div>
            </PopoverTrigger>
            {!isConnected() && (
              <PopoverContent className="w-80 p-0" align="center">
                <NodePalette onSelect={handleAddNode} />
              </PopoverContent>
            )}
          </Popover>
        </div>
      )}
    </Card>
  );
}