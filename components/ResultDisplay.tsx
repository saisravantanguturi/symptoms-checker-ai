import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ConditionChart } from './ConditionChart';
import { AnalysisResult, PossibleCondition } from '../types';

interface ResultDisplayProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const RiskBadge: React.FC<{ level: 'Low' | 'Medium' | 'High' | 'Critical' }> = ({ level }) => {
  const baseClasses = "px-3 py-1 text-sm font-bold rounded-full inline-block";
  const levelStyles = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-orange-100 text-orange-800",
    Critical: "bg-red-200 text-red-900 animate-pulse",
  };
  return <span className={`${baseClasses} ${levelStyles[level]}`}>{level} Risk</span>;
};

const ProbabilityCard: React.FC<{ condition: PossibleCondition }> = ({ condition }) => (
  <div className="bg-slate-50/70 border border-slate-200 rounded-lg p-4 mb-3">
    <div className="flex justify-between items-center mb-1">
      <h4 className="font-bold text-slate-800">{condition.name}</h4>
      <span className="text-sm font-semibold text-blue-600">{condition.probability}% Likelihood</span>
    </div>
    <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
      <div 
        className="bg-blue-600 h-2.5 rounded-full" 
        style={{ width: `${condition.probability}%` }}
        role="progressbar"
        aria-valuenow={condition.probability}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${condition.name} probability`}
      ></div>
    </div>
    {condition.description && <p className="text-sm text-slate-600 mt-2">{condition.description}</p>}
  </div>
);

const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-3">{title}</h3>
        <div className="bg-slate-50/70 p-4 rounded-lg border border-slate-200">
            {children}
        </div>
    </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white/50 backdrop-blur-sm rounded-lg border-2 border-dashed border-slate-300 min-h-[150px]">
        <LoadingSpinner />
        <p className="mt-3 text-slate-600 font-medium">AI is analyzing your symptoms...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-red-700 bg-red-100 border border-red-400 rounded-lg p-4" role="alert">
        {error}
      </div>
    );
  }

  if (result) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 animate-fade-in space-y-6">
        {result.emergencyAlert && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-md" role="alert">
            <h3 className="font-bold text-lg">Urgent!</h3>
            <p>{result.emergencyAlert}</p>
          </div>
        )}

        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Analysis Result</h2>
          {result.riskLevel && <RiskBadge level={result.riskLevel} />}
        </div>
        
        {result.clarificationQuestions && result.clarificationQuestions.length > 0 && (
             <Section title="Please Provide More Information">
                <p className="text-slate-600 mb-3">To give you a better analysis, please answer the following:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {result.clarificationQuestions.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
            </Section>
        )}

        {result.possibleConditions && result.possibleConditions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Condition Probability Overview</h3>
            <div className="bg-slate-50/70 p-4 rounded-lg border border-slate-200 mb-6">
              <ConditionChart conditions={result.possibleConditions} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Possible Condition Details</h3>
            {result.possibleConditions.map((cond) => <ProbabilityCard key={cond.name} condition={cond} />)}
          </div>
        )}

        {result.symptomSeverity && result.symptomSeverity.length > 0 && (
          <Section title="Symptom Analysis">
            <ul className="list-disc list-inside space-y-1">
              {result.symptomSeverity.map((item, index) => (
                <li key={index} className="text-slate-700">
                  <span className="font-semibold">{item.symptom}:</span> {item.severity}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {result.lifestyleTips && result.lifestyleTips.length > 0 && (
          <Section title="Lifestyle & Self-Care Tips">
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              {result.lifestyleTips.map((tip, index) => <li key={index}>{tip}</li>)}
            </ul>
          </Section>
        )}

        {result.healthTip && (
          <Section title="Health Tip">
             <p className="text-sm text-slate-600">{result.healthTip}</p>
          </Section>
        )}
        
        {result.disclaimer && (
            <p className="text-xs text-center text-slate-500 pt-4 border-t border-slate-200">{result.disclaimer}</p>
        )}

      </div>
    );
  }

  return (
    <div className="text-center text-slate-500 bg-white/50 backdrop-blur-sm p-8 rounded-lg border-2 border-dashed border-slate-300">
      <h3 className="text-lg font-medium text-slate-700">Waiting for symptoms...</h3>
      <p className="mt-2 text-sm">Your detailed analysis will appear here.</p>
    </div>
  );
};