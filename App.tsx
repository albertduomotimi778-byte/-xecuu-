import React, { useState, useEffect, useMemo } from 'react';
import { Task, FilterType } from './types';
import { TaskInput } from './components/TaskInput';
import { TaskItem } from './components/TaskItem';
import { Button } from './components/Button';

// Utility to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const [isLoading, setIsLoading] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('executive-checklist-data');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse tasks", e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('executive-checklist-data', JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  const addTask = (text: string) => {
    const newTask: Task = {
      id: generateId(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const addMultipleTasks = (texts: string[]) => {
    const newTasks = texts.map(text => ({
      id: generateId(),
      text,
      completed: false,
      createdAt: Date.now(),
    })).reverse(); // Reverse so they appear in order at top
    setTasks(prev => [...newTasks, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
  };

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case FilterType.ACTIVE:
        return tasks.filter(t => !t.completed);
      case FilterType.COMPLETED:
        return tasks.filter(t => t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const completedCount = tasks.filter(t => t.completed).length;
  const activeCount = tasks.length - completedCount;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2 tracking-tight">
            Executive Checklist
          </h1>
          <p className="text-slate-500 text-sm tracking-wide uppercase">
            Stay Organized &bull; Stay Focused
          </p>
        </header>

        {/* Main Card */}
        <main className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8">
            <TaskInput onAddTask={addTask} onAddMultipleTasks={addMultipleTasks} />
            
            {/* Filter Tabs */}
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <div className="flex space-x-1">
                {(Object.keys(FilterType) as Array<keyof typeof FilterType>).map((key) => (
                  <button
                    key={key}
                    onClick={() => setFilter(FilterType[key])}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      filter === FilterType[key]
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-1 min-h-[200px]">
              {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <p className="text-sm font-medium">No tasks found</p>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                ))
              )}
            </div>
          </div>

          {/* Footer actions */}
          {completedCount > 0 && (
             <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-end">
                <Button variant="ghost" onClick={clearCompleted} className="text-xs">
                  Clear Completed
                </Button>
             </div>
          )}
        </main>

        <footer className="mt-12 text-center text-slate-400 text-xs">
          <p>&copy; {new Date().getFullYear()} Executive Checklist. Built with React & Gemini.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;