export type AgeUnit = 'hours' | 'days' | 'weeks' | 'months' | 'years';

// ─── Range types ──────────────────────────────────────────────────────────────

export interface AgeRange {
  min?: number;
  max?: number;
  unit: AgeUnit;
}

export interface RangePopulation {
  age?: AgeRange;
  sex: 'male' | 'female' | 'all';
}

export interface RangeValue {
  min: number;
  max: number;
  unit: string;
}

export interface ReferenceRange {
  population: RangePopulation;
  value: RangeValue;
  label: string;
}

// ─── Condition / interpretation types ─────────────────────────────────────────

export type ConditionOp = 'lt' | 'lte' | 'gt' | 'gte' | 'eq' | 'between';

export interface Condition {
  op: ConditionOp;
  value: number;
  value2?: number;
  unit?: string;
}

export interface InterpretationRule {
  condition: Condition;
  meaning: string;
}

export type CriticalValue = InterpretationRule;

// ─── Reference type ────────────────────────────────────────────────────────────

export interface Reference {
  authors?: string;
  title: string;
  journal?: string;
  year?: number;
  url?: string;
}

// ─── Main LabData type ─────────────────────────────────────────────────────────

export interface LabData {
  id: string;
  name: string;
  short_name?: string;
  aliases: string[];
  category: string;
  subcategories: string[];
  tags: string[];
  specimen?: string;
  analyte_type?: string;
  unit: string;
  description: string;
  clinical_use?: string;
  ranges: ReferenceRange[];
  interpretation_rules: InterpretationRule[];
  critical_values: CriticalValue[];
  warnings: string[];
  notes: string[];
  examples: string[];
  references: Reference[];
  version?: string;
  updated_at?: string;
}
