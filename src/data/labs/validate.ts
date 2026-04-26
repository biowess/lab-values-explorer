import { LabData, ReferenceRange, AgeRange, InterpretationRule, CriticalValue, Reference, Condition, ConditionOp } from '../../types';

// ─── Primitive helpers ────────────────────────────────────────────────────────

function isString(v: unknown): v is string {
  return typeof v === 'string' && v.trim() !== '';
}

function isNumber(v: unknown): v is number {
  return typeof v === 'number' && isFinite(v);
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string');
}

// ─── Nested shape guards ──────────────────────────────────────────────────────

const AGE_UNITS = ['hours', 'days', 'weeks', 'months', 'years'] as const;

function isAgeRange(v: unknown): v is AgeRange {
  if (typeof v !== 'object' || v === null) return false;
  const a = v as Record<string, unknown>;
  if (!AGE_UNITS.includes(a.unit as (typeof AGE_UNITS)[number])) return false;
  if (a.min !== undefined && !isNumber(a.min)) return false;
  if (a.max !== undefined && !isNumber(a.max)) return false;
  return true;
}

function isReferenceRange(v: unknown): v is ReferenceRange {
  if (typeof v !== 'object' || v === null) return false;
  const r = v as Record<string, unknown>;

  // population
  if (typeof r.population !== 'object' || r.population === null) return false;
  const pop = r.population as Record<string, unknown>;
  if (!['male', 'female', 'all'].includes(pop.sex as string)) return false;
  if (pop.age !== undefined && !isAgeRange(pop.age)) return false;

  // value
  if (typeof r.value !== 'object' || r.value === null) return false;
  const val = r.value as Record<string, unknown>;
  if (!isNumber(val.min) || !isNumber(val.max)) return false;
  if (typeof val.unit !== 'string') return false;

  // label
  if (!isString(r.label)) return false;

  return true;
}

const CONDITION_OPS: ConditionOp[] = ['lt', 'lte', 'gt', 'gte', 'eq', 'between'];

function isCondition(v: unknown): v is Condition {
  if (typeof v !== 'object' || v === null) return false;
  const c = v as Record<string, unknown>;
  if (!CONDITION_OPS.includes(c.op as ConditionOp)) return false;
  if (!isNumber(c.value)) return false;
  if (c.op === 'between' && !isNumber(c.value2)) return false;
  if (c.unit !== undefined && typeof c.unit !== 'string') return false;
  return true;
}

function isInterpretationRule(v: unknown): v is InterpretationRule {
  if (typeof v !== 'object' || v === null) return false;
  const r = v as Record<string, unknown>;
  return isCondition(r.condition) && isString(r.meaning);
}

// CriticalValue shares the same shape
const isCriticalValue = isInterpretationRule as (v: unknown) => v is CriticalValue;

function isReference(v: unknown): v is Reference {
  if (typeof v !== 'object' || v === null) return false;
  const r = v as Record<string, unknown>;
  // title is required
  if (!isString(r.title)) return false;
  if (r.authors !== undefined && typeof r.authors !== 'string') return false;
  if (r.journal !== undefined && typeof r.journal !== 'string') return false;
  if (r.year !== undefined && !isNumber(r.year)) return false;
  if (r.url !== undefined && typeof r.url !== 'string') return false;
  return true;
}

// ─── Dev-only error logger ─────────────────────────────────────────────────────

function devWarn(id: unknown, message: string): void {
  if (import.meta.env.DEV) {
    const label = typeof id === 'string' ? `"${id}"` : '(unknown id)';
    console.error(`[LabValidator] ${label}: ${message}`);
  }
}

// ─── Main validator / normalizer ───────────────────────────────────────────────

/**
 * Type guard that validates a raw JSON import as a LabData (new schema).
 *
 * Normalization applied at load time:
 *   - aliases, subcategories, tags, warnings, notes, examples → [] if absent
 *   - interpretation_rules, critical_values → [] if absent
 *   - references → [] if absent
 *
 * Invalid entries are dropped with a console.error in development.
 */
export function validateLab(v: unknown): v is LabData {
  if (typeof v !== 'object' || v === null) {
    if (import.meta.env.DEV) console.error('[LabValidator] Entry is not an object:', v);
    return false;
  }

  const lab = v as Record<string, unknown>;
  const id = lab.id;

  // ── Required string fields ──────────────────────────────────────────────────
  const requiredStrings = ['id', 'name', 'category', 'description', 'unit'] as const;
  for (const field of requiredStrings) {
    if (!isString(lab[field])) {
      devWarn(id, `missing or empty required string field "${field}"`);
      return false;
    }
  }

  // ── ranges: must be non-empty array of valid ReferenceRange objects ─────────
  if (!Array.isArray(lab.ranges) || lab.ranges.length === 0) {
    devWarn(id, '"ranges" must be a non-empty array');
    return false;
  }
  for (let i = 0; i < lab.ranges.length; i++) {
    if (!isReferenceRange(lab.ranges[i])) {
      devWarn(id, `ranges[${i}] is not a valid ReferenceRange: ${JSON.stringify(lab.ranges[i])}`);
      return false;
    }
  }

  // ── interpretation_rules ────────────────────────────────────────────────────
  if (!Array.isArray(lab.interpretation_rules)) {
    lab.interpretation_rules = [];
  } else {
    for (let i = 0; i < (lab.interpretation_rules as unknown[]).length; i++) {
      if (!isInterpretationRule((lab.interpretation_rules as unknown[])[i])) {
        devWarn(id, `interpretation_rules[${i}] is invalid: ${JSON.stringify((lab.interpretation_rules as unknown[])[i])}`);
        return false;
      }
    }
  }

  // ── critical_values ─────────────────────────────────────────────────────────
  if (!Array.isArray(lab.critical_values)) {
    lab.critical_values = [];
  } else {
    for (let i = 0; i < (lab.critical_values as unknown[]).length; i++) {
      if (!isCriticalValue((lab.critical_values as unknown[])[i])) {
        devWarn(id, `critical_values[${i}] is invalid: ${JSON.stringify((lab.critical_values as unknown[])[i])}`);
        return false;
      }
    }
  }

  // ── references ──────────────────────────────────────────────────────────────
  if (!Array.isArray(lab.references)) {
    lab.references = [];
  } else {
    for (let i = 0; i < (lab.references as unknown[]).length; i++) {
      if (!isReference((lab.references as unknown[])[i])) {
        devWarn(id, `references[${i}] is invalid — must have at minimum a "title" string: ${JSON.stringify((lab.references as unknown[])[i])}`);
        return false;
      }
    }
  }

  // ── Optional string-array fields — normalize to [] if absent ───────────────
  if (!isStringArray(lab.aliases))        lab.aliases        = [];
  if (!isStringArray(lab.subcategories))  lab.subcategories  = [];
  if (!isStringArray(lab.tags))           lab.tags           = [];
  if (!isStringArray(lab.warnings))       lab.warnings       = [];
  if (!isStringArray(lab.notes))          lab.notes          = [];
  if (!isStringArray(lab.examples))       lab.examples       = [];

  return true;
}
