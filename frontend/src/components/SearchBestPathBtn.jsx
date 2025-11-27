import React from 'react'

export default function SearchBestPathBtn({ onClick, disabled=false, className='', children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors ${className}`}
    >
      {children || 'Search'}
    </button>
  )
}
