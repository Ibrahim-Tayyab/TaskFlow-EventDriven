'use client'

import { Task } from '../types/task'
import TaskItem from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  now: Date
  onUpdateTask: (task: Task) => void
  onDeleteTask: (id: string) => void
  onToggleCompletion: (id: string) => void
}

export default function TaskList({ tasks, now, onUpdateTask, onDeleteTask, onToggleCompletion }: TaskListProps) {
  return (
    <div className="space-y-3 overflow-visible">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="animate-fadeIn overflow-visible"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <TaskItem
            task={task}
            now={now}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
            onToggleComplete={onToggleCompletion}
          />
        </div>
      ))}
    </div>
  )
}