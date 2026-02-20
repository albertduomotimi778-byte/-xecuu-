import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div className={`group flex items-center justify-between p-4 mb-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ${task.completed ? 'opacity-75 bg-slate-50' : ''}`}>
      <div className="flex items-center flex-1 gap-4">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-800 checked:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          />
          <svg
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 text-white w-3 h-3 transition-opacity duration-200"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        
        <span 
          className={`text-slate-800 font-sans text-base transition-all duration-300 ${
            task.completed ? 'line-through text-slate-400' : ''
          }`}
        >
          {task.text}
        </span>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 focus:outline-none focus:opacity-100"
        aria-label="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  );
};