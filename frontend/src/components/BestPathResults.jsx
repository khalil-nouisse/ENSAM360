import React from 'react'

export default function BestPathResults({ bestPath, onNodeClick }) {
  if (!bestPath) return null
  const nodes = bestPath.nodes || []
  const edges = bestPath.edges || []
  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Best Path</h3>
        <div className="text-sm text-slate-600">Total: <span className="font-medium">{bestPath.totalDistance ?? '-'} m</span></div>
      </div>

      <div className="max-h-56 overflow-y-auto pr-2">
        <ol className="space-y-2">
          {nodes.map((node, idx) => {
            const isStart = idx === 0
            const isEnd = idx === nodes.length - 1
            return (
              <li key={node.id} className="flex items-start gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded" onClick={() => onNodeClick && onNodeClick(node.id)}>
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold ${isStart ? 'bg-emerald-500 text-white' : isEnd ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{node.name}</div>
                  <div className="text-xs text-slate-500">Floor: {node.floor ?? '—'} <br />
                    description: <span className="font-mono">{node.description}</span></div>
                </div>
                {idx !== nodes.length - 1 && (
                  <div className="text-sm text-slate-500 ml-2">{edges[idx] ? `${edges[idx].distance ?? '-'} m` : ''}</div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
