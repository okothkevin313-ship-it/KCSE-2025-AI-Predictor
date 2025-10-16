
import React from 'react';
import { type Subject } from '../types';
import { TOPICS } from '../constants';
import { SpinnerIcon } from './icons';

interface ControlPanelProps {
  subject: Subject;
  setSubject: (subject: Subject) => void;
  topic: string;
  setTopic: (topic: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  subject,
  setSubject,
  topic,
  setTopic,
  onGenerate,
  isLoading,
}) => {
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubject = e.target.value as Subject;
    setSubject(newSubject);
    setTopic(TOPICS[newSubject][0]); // Reset topic to the first in the list for the new subject
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-1">
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Subject
          </label>
          <select
            id="subject"
            value={subject}
            onChange={handleSubjectChange}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="Chemistry">Chemistry</option>
            <option value="Mathematics">Mathematics</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Topic
          </label>
          <select
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            {TOPICS[subject].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Generating...
            </>
          ) : (
            'Generate Prediction Questions'
          )}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
