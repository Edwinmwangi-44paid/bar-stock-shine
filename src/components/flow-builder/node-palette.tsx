import { Button } from "@/components/ui/button";
import { nodeRegistry } from "@/lib/node-registry";
import { useFlowStore } from "@/lib/store";
import { Circle } from "lucide-react";

export function NodePalette({ onSelect }: { onSelect?: (type: string) => void }) {
  const { addNode, setEdges } = useFlowStore();

  const createNode = (type: string) => {
    if (onSelect) {
      onSelect(type);
      return;
    }

    const plugin = nodeRegistry.getPlugin(type);
    if (!plugin) return;

    const existingNodes = useFlowStore.getState().nodes;
    const lastNode = existingNodes[existingNodes.length - 1];
    
    const position = lastNode
      ? { x: lastNode.position.x, y: lastNode.position.y + 150 }
      : { x: 250, y: 50 };

    const count = existingNodes.filter(n => n.data.type === type).length + 1;
    const nodeName = existingNodes.length === 0 ? plugin.name : `${plugin.name} ${count}`;

    const newNode = {
      id: `${type}-${Date.now()}`,
      type: 'base',
      position,
      data: { 
        type, 
        label: nodeName,
        isFirstNode: existingNodes.length === 0,
      },
    };

    addNode(newNode);

    if (lastNode) {
      setEdges((edges) => [
        ...edges,
        {
          id: `${lastNode.id}-${newNode.id}`,
          source: lastNode.id,
          target: newNode.id,
          type: 'smoothstep',
        },
      ]);
    }
  };

  const categories = ['trigger', 'action', 'condition', 'transformer'] as const;

  return (
    <div className="p-4">
      {categories.map((category) => (
        <div key={category} className="mb-4">
          <h3 className="text-sm font-medium capitalize mb-2">{category}</h3>
          <div className="grid gap-1">
            {nodeRegistry.getPluginsByCategory(category).map((plugin) => {
              const Icon = plugin.icon || Circle;
              return (
                <Button
                  key={plugin.type}
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => createNode(plugin.type)}
                >
                  <div 
                    className="w-5 h-5 rounded-full mr-2 flex items-center justify-center"
                    style={{ backgroundColor: `${plugin.color}20` }}
                  >
                    <Icon className="h-3 w-3" style={{ color: plugin.color }} />
                  </div>
                  <span className="truncate">{plugin.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}