'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Task } from '../types/task'

interface TaskItemProps {
  task: Task
  now: Date
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
}

const categories = ['General', 'Work', 'Personal', 'Shopping', 'Health']
const priorities = ['High', 'Medium', 'Low']

export default function TaskItem({ task, now, onUpdate, onDelete, onToggleComplete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedDescription, setEditedDescription] = useState(task.description)
  const [editedDueDate, setEditedDueDate] = useState(task.due_date || '')
  const [editedIsRecurring, setEditedIsRecurring] = useState(task.is_recurring)
  const [editedRecurrencePattern, setEditedRecurrencePattern] = useState(task.recurrence_pattern || 'daily')

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom')
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const priorityBtnRef = useRef<HTMLButtonElement>(null)
  const categoryBtnRef = useRef<HTMLButtonElement>(null)

  // Calculate dropdown position and coordinates
  const calculateDropdownPosition = (btnRef: React.RefObject<HTMLButtonElement>) => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const spaceBelow = windowHeight - rect.bottom
      const openUp = spaceBelow < 200

      setDropdownPosition(openUp ? 'top' : 'bottom')
      setDropdownCoords({
        top: openUp ? rect.top - 8 : rect.bottom + 4,
        left: rect.left
      })
    }
  }

  // Legacy function for compatibility
  const checkDropdownPosition = (btnRef: React.RefObject<HTMLButtonElement>) => {
    calculateDropdownPosition(btnRef)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false)
        setShowPriorityDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSave = () => {
    if (editedDescription.trim()) {
      const payload = {
        ...task,
        description: editedDescription.trim(),
        due_date: editedDueDate || undefined,
        is_recurring: editedIsRecurring,
        recurrence_pattern: editedIsRecurring ? editedRecurrencePattern : undefined
      } as Task
      console.log("TaskItem handleSave payload:", payload)
      onUpdate(payload)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedDescription(task.description)
    setEditedDueDate(task.due_date || '')
    setEditedIsRecurring(task.is_recurring)
    setEditedRecurrencePattern(task.recurrence_pattern || 'daily')
    setIsEditing(false)
  }

  const handleCategoryChange = (newCategory: string) => {
    onUpdate({ ...task, category: newCategory })
    setShowCategoryDropdown(false)
  }

  const handlePriorityChange = (newPriority: string) => {
    onUpdate({ ...task, priority: newPriority })
    setShowPriorityDropdown(false)
  }

  const priorityColors: { [key: string]: string } = {
    High: 'from-red-500 to-pink-500',
    Medium: 'from-amber-500 to-orange-500',
    Low: 'from-green-500 to-emerald-500'
  }

  const priorityEmojis: { [key: string]: string } = {
    High: '🔴',
    Medium: '🟡',
    Low: '🟢'
  }

  const categoryEmojis: { [key: string]: string } = {
    General: '📁',
    Work: '💼',
    Personal: '👤',
    Shopping: '🛒',
    Health: '❤️'
  }

  const categoryColors: { [key: string]: string } = {
    General: 'from-slate-500 to-slate-600',
    Work: 'from-blue-500 to-cyan-500',
    Personal: 'from-purple-500 to-pink-500',
    Shopping: 'from-orange-500 to-amber-500',
    Health: 'from-rose-500 to-red-500'
  }

  const isDropdownOpen = showCategoryDropdown || showPriorityDropdown

  return (
    <div
      className={`glass-card p-3 sm:p-4 transition-all duration-200 overflow-visible ${task.completed ? 'opacity-50' : ''} ${isDropdownOpen ? 'relative z-[9999]' : 'relative z-0'}`}
      ref={containerRef}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        {/* Toggle Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-lg border-2 transition-all duration-300 flex items-center justify-center active:scale-90 ${task.completed
            ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-transparent'
            : 'border-slate-500 hover:border-purple-500 active:border-purple-400'
            }`}
        >
          {task.completed && (
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Edit Mode vs View Mode */}
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="w-full px-3 py-2 text-sm bg-white/10 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
                autoFocus
                placeholder="Task description..."
              />

              <div className="flex flex-wrap gap-2">
                <input
                  type="datetime-local"
                  value={editedDueDate}
                  onChange={(e) => setEditedDueDate(e.target.value)}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                />

                <div className="flex items-center gap-2 px-2 bg-white/5 border border-white/10 rounded-lg">
                  <input
                    type="checkbox"
                    id={`edit-recur-${task.id}`}
                    checked={editedIsRecurring}
                    onChange={(e) => setEditedIsRecurring(e.target.checked)}
                    className="w-3.5 h-3.5"
                  />
                  <label htmlFor={`edit-recur-${task.id}`} className="text-white text-xs whitespace-nowrap">Recurring</label>

                  {editedIsRecurring && (
                    <select
                      value={editedRecurrencePattern}
                      onChange={(e) => setEditedRecurrencePattern(e.target.value)}
                      className="ml-1 bg-slate-800 text-white text-xs rounded border border-white/10 px-1 py-0.5 outline-none"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button onClick={handleCancel} className="px-3 py-1 text-xs text-slate-300 hover:bg-white/10 rounded-lg">Cancel</button>
                <button onClick={handleSave} className="px-3 py-1 text-xs bg-purple-600 text-white hover:bg-purple-500 rounded-lg">SAVE (TEST)</button>
              </div>
            </div>
          ) : (
            <>
              <p
                className={`text-sm leading-relaxed break-words line-clamp-2 cursor-pointer hover:text-purple-300 transition-colors ${task.completed ? 'text-slate-500 line-through' : 'text-white'
                  }`}
                onClick={() => !task.completed && setIsEditing(true)}
                title="Click to edit task"
              >
                {task.description}
              </p>

              {/* Tags - Vertical on mobile, Horizontal on desktop */}
              <div className="flex flex-col items-start gap-2 mt-2 sm:flex-row sm:items-center sm:gap-2 overflow-visible">
                {/* Badge Group */}
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  {/* Priority Tag */}
                  <div className="relative flex-shrink-0">
                    <button
                      ref={priorityBtnRef}
                      onClick={() => {
                        if (!task.completed) {
                          checkDropdownPosition(priorityBtnRef)
                          setShowPriorityDropdown(!showPriorityDropdown)
                          setShowCategoryDropdown(false)
                        }
                      }}
                      disabled={task.completed}
                      className={`text-xs px-3 py-1.5 sm:py-1 rounded-full bg-gradient-to-r ${priorityColors[task.priority]} text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 min-h-[32px] sm:min-h-0 flex items-center`}
                    >
                      {priorityEmojis[task.priority]} {task.priority}
                    </button>
                    {/* Priority Dropdown - Portal */}
                    {showPriorityDropdown && typeof document !== 'undefined' && createPortal(
                      <div
                        className="fixed bg-slate-800 border border-white/10 rounded-lg shadow-2xl min-w-[120px]"
                        style={{
                          top: dropdownPosition === 'top' ? 'auto' : dropdownCoords.top,
                          bottom: dropdownPosition === 'top' ? window.innerHeight - dropdownCoords.top + 4 : 'auto',
                          left: dropdownCoords.left,
                          zIndex: 99999
                        }}
                      >
                        {priorities.map(p => (
                          <button
                            key={p}
                            onClick={() => handlePriorityChange(p)}
                            className={`w-full px-3 py-2 text-xs text-left text-white hover:bg-white/10 flex items-center gap-2 ${task.priority === p ? 'bg-white/5' : ''}`}
                          >
                            {priorityEmojis[p]} {p}
                          </button>
                        ))}
                      </div>,
                      document.body
                    )}
                  </div>

                  {/* Category Tag */}
                  <div className="relative flex-shrink-0">
                    <button
                      ref={categoryBtnRef}
                      onClick={() => {
                        if (!task.completed) {
                          checkDropdownPosition(categoryBtnRef)
                          setShowCategoryDropdown(!showCategoryDropdown)
                          setShowPriorityDropdown(false)
                        }
                      }}
                      disabled={task.completed}
                      className={`text-xs px-3 py-1.5 sm:py-1 rounded-full bg-gradient-to-r ${categoryColors[task.category] || 'from-slate-500 to-slate-600'} text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 min-h-[32px] sm:min-h-0 flex items-center`}
                    >
                      {categoryEmojis[task.category] || '📁'} {task.category}
                    </button>
                    {/* Category Dropdown - Portal */}
                    {showCategoryDropdown && typeof document !== 'undefined' && createPortal(
                      <div
                        className="fixed bg-slate-800 border border-white/10 rounded-lg shadow-2xl min-w-[120px]"
                        style={{
                          top: dropdownPosition === 'top' ? 'auto' : dropdownCoords.top,
                          bottom: dropdownPosition === 'top' ? window.innerHeight - dropdownCoords.top + 4 : 'auto',
                          left: dropdownCoords.left,
                          zIndex: 99999
                        }}
                      >
                        {categories.map(c => (
                          <button
                            key={c}
                            onClick={() => handleCategoryChange(c)}
                            className={`w-full px-3 py-2 text-xs text-left text-white hover:bg-white/10 flex items-center gap-2 ${task.category === c ? 'bg-white/5' : ''}`}
                          >
                            {categoryEmojis[c] || '📁'} {c}
                          </button>
                        ))}
                      </div>,
                      document.body
                    )}
                  </div>
                </div>

                {/* Metadata Group */}
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  {/* Recurrence Badge */}
                  {task.is_recurring && (
                    <span className="text-xs px-3 py-1.5 sm:py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 min-h-[32px] sm:min-h-0">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {task.recurrence_pattern || 'Recurring'}
                    </span>
                  )}

                  {/* Due Date & Reminder Badge */}
                  {task.due_date && (
                    <span className={`text-xs px-3 py-1.5 sm:py-1 rounded-full border flex items-center gap-1 min-h-[32px] sm:min-h-0 ${new Date(task.due_date) < now && !task.completed
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-slate-700/50 text-slate-300 border-white/10'
                      }`}>
                      <svg className="w-3 h-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <span className="inline text-slate-400 mr-1">Due:</span>
                      {new Date(task.due_date).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Delete / View Actions */}
        {!isEditing && (
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all active:scale-90"
              aria-label="Edit task"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-90"
              aria-label="Delete task"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}