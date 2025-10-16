import React, { useState, useRef } from 'react';
import { type Question, type Subject } from '../types';
import { SpinnerIcon, LightBulbIcon, ExclamationTriangleIcon, DownloadIcon } from './icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


interface QuestionDisplayProps {
  questions: Question[] | null;
  isLoading: boolean;
  error: string | null;
  subject: Subject;
  topic: string;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ questions, isLoading, error, subject, topic }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const printableRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const elementToPrint = printableRef.current;
    if (!elementToPrint) {
        setPdfError("Could not find content to generate PDF from.");
        return;
    };

    setIsDownloading(true);
    setPdfError(null); // Clear previous errors on a new attempt

    try {
      // html2canvas renders the DOM as is, respecting the current theme (dark/light).
      // The backgroundColor provides a fallback for the page background itself.
      const canvas = await html2canvas(elementToPrint, {
        scale: 2, // Improve image quality
        useCORS: true,
        backgroundColor: document.body.classList.contains('dark') ? '#0f172a' : '#f1f5f9',
        // Ignore the container with the download button and error message
        ignoreElements: (element) => element.id === 'pdf-controls',
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [canvas.width, canvas.height],
        hotfixes: ['px_scaling'],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const fileName = `KCSE_2025_${subject}_${topic.replace(/\s+/g, '_')}_Predictions.pdf`;
      pdf.save(fileName);

    } catch (err) {
      console.error("Failed to generate PDF:", err);
      setPdfError("Sorry, we couldn't generate the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-10 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <div className="flex justify-center items-center">
          <SpinnerIcon className="animate-spin h-8 w-8 text-blue-600" />
        </div>
        <p className="mt-4 text-lg font-medium">Generating questions...</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">AI is working its magic. This may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg shadow-md">
        <div className="flex justify-center items-center">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
        </div>
        <p className="mt-4 text-lg font-bold text-red-700 dark:text-red-300">An Error Occurred</p>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!questions) {
    return (
      <div className="text-center p-10 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <div className="flex justify-center items-center">
          <LightBulbIcon className="h-10 w-10 text-yellow-500" />
        </div>
        <h2 className="mt-4 text-xl font-semibold">Welcome to the KCSE Predictor</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Select a subject and a topic above, then click "Generate" to get your AI-powered prediction questions.
        </p>
      </div>
    );
  }

  return (
    <div ref={printableRef}>
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">Generated Prediction Questions</h2>
        <div id="pdf-controls" className="text-right">
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {isDownloading ? (
              <>
                <SpinnerIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Downloading...
              </>
            ) : (
              <>
                <DownloadIcon className="-ml-1 mr-2 h-5 w-5" />
                Download PDF
              </>
            )}
          </button>
          {pdfError && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">{pdfError}</p>
          )}
        </div>
      </div>
      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.questionNumber} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400">
                Question {q.questionNumber}
              </h3>
              <span className="text-sm font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full">
                {q.totalMarks} Marks
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap mb-6">{q.questionText}</p>
            
            <div>
              <h4 className="font-semibold text-md mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">Marking Scheme</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-2 font-medium w-3/4">Step / Answer</th>
                      <th className="px-4 py-2 font-medium">Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {q.markingScheme.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{item.step}</td>
                        <td className="px-4 py-2 font-mono text-center">{item.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionDisplay;