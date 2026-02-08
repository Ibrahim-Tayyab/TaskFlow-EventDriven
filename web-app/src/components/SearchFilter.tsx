'use client'

import { useState } from 'react'

interface SearchFilterProps {
  onSearch: (searchTerm: string) => void
  onCategoryFilter: (category: string) => void
  onPriorityFilter: (priority: string) => void
  onSortChange: (sort: string) => void
  currentCategory: string
  currentPriority: string
  currentSort: string
}

const categories = [
  { value: 'All', emoji: '📋' },
  { value: 'General', emoji: '📁' },
  { value: 'Work', emoji: '💼' },
  { value: 'Personal', emoji: '👤' },
  { value: 'Shopping', emoji: '🛒' },
  { value: 'Health', emoji: '❤️' },
]

const priorities = [
  { value: 'All', emoji: '🔄' },
  { value: 'High', emoji: '🔴' },
  { value: 'Medium', emoji: '🟡' },
  { value: 'Low', emoji: '🟢' },
]

const sortOptions = [
  { value: 'created_at', label: 'Created Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'due_date', label: 'Due Date' },
]

export default function SearchFilter({
  onSearch,
  onCategoryFilter,
  onPriorityFilter,
  onSortChange,
  currentCategory,
  currentPriority,
  currentSort
}: SearchFilterProps) {
  const [search, setSearch] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <svg
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search tasks..."
          className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
        {search && (
          <button
            onClick={() => {
              setSearch('')
              onSearch('')
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category Filter - Horizontal Scroll on Mobile */}
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1 flex-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryFilter(cat.value === 'All' ? '' : cat.value)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 active:scale-95 ${(cat.value === 'All' && !currentCategory) || currentCategory === cat.value
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
            >
              <span className="sm:hidden">{cat.emoji}</span>
              <span className="hidden sm:inline">{cat.emoji} {cat.value}</span>
            </button>
          ))}
        </div>

        {/* Priority & Sort Controls */}
        <div className="flex gap-2">
          {/* Priority Select */}
          <select
            value={currentPriority || 'All'}
            onChange={(e) => onPriorityFilter(e.target.value === 'All' ? '' : e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            {priorities.map(p => (
              <option key={p.value} value={p.value} className="bg-slate-800">{p.emoji} {p.value}</option>
            ))}
          </select>

          {/* Sort Select */}
          <select
            value={currentSort || 'created_at'}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            {sortOptions.map(s => (
              <option key={s.value} value={s.value} className="bg-slate-800">Sort: {s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}