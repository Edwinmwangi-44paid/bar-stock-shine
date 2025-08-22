import { useFlowStore } from '@/lib/store';
import { nodeRegistry } from '@/lib/node-registry';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MonacoEditor } from './monaco-editor';

export function NodeProperties({ nodeId }: { nodeId: string | null }) {
  const { nodes, updateNode } = useFlowStore();
  
  if (!nodeId) {
    return <div className="p-4 text-muted-foreground">Select a node to view its properties</div>;
  }

  const node = nodes.find(n => n.id === nodeId);
  if (!node) return null;

  const plugin = nodeRegistry.getPlugin(node.data.type as string);
  if (!plugin) return null;

  const handleInputChange = (name: string, value: any) => {
    const currentInputs = node.data.inputs as Record<string, any> | undefined;
    updateNode(nodeId, {
      inputs: {
        ...(currentInputs || {}),
        [name]: value,
      },
    });
  };

  const handleLabelChange = (value: string) => {
    updateNode(nodeId, {
      label: value,
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <Label>Node Name</Label>
        <Input
          value={String(node.data.label || '')}
          onChange={(e) => handleLabelChange(e.target.value)}
          placeholder="Enter node name"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Properties</h3>

        {plugin.inputs?.map((input) => (
          <div key={input.name} className="space-y-2">
            <Label>
              {input.label}
              {input.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            
            {input.type === 'text' && (
              <Input
                value={String(node.data.inputs?.[input.name] || '')}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                placeholder={input.placeholder}
              />
            )}
            
            {input.type === 'select' && (
              <Select
                value={String(node.data.inputs?.[input.name] || '')}
                onValueChange={(value) => handleInputChange(input.name, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${input.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {input.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {input.type === 'code' && (
              <MonacoEditor
                value={String(node.data.inputs?.[input.name] || '')}
                onChange={(value) => handleInputChange(input.name, value)}
                language={input.language || 'javascript'}
                height="200px"
              />
            )}
            
            {input.description && (
              <p className="text-xs text-muted-foreground">{input.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}