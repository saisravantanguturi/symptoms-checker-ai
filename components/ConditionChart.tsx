import React from 'react';
import { PossibleCondition } from '../types';

interface ConditionChartProps {
  conditions: PossibleCondition[];
}

export const ConditionChart: React.FC<ConditionChartProps> = ({ conditions }) => {
  if (!conditions || conditions.length === 0) {
    return null;
  }

  // Sort conditions by probability for a more organized view
  const sortedConditions = [...conditions].sort((a, b) => b.probability - a.probability);

  return (
    <div className="space-y-4" aria-label="Condition probability chart">
      {sortedConditions.map((condition, index) => (
        <div key={index}>
          <div className="flex justify-between items-center mb-1 text-sm font-medium">
            <span className="text-slate-700">{condition.name}</span>
            <span className="text-slate-500">{condition.probability}%</span>
          </div>
          <div 
            className="w-full bg-slate-200 rounded-full h-3" 
            role="progressbar"
            aria-valuenow={condition.probability}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${condition.name} probability`}
          >
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${condition.probability}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};