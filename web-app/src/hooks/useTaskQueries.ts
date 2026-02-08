import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService } from '@/services/taskService'
import { Task, TaskCreate, TaskUpdate } from '@/types/task'

// Query hook for fetching tasks
export function useTasksQuery(
    searchTerm?: string,
    categoryFilter?: string,
    priorityFilter?: string,
    tagsFilter?: string[],
    sortBy?: string,
    order?: 'asc' | 'desc'
) {
    return useQuery({
        queryKey: ['tasks', searchTerm, categoryFilter, priorityFilter, tagsFilter, sortBy, order],
        queryFn: () => taskService.getAllTasksWithFilters(
            searchTerm,
            categoryFilter,
            priorityFilter,
            tagsFilter,
            sortBy,
            order
        ),
        staleTime: 1000 * 10, // 10 seconds
    })
}

// Mutation hook for creating a task
export function useCreateTaskMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (taskData: TaskCreate) => taskService.createTask(taskData),
        onMutate: async (newTask) => {
            await queryClient.cancelQueries({ queryKey: ['tasks'] });
            const previousTasks = queryClient.getQueriesData<Task[]>({ queryKey: ['tasks'] });

            const tempTask: Task = {
                id: Math.random().toString(),
                description: newTask.description,
                category: newTask.category ?? "General",
                priority: newTask.priority ?? "medium",
                tags: newTask.tags ?? [],
                due_date: newTask.due_date ?? undefined,
                recurrence_pattern: newTask.recurrence_pattern ?? undefined,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                completed: false,
                is_recurring: newTask.is_recurring ?? false,
                notification_sent: false
            };

            queryClient.setQueriesData<Task[]>({ queryKey: ['tasks'] }, (old) => {
                return old ? [tempTask, ...old] : [tempTask];
            });

            return { previousTasks };
        },
        onError: (err, newTask, context) => {
            if (context?.previousTasks) {
                context.previousTasks.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
    })
}

// Mutation hook for updating a task
export function useUpdateTaskMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TaskUpdate }) =>
            taskService.updateTask(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ['tasks'] });

            // Snapshot previous value
            const previousTasks = queryClient.getQueriesData<Task[]>({ queryKey: ['tasks'] });

            // Optimistically update to the new value
            queryClient.setQueriesData<Task[]>({ queryKey: ['tasks'] }, (old) => {
                if (!old) return [];
                return old.map(task =>
                    task.id === id ? {
                        ...task,
                        ...data,
                        due_date: data.due_date ?? task.due_date ?? undefined,
                        recurrence_pattern: data.recurrence_pattern ?? task.recurrence_pattern ?? undefined
                    } : task
                );
            });

            return { previousTasks };
        },
        onError: (err, newTodo, context) => {
            // Rollback
            if (context?.previousTasks) {
                context.previousTasks.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
            console.error("Mutation Failed:", err);
            alert("Failed to save task: " + err.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    })
}

// Mutation hook for toggling task completion
export function useToggleTaskMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
            taskService.completeTask(id, completed),
        onMutate: async ({ id, completed }) => {
            await queryClient.cancelQueries({ queryKey: ['tasks'] });

            const previousTasks = queryClient.getQueriesData<Task[]>({ queryKey: ['tasks'] });

            queryClient.setQueriesData<Task[]>({ queryKey: ['tasks'] }, (old) => {
                if (!old) return [];
                return old.map(task =>
                    task.id === id ? { ...task, completed } : task
                );
            });

            return { previousTasks };
        },
        onError: (err, newTodo, context) => {
            if (context?.previousTasks) {
                context.previousTasks.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    })
}

// Mutation hook for deleting a task
export function useDeleteTaskMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => taskService.deleteTask(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['tasks'] });

            const previousTasks = queryClient.getQueriesData<Task[]>({ queryKey: ['tasks'] });

            queryClient.setQueriesData<Task[]>({ queryKey: ['tasks'] }, (old) => {
                if (!old) return [];
                return old.filter(task => task.id !== id);
            });

            return { previousTasks };
        },
        onError: (err, id, context) => {
            if (context?.previousTasks) {
                context.previousTasks.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    })
}

// Hook to manually invalidate tasks (for chatbot integration)
export function useInvalidateTasks() {
    const queryClient = useQueryClient()

    return () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
}
