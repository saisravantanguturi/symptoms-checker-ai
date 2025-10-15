export interface SymptomSeverity {
  symptom: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
}

export interface PossibleCondition {
  name: string;
  probability: number;
  description: string;
}

export interface UserInputSymptom {
  name: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
}

export interface AnalysisResult {
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  symptomSeverity?: SymptomSeverity[];
  possibleConditions?: PossibleCondition[];
  emergencyAlert?: string;
  lifestyleTips?: string[];
  clarificationQuestions?: string[];
  healthTip?: string;
  disclaimer: string;
}
