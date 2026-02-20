import React, { useState, KeyboardEvent } from 'react';
import { Button } from './Button';
import { breakDownTask } from '../services/geminiService';

interface TaskInputProps {
  onAddTask: (text: string) => void;
  onAddMultipleTasks: (texts: string[]) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask, onAddMultipleTasks }) => {
  const [inputValue, setInputValue] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onAddTask(inputValue.trim());
      setInputValue('');
      setError(null);
    }
  };

  const handleAddClick = () => {
    if (inputValue.trim()) {
      onAddTask(inputValue.trim());
      setInputValue('');
      setError(null);
    }
  };

  const handleAiBreakdown = async () => {
    if (!inputValue.trim()) return;

    setIsAiLoading(true);
    setError(null);
    try {
      const subtasks = await breakDownTask(inputValue.trim());
      if (subtasks && subtasks.length > 0) {
        onAddMultipleTasks(subtasks);
        setInputValue('');
      } else {
        setError("Could not generate subtasks. Try a clearer description.");
      }
    } catch (err) {
      setError("AI Service unavailable. Please check your connection or API key.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="relative flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          className="w-full px-4 py-4 pr-32 bg-white border border-slate-300 rounded-lg shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-sans text-lg"
        />
        <div className="absolute right-2 flex space-x-1">
           {inputValue.trim().length > 3 && (
            <button
              onClick={handleAiBreakdown}
              disabled={isAiLoading}
              className="flex items-center justify-center p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors disabled:opacity-50"
              title="Break down this task using AI"
            >
              {isAiLoading ? (
                 <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              )}
            </button>
           )}
           <Button variant="primary" onClick={handleAddClick} disabled={!inputValue.trim() || isAiLoading} className="h-10">
            Add
          </Button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}
      <div className="mt-2 flex justify-between items-center px-1">
        <p className="text-xs text-slate-400">
           {inputValue.trim().length > 3 ? "Tip: Click the cube icon to break this task down with AI." : "Start typing to add a task."}
        </p>
      </div>
    </div>
  );
};