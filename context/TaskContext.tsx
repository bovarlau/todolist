"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, FilterType } from '@/types';
import { generateId } from '@/lib/utils';

interface TaskContextType {
  tasks: Task[];
  filter: FilterType;
  searchQuery: string;
  setFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
  addTask: (title: string, description?: string, dueDate?: string | null, important?: boolean) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  toggleImportant: (id: string) => void;
  reorderTasks: (activeId: string, overId: string) => void;
  filteredTasks: Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = 'todolist_tasks';

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse tasks:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((
    title: string,
    description: string = '',
    dueDate: string | null = null,
    important: boolean = false
  ) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: generateId(),
      title,
      description,
      completed: false,
      important,
      dueDate,
      createdAt: now,
      updatedAt: now,
      order: tasks.length,
    };
    setTasks(prev => [...prev, newTask]);
  }, [tasks.length]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
        : task
    ));
  }, []);

  const toggleImportant = useCallback((id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id
        ? { ...task, important: !task.important, updatedAt: new Date().toISOString() }
        : task
    ));
  }, []);

  const reorderTasks = useCallback((activeId: string, overId: string) => {
    setTasks(prev => {
      const oldIndex = prev.findIndex(t => t.id === activeId);
      const newIndex = prev.findIndex(t => t.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;

      const newTasks = [...prev];
      const [removed] = newTasks.splice(oldIndex, 1);
      newTasks.splice(newIndex, 0, removed);

      return newTasks.map((task, index) => ({ ...task, order: index }));
    });
  }, []);

  const filteredTasks = tasks
    .filter(task => {
      // Filter by category
      switch (filter) {
        case 'today':
          if (!task.dueDate) return false;
          const d = new Date(task.dueDate);
          const today = new Date();
          return d.getDate() === today.getDate() &&
                 d.getMonth() === today.getMonth() &&
                 d.getFullYear() === today.getFullYear();
        case 'important':
          return task.important && !task.completed;
        case 'completed':
          return task.completed;
        default:
          return !task.completed;
      }
    })
    .filter(task => {
      // Filter by search
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return task.title.toLowerCase().includes(query) ||
             task.description.toLowerCase().includes(query);
    })
    .sort((a, b) => a.order - b.order);

  return (
    <TaskContext.Provider value={{
      tasks,
      filter,
      searchQuery,
      setFilter,
      setSearchQuery,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      toggleImportant,
      reorderTasks,
      filteredTasks,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
