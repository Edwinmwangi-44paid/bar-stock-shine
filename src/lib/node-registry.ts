import { NodePlugin } from '@/types/node-plugin';

class NodeRegistry {
  private plugins: Map<string, NodePlugin> = new Map();

  register(plugin: NodePlugin) {
    this.plugins.set(plugin.type, plugin);
  }

  getPlugin(type: string): NodePlugin | undefined {
    return this.plugins.get(type);
  }

  getAllPlugins(): NodePlugin[] {
    return Array.from(this.plugins.values());
  }

  getPluginsByCategory(category: NodePlugin['category']): NodePlugin[] {
    return this.getAllPlugins().filter(plugin => plugin.category === category);
  }
}

export const nodeRegistry = new NodeRegistry();
