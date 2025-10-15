import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, XCircleIcon } from './icons';
import { UserInputSymptom } from '../types';
import { symptomList } from '../data/symptoms';

interface SymptomInputProps {
  onSubmit: (symptoms: UserInputSymptom[]) => void;
  isLoading: boolean;
}

type Severity = 'Mild' | 'Moderate' | 'Severe';

const severityLevels: Severity[] = ['Mild', 'Moderate', 'Severe'];

const severityStyles: Record<Severity, { selected: string; unselected: string }> = {
  Mild: {
    selected: 'bg-green-600 text-white shadow',
    unselected: 'bg-slate-100 text-slate-700 hover:bg-green-100'
  },
  Moderate: {
    selected: 'bg-yellow-500 text-white shadow',
    unselected: 'bg-slate-100 text-slate-700 hover:bg-yellow-100'
  },
  Severe: {
    selected: 'bg-red-600 text-white shadow',
    unselected: 'bg-slate-100 text-slate-700 hover:bg-red-100'
  }
};

const chipStyles: Record<Severity, string> = {
    Mild: 'bg-green-100 text-green-800',
    Moderate: 'bg-yellow-100 text-yellow-800',
    Severe: 'bg-red-100 text-red-800'
};

export const SymptomInput: React.FC<SymptomInputProps> = ({ onSubmit, isLoading }) => {
  const [symptoms, setSymptoms] = useState<UserInputSymptom[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [currentSeverity, setCurrentSeverity] = useState<Severity>('Mild');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentSymptom(value);
    if (value.length > 1) {
      const filteredSuggestions = symptomList
        .filter(s => s.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5); // Limit suggestions
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentSymptom(suggestion);
    setSuggestions([]);
  };

  const handleAddSymptom = () => {
    if (currentSymptom.trim()) {
      setSymptoms([...symptoms, { name: currentSymptom.trim(), severity: currentSeverity }]);
      setCurrentSymptom('');
      setCurrentSeverity('Mild');
      setSuggestions([]);
    }
  };
  
  const handleRemoveSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(symptoms);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div ref={suggestionBoxRef} className="relative">
          <label htmlFor="symptom-name" className="block text-sm font-medium text-slate-700 mb-1">
            Symptom
          </label>
          <input
            id="symptom-name"
            type="text"
            value={currentSymptom}
            onChange={handleInputChange}
            autoComplete="off"
            placeholder="e.g., Headache"
            className="w-full px-3 py-2 text-slate-900 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            disabled={isLoading}
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-slate-300 rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto">
              {suggestions.map(s => (
                <li 
                  key={s} 
                  onClick={() => handleSuggestionClick(s)}
                  className="px-3 py-2 text-slate-700 hover:bg-slate-100 cursor-pointer text-sm"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-2">
              Severity
            </label>
            <div className="grid grid-cols-3 gap-2">
              {severityLevels.map(level => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setCurrentSeverity(level)}
                  className={`flex-1 text-center px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-150 ${
                    currentSeverity === level
                      ? severityStyles[level].selected
                      : severityStyles[level].unselected
                  }`}
                  disabled={isLoading}
                >
                  {level}
                </button>
              ))}
            </div>
        </div>
        
        <button
          type="button"
          onClick={handleAddSymptom}
          disabled={isLoading || !currentSymptom.trim()}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-slate-300 text-sm font-semibold rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-200 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Add Symptom
        </button>
      </div>
      
      {symptoms.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-slate-200">
           <h3 className="text-sm font-medium text-slate-600">Your Symptoms:</h3>
           <div className="flex flex-wrap gap-2">
             {symptoms.map((symptom, index) => (
                <span key={index} className={`flex items-center text-sm font-medium pl-3 pr-2 py-1 rounded-full ${chipStyles[symptom.severity]}`}>
                  {symptom.name}
                  <button type="button" onClick={() => handleRemoveSymptom(index)} className="ml-1.5 opacity-70 hover:opacity-100" aria-label={`Remove ${symptom.name}`}>
                    <XCircleIcon className="h-4 w-4" />
                  </button>
                </span>
             ))}
           </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || symptoms.length === 0}
        className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
      >
        {isLoading ? (
          'Analyzing...'
        ) : (
          <>
            <SparklesIcon className="h-5 w-5 mr-2" />
            Check Symptoms
          </>
        )}
      </button>
    </form>
  );
};