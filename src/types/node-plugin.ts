export type InputFieldType = 'text' | 'select' | 'number' | 'code' | 'variable';

export interface InputField {
  name: string;
  label: string;
  type: InputFieldType;
  required?: boolean;
  default?: any;
  options?: { label: string; value: string; description?: string }[];
  description?: string;
  placeholder?: string;
  language?: 'javascript' | 'json';
  dynamic?: boolean;
  dynamicOptions?: (
    nodes: any[],
    edges: any[],
    currentNodeId: string,
    currentInputs: Record<string, any>
  ) => { label: string; value: string; description?: string }[];
}

export interface NodePlugin {
  type: string;             // Unique identifier
  name: string;             // Display name
  description: string;      // Description of what the node does
  category: 'trigger' | 'action' | 'condition' | 'transformer'; // Node category
  icon?: any;               // Icon component (from lucide-react)
  color?: string;           // Color for the node
  inputs?: InputField[];    // Input fields for configuration
  outputs?: {               // Output fields that can be used by other nodes
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    description?: string;
  }[];
  execute?: (
    inputs: Record<string, any>,
    context: { variables: Record<string, any> }
  ) => Promise<Record<string, any>>;
}
