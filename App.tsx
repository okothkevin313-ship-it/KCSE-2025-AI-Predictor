
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import QuestionDisplay from './components/QuestionDisplay';
import Footer from './components/Footer';
import { generateKcseQuestions } from './services/geminiService';
import { type Question, type Subject } from './types';
import { TOPICS } from './constants';

const App: React.FC = () => {
  const [subject, setSubject] = useState<Subject>('Chemistry');
  const [topic, setTopic] = useState<string>(TOPICS.Chemistry[0]);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setQuestions(null);
    try {
      const result = await generateKcseQuestions(subject, topic);
      setQuestions(result.questions);
    // FIX: Add missing opening brace for the catch block.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [subject, topic]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <ControlPanel
            subject={subject}
            setSubject={setSubject}
            topic={topic}
            setTopic={setTopic}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          <QuestionDisplay
            questions={questions}
            isLoading={isLoading}
            error={error}
            subject={subject}
            topic={topic}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
