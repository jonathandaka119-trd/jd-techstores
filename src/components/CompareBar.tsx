import { useNavigate } from 'react-router-dom'
import { X, GitCompare } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function CompareBar() {
  const { compareList, toggleCompare, clearCompare } = useStore()
  const navigate = useNavigate()

  if (compareList.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-dark-800 border-t border-gray-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-400 text-sm font-medium flex-shrink-0">
          <GitCompare className="w-4 h-4 text-primary-500" />
          Compare ({compareList.length}/3)
        </div>

        <div className="flex items-center gap-3 flex-1 overflow-x-auto">
          {compareList.map(product => (
            <div key={product.id} className="flex items-center gap-2 bg-dark-700 border border-gray-700 rounded-lg px-3 py-1.5 flex-shrink-0">
              <img src={product.main_image_url || ''} alt={product.name} className="w-8 h-8 object-cover rounded" />
              <span className="text-white text-xs font-medium max-w-[120px] truncate">{product.name}</span>
              <button onClick={() => toggleCompare(product)} className="text-gray-500 hover:text-red-400 transition-colors ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {compareList.length < 3 && (
            <div className="flex items-center justify-center w-24 h-10 border border-dashed border-gray-600 rounded-lg flex-shrink-0">
              <span className="text-gray-600 text-xs">+ Add</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={clearCompare}
            className="text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-dark-700 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => navigate('/compare')}
            disabled={compareList.length < 2}
            className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
          >
            Compare Now
          </button>
        </div>
      </div>
    </div>
  )
}
