import React from 'react'
import { X } from 'lucide-react'

export default function BestPathResults({ bestPath, onNodeClick, onClose }) {
  if (!bestPath) return null
  const nodes = bestPath.nodes || []
  const edges = bestPath.edges || []
  return (
    <div className="bg-background/95 backdrop-blur-md border border-primary/20 rounded-2xl p-4 w-full shadow-lg transition-colors duration-300">
      <div className="flex items-center justify-between mb-3 border-b border-primary/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <h3 className="text-base font-semibold text-foreground">Best Path Found</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground">
            Total: <span className="font-semibold text-primary">{bestPath.totalDistance ?? '-'} m</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-all duration-200"
              aria-label="Close results"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="max-h-56 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        <ol className="space-y-2">
          {nodes.map((node, idx) => {
            const isStart = idx === 0
            const isEnd = idx === nodes.length - 1
            return (
              <li
                key={node.id}
                className="flex items-start gap-3 cursor-pointer hover:bg-primary/5 dark:hover:bg-primary/10 p-2.5 rounded-xl transition-all duration-200 group border border-transparent hover:border-primary/20"
                onClick={() => onNodeClick && onNodeClick(node.id)}
              >
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-all duration-200 ${isStart
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : isEnd
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                  }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground text-sm truncate">{node.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Floor: {node.floor ?? '—'} • {node.description}
                  </div>
                </div>
                {idx !== nodes.length - 1 && (
                  <div className="text-xs font-semibold text-primary ml-2 shrink-0">
                    {edges[idx] ? `${edges[idx].distance ?? '-'} m` : ''}
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
