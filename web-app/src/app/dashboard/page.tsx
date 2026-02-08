'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import TaskForm from '../../components/TaskForm'
import TaskList from '../../components/TaskList'
import SearchFilter from '../../components/SearchFilter'
import ChatWindow from '../../components/ChatWindow'
import { Task, TaskCreate } from '../../types/task'
import { authService } from '../../services/authService'
import {
  useTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useToggleTaskMutation
} from '../../hooks/useTaskQueries'
import { useReminders } from '../../hooks/useReminders'

type SortOption = 'newest' | 'oldest' | 'priority' | 'alphabetical'

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [authChecked, setAuthChecked] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null) // Add userId for notification filtering
  const [showFilters, setShowFilters] = useState(false)
  const [now, setNow] = useState(new Date())
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  // React Query hooks - Server Side Filtering
  const { data: tasks = [], isLoading: loading } = useTasksQuery(
    searchTerm,
    categoryFilter,
    priorityFilter,
    undefined, // tags filter (not yet in UI state)
    sortBy === 'alphabetical' ? 'description' : (sortBy === 'priority' ? 'priority' : 'created_at'),
    sortBy === 'newest' ? 'desc' : (sortBy === 'oldest' ? 'asc' : 'asc')
  )
  const createTaskMutation = useCreateTaskMutation()
  const updateTaskMutation = useUpdateTaskMutation()
  const deleteTaskMutation = useDeleteTaskMutation()
  const toggleTaskMutation = useToggleTaskMutation()

  // Enable Reminder System with Toast UI - Pass userId for filtering
  const { activeNotification, dismissNotification } = useReminders(tasks, userId || undefined)


  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      if (!isAuth) {
        router.push('/login');
        return;
      }
      const user = authService.getUser();
      if (user) {
        setUserName(user.name || user.email);
        setUserId(user.id); // Store userId for notification filtering
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, [router])

  // Use tasks directly (server filtered)
  const filteredAndSortedTasks = tasks;

  const handleAddTask = async (taskData: TaskCreate) => {
    createTaskMutation.mutate(taskData)
  }

  const handleDelete = async (id: string) => {
    deleteTaskMutation.mutate(id)
  }

  const updateTask = async (updatedTask: Task) => {
    console.log("Dashboard updateTask received:", updatedTask);
    updateTaskMutation.mutate({
      id: updatedTask.id,
      data: {
        description: updatedTask.description,
        completed: updatedTask.completed,
        category: updatedTask.category,
        priority: updatedTask.priority,
        due_date: updatedTask.due_date,
        is_recurring: updatedTask.is_recurring,
        recurrence_pattern: updatedTask.recurrence_pattern
      }
    })
  }

  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    toggleTaskMutation.mutate({ id, completed: !task.completed })
  }

  // Feature 2: Quick Actions
  const markAllComplete = () => {
    const incomplete = tasks.filter(t => !t.completed)
    incomplete.forEach(t => toggleTaskCompletion(t.id))
  }

  const clearCompleted = () => {
    const completed = tasks.filter(t => t.completed)
    completed.forEach(t => handleDelete(t.id))
  }

  if (!authChecked) {
    return (
      <div className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-purple-300 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const highPriorityCount = tasks.filter(t => t.priority === 'High' && !t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Welcome Header - Compact on mobile */}
        <div className="mb-4 sm:mb-8 animate-fadeIn">
          <h1 className="text-xl sm:text-3xl font-bold text-white">
            Hi, <span className="gradient-text">{userName || 'User'}</span> 👋
          </h1>
          <p className="text-slate-400 text-xs sm:text-base mt-0.5 sm:mt-1">Let's get things done!</p>
        </div>

        {/* Stats Cards - 2x2 Grid on mobile */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8">
          <div className="glass-card p-3 sm:p-4 animate-fadeIn">
            <div className="text-center sm:text-left sm:flex sm:items-center sm:gap-3">
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white">{tasks.length}</p>
                <p className="text-[10px] sm:text-xs text-slate-400">Total</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-3 sm:p-4 animate-fadeIn stagger-1">
            <div className="text-center sm:text-left sm:flex sm:items-center sm:gap-3">
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-amber-400">{pendingCount}</p>
                <p className="text-[10px] sm:text-xs text-slate-400">Pending</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-3 sm:p-4 animate-fadeIn stagger-2">
            <div className="text-center sm:text-left sm:flex sm:items-center sm:gap-3">
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-red-400">{highPriorityCount}</p>
                <p className="text-[10px] sm:text-xs text-slate-400">Urgent</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-3 sm:p-4 animate-fadeIn stagger-3">
            <div className="text-center sm:text-left sm:flex sm:items-center sm:gap-3">
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-green-400">{completionRate}%</p>
                <p className="text-[10px] sm:text-xs text-slate-400">Done</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Task Section */}
        <div className="glass-card p-3 sm:p-6 mb-3 sm:mb-6 animate-fadeIn relative z-30">
          <h2 className="text-sm sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-purple-400">+</span>
            Add Task
          </h2>
          <TaskForm onTaskAdded={handleAddTask} />
        </div>

        {/* Quick Actions */}
        {tasks.length > 0 && (
          <div className="mb-3 sm:mb-6 animate-fadeIn relative z-20">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-xs text-slate-400 flex-shrink-0">Quick:</span>
              <button
                onClick={markAllComplete}
                disabled={pendingCount === 0}
                className="flex-shrink-0 px-3 py-1.5 text-xs bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                ✓ Complete All
              </button>
              <button
                onClick={clearCompleted}
                disabled={completedCount === 0}
                className="flex-shrink-0 px-3 py-1.5 text-xs bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                🗑 Clear Done
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-shrink-0 px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${showFilters ? 'bg-purple-600 text-white' : 'bg-white/10 text-slate-300'}`}
              >
                🔍 Filters
              </button>
            </div>
          </div>
        )}

        {/* Search, Filter & Sort */}
        <div className={`overflow-hidden transition-all duration-300 ${showFilters || tasks.length === 0 ? 'max-h-96 mb-3 sm:mb-6' : 'max-h-0'} relative z-20`}>
          <div className="glass-card p-3 sm:p-6 animate-fadeIn">
            <div className="space-y-3 sm:space-y-4">
              <SearchFilter
                onSearch={setSearchTerm}
                onCategoryFilter={setCategoryFilter}
                onPriorityFilter={setPriorityFilter}
                onSortChange={(val) => setSortBy(val as SortOption)}
                currentCategory={categoryFilter || 'All'}
                currentPriority={priorityFilter || 'All'}
                currentSort={sortBy}
              />
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="glass-card p-3 sm:p-6 animate-fadeIn relative z-10 overflow-visible">
          <h2 className="text-sm sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-purple-400">📋</span>
              Tasks
            </span>
            <span className="text-xs sm:text-sm font-normal text-slate-400">
              {filteredAndSortedTasks.length} items
            </span>
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-3 border-purple-500 border-t-transparent"></div>
            </div>
          ) : filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">📝</span>
              </div>
              <p className="text-slate-400 text-sm sm:text-lg">{tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}</p>
              <p className="text-slate-500 text-xs sm:text-sm">{tasks.length === 0 ? 'Add your first task above!' : 'Try adjusting your filters'}</p>
            </div>
          ) : (
            <TaskList
              tasks={filteredAndSortedTasks}
              now={now}
              onUpdateTask={updateTask}
              onDeleteTask={handleDelete}
              onToggleCompletion={toggleTaskCompletion}
            />
          )}
        </div>
      </div>
      <ChatWindow />

      {/* Toast Notification */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-4 sm:bottom-6 sm:right-24 z-[200] bg-slate-800/95 backdrop-blur-md border border-amber-500/50 rounded-xl shadow-2xl p-4 w-[calc(100%-2rem)] sm:w-full max-w-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center animate-pulse">
                <span className="text-xl">🔔</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white">{activeNotification.title}</h4>
                <p className="text-xs text-slate-300 mt-1">{activeNotification.body}</p>
              </div>
              <button
                onClick={dismissNotification}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700/50 hover:bg-red-500/50 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                aria-label="Close notification"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}