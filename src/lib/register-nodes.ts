import { nodeRegistry } from './node-registry';
import { firecrawlNode } from '@/nodes/firecrawl';

// Register Firecrawl node
nodeRegistry.register(firecrawlNode);

export { nodeRegistry };
