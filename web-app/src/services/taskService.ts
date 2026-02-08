import { Task, TaskCreate, TaskUpdate } from '../types/task'
import { authService } from './authService'

// API calls go directly to FastAPI backend with JWT auth
// Force relative path in production if API URL is set to localhost (common configuration error)
// Force relative path in production to use Next.js proxy
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');

class TaskService {
  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...authService.getAuthHeader(),
    };
  }

  async getAllTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      headers: this.getHeaders(),
      cache: 'no-store',
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in to view your tasks')
      }
      throw new Error('Failed to fetch tasks')
    }
    return response.json()
  }

  async getAllTasksWithFilters(
    search?: string,
    category?: string,
    priority?: string,
    tags?: string[],
    sort_by?: string,
    order?: 'asc' | 'desc'
  ): Promise<Task[]> {
    let url = `${API_BASE_URL}/api/tasks`
    const params = new URLSearchParams()

    if (search) params.append('search', search)
    if (category) params.append('category', category)
    if (priority) params.append('priority', priority)
    if (sort_by) params.append('sort_by', sort_by)
    if (order) params.append('order', order)

    if (tags && tags.length > 0) {
      tags.forEach(tag => params.append('tags', tag))
    }

    // Add timestamp to prevent caching artifacts
    params.append('_t', Date.now().toString())

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    const response = await fetch(url, {
      headers: this.getHeaders(),
      cache: 'no-store', // Ensure fresh data
    })
    if (!response.ok) {
      throw new Error('Failed to fetch tasks')
    }
    return response.json()
  }

  async createTask(taskData: TaskCreate): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(taskData),
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in to create tasks')
      }
      throw new Error('Failed to create task')
    }
    return response.json()
  }

  async updateTask(id: string, taskData: TaskUpdate): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(taskData),
    })
    if (!response.ok) {
      throw new Error('Failed to update task')
    }
    return response.json()
  }

  async completeTask(id: string, completed: boolean): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}/complete`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ completed }),
    })
    if (!response.ok) {
      throw new Error('Failed to update task completion status')
    }
    return response.json()
  }

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    if (!response.ok) {
      throw new Error('Failed to delete task')
    }
  }
}

export const taskService = new TaskService()