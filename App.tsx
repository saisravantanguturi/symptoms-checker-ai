
import React, { useState, useCallback } from 'react';
import { SymptomInput } from './components/SymptomInput';
import { ResultDisplay } from './components/ResultDisplay';
import { getSymptomAnalysis } from './services/geminiService';
import { AnalysisResult, UserInputSymptom } from './types';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckSymptoms = useCallback(async (symptoms: UserInputSymptom[]) => {
    if (symptoms.length === 0) {
      setError('Please add at least one symptom to receive an analysis.');
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);

    const symptomsString = symptoms.map(s => `${s.severity} ${s.name}`).join(', ');

    try {
      const analysis = await getSymptomAnalysis(symptomsString);
      setResult(analysis);
// FIX: Added curly braces to the catch block to fix syntax error.
    } catch (err) {
      setError('Sorry, an unexpected error occurred. Please check your connection and try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen text-slate-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex flex-col items-center justify-center gap-3 mb-4">
            <img 
              src="https://i.ibb.co/chp96cCn/Picsart-25-10-15-21-39-49-590.png" 
              alt="Symptom Checker AI Logo" 
              className="h-28 w-28 object-contain"
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Symptom Checker AI
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Your First Step Toward Better Health.
          </p>
        </header>

        <main>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
            <SymptomInput onSubmit={handleCheckSymptoms} isLoading={isLoading} />
          </div>
          <div className="mt-8">
            <ResultDisplay result={result} isLoading={isLoading} error={error} />
          </div>
        </main>

        <footer className="mt-12 text-center text-xs text-slate-500">
          <p className="font-semibold mb-2">
            Disclaimer: This tool is for informational purposes only.
          </p>
          <p>
            The information provided is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
