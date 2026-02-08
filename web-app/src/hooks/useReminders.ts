import { useEffect, useState, useCallback, useRef } from 'react';
import { Task } from '../types/task';

export interface ReminderNotification {
    id: string;
    title: string;
    body: string;
    task_id: string;
}

// LocalStorage key for storing dismissed notifications
const DISMISSED_NOTIFICATIONS_KEY = 'taskflow_dismissed_notifications';

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Helper to get dismissed notifications from localStorage
const getDismissedNotifications = (): Set<string> => {
    if (!isBrowser) return new Set();
    try {
        const stored = localStorage.getItem(DISMISSED_NOTIFICATIONS_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Clean old entries (older than 24 hours)
            const now = Date.now();
            const filtered = Object.entries(parsed)
                .filter(([_, timestamp]) => now - (timestamp as number) < 24 * 60 * 60 * 1000)
                .map(([key]) => key);
            return new Set(filtered);
        }
    } catch (e) {
        // Silently fail on SSR
    }
    return new Set();
};

// Helper to save dismissed notification to localStorage
const saveDismissedNotification = (taskId: string) => {
    if (!isBrowser) return;
    try {
        const stored = localStorage.getItem(DISMISSED_NOTIFICATIONS_KEY);
        const parsed = stored ? JSON.parse(stored) : {};
        parsed[taskId] = Date.now();
        localStorage.setItem(DISMISSED_NOTIFICATIONS_KEY, JSON.stringify(parsed));
    } catch (e) {
        // Silently fail
    }
};

// Accept userId to filter notifications for current user only
export function useReminders(tasks: Task[], userId?: string) {
    // Use ref to persist notified tasks across renders without causing re-renders
    const notifiedTasksRef = useRef<Set<string>>(new Set());
    const [activeNotification, setActiveNotification] = useState<ReminderNotification | null>(null);

    // Initialize notifiedTasks from localStorage on client-side only
    useEffect(() => {
        if (isBrowser) {
            notifiedTasksRef.current = getDismissedNotifications();
        }
    }, []);

    // Sound Alert Helper
    const playNotificationSound = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime); // High beep
            gain.gain.setValueAtTime(0.1, ctx.currentTime);

            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } catch (e) {
            console.error("Audio playback failed", e);
        }
    };

    useEffect(() => {
        // Request permission on mount
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Local check function (fallback and immediate UI feedback)
        const checkLocalReminders = () => {
            const now = new Date();
            const notifiedTasks = notifiedTasksRef.current;

            tasks.forEach(task => {
                if (task.completed || !task.due_date) return;
                const taskIdStr = String(task.id);
                if (notifiedTasks.has(taskIdStr)) return; // Already notified

                const dueDate = new Date(task.due_date);
                const timeDiff = dueDate.getTime() - now.getTime();

                // SKIP notifications for tasks that are more than 2 minutes old
                if (timeDiff < -2 * 60 * 1000) {
                    notifiedTasks.add(taskIdStr);
                    saveDismissedNotification(taskIdStr);
                    return;
                }

                // Show notification when:
                // 1. Time is due now (timeDiff <= 0) or within next 5 seconds
                // 2. And not older than 2 minutes
                const shouldNotify = timeDiff <= 5000 && timeDiff >= -2 * 60 * 1000;

                if (shouldNotify && !task.notification_sent) {
                    // Show Notification locally
                    const title = `TaskFlow: ${task.description}`;
                    const body = `Due at ${dueDate.toLocaleTimeString()}`;

                    console.log("[useReminders] Triggering OS Notification (Local):", title, body);

                    if (Notification.permission === 'granted') {
                        try {
                            new Notification(title, { body, icon: '/icon.png' });
                            playNotificationSound();
                        } catch (e) {
                            console.error("Local Notification failed:", e);
                        }
                    }

                    setActiveNotification({
                        id: `local-${taskIdStr}`,
                        title,
                        body,
                        task_id: taskIdStr
                    });

                    notifiedTasks.add(taskIdStr);
                    saveDismissedNotification(taskIdStr);
                }
            });
        };

        // Backend Polling function - only fetch current user's notifications
        const pollBackendNotifications = async () => {
            if (!userId) return; // Don't poll if no user logged in
            const notifiedTasks = notifiedTasksRef.current;

            try {
                // Include userId to filter notifications for current user only
                const res = await fetch(`/api/events/notifications?limit=10&user_id=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.notifications && Array.isArray(data.notifications)) {
                        const now = Date.now();

                        data.notifications.forEach((n: any) => {
                            const taskIdStr = String(n.task_id);
                            if (notifiedTasks.has(taskIdStr)) return; // Already notified

                            // Find the matching task from our local list
                            const task = tasks.find(t => String(t.id) === taskIdStr);
                            if (!task || !task.due_date) return; // Skip if task not found

                            const dueTime = new Date(task.due_date).getTime();
                            const timeDiff = dueTime - now;

                            // SKIP notifications for tasks that are more than 2 minutes old
                            // Only show fresh, on-time notifications
                            if (timeDiff < -2 * 60 * 1000) {
                                console.log(`[useReminders] Skipping old notification for task ${taskIdStr}`);
                                notifiedTasks.add(taskIdStr);
                                saveDismissedNotification(taskIdStr);
                                return;
                            }

                            // If due more than 1s in future, delay the notification
                            if (timeDiff > 1000) {
                                console.log(`[useReminders] Delaying notification for ${n.title} by ${timeDiff}ms`);
                                setTimeout(() => {
                                    if (notifiedTasks.has(taskIdStr)) return;
                                    triggerBackendNotification(n);
                                    notifiedTasks.add(taskIdStr);
                                    saveDismissedNotification(taskIdStr);
                                }, timeDiff);
                                return;
                            }

                            // Task is due now, show immediately
                            triggerBackendNotification(n);
                            notifiedTasks.add(taskIdStr);
                            saveDismissedNotification(taskIdStr);
                        });
                    }
                }
            } catch (err) {
                // Silently handle errors (no spam in console)
            }
        };

        const triggerBackendNotification = (n: any) => {
            console.log("[useReminders] Triggering OS Notification (Backend):", n.title);
            if (Notification.permission === 'granted') {
                try {
                    new Notification(n.title, {
                        body: n.body,
                        icon: '/icon.png',
                        requireInteraction: true
                    });
                    playNotificationSound();
                } catch (e) {
                    console.error("Backend Notification failed:", e);
                }
            }
            setActiveNotification({
                id: String(n.id),
                title: n.title,
                body: n.body,
                task_id: String(n.task_id)
            });
        };

        // Check every 1 second for exact timing (more responsive)
        const localInterval = setInterval(checkLocalReminders, 1000);

        // Poll backend every 5 seconds (Optimized for performance)
        const pollInterval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                pollBackendNotifications();
            }
        }, 5000);

        // Initial checks
        checkLocalReminders();
        pollBackendNotifications();

        return () => {
            clearInterval(localInterval);
            clearInterval(pollInterval);
        };
    }, [tasks, userId]); // Dependencies: tasks and userId

    // Dismiss notification and save to localStorage
    const dismissNotification = useCallback(() => {
        if (activeNotification) {
            const taskId = activeNotification.task_id;
            notifiedTasksRef.current.add(taskId);
            saveDismissedNotification(taskId);
        }
        setActiveNotification(null);
    }, [activeNotification]);

    return {
        activeNotification,
        dismissNotification
    };
}
