export type AgeUnit = 'hours' | 'days' | 'weeks' | 'months' | 'years';

export interface Age {
  value: number;
  unit: AgeUnit;
}

export interface ReferenceRange {
  age_min?: Age;
  age_max?: Age;
  sex?: 'male' | 'female' | 'all';
  low: number;
  high: number;
  label: string;
}

export interface LabData {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  subtype?: string;
  description: string;
  unit: string;
  ranges: ReferenceRange[];
  interpretation: string;
  warnings: string[];
  references: string[];
  examples: string[];
  notes: string;
}
