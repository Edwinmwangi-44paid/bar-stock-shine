import { useFlowStore } from '@/lib/store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Terminal, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FlowDebugger({ onClose }: { onClose: () => void }) {
  const { 
    debugLogs, 
    flowStartTime, 
    flowEndTime,
    isFlowRunning,
  } = useFlowStore();
  
  const duration = flowStartTime && flowEndTime 
    ? ((flowEndTime - flowStartTime) / 1000).toFixed(2)
    : null;

  return (
    <div className="h-64 flex flex-col">
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-sm">Flow Execution</h2>
          {isFlowRunning && (
            <div className="flex items-center gap-2 text-sm text-primary animate-pulse">
              <Loader2 className="h-3 w-3 animate-spin" />
              Executing flow...
            </div>
          )}
          {duration && !isFlowRunning && (
            <div className="text-sm text-muted-foreground">
              Completed in {duration}s
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {debugLogs.map((log, index) => (
            <div key={index} className="mb-2">
              <div className="flex items-start gap-2">
                {log.type === 'error' && <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />}
                {log.type === 'output' && <Terminal className="h-4 w-4 mt-0.5" />}
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{log.nodeName}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{log.message}</p>
                  
                  {log.data && (
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {debugLogs.length === 0 && (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
              No logs yet. Run the flow to see execution details.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}