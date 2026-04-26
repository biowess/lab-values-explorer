import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Info, AlertTriangle, Bookmark, FlaskConical, Tag, BookOpen, ShieldAlert } from 'lucide-react';
import { labs } from '../data/labs';
import { AgeUnit, ReferenceRange, InterpretationRule, CriticalValue, Reference, ConditionOp } from '../types';
import { useLocalData } from '../context/LocalDataContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAgeInDays(val: number, unit: AgeUnit): number {
  switch (unit) {
    case 'hours':  return val / 24;
    case 'days':   return val;
    case 'weeks':  return val * 7;
    case 'months': return val * 30.44;
    case 'years':  return val * 365.25;
    default:       return val;
  }
}

function formatCondition(op: ConditionOp, value: number, value2: number | undefined, unit: string | undefined): string {
  const u = unit ? ` ${unit}` : '';
  switch (op) {
    case 'lt':      return `< ${value}${u}`;
    case 'lte':     return `≤ ${value}${u}`;
    case 'gt':      return `> ${value}${u}`;
    case 'gte':     return `≥ ${value}${u}`;
    case 'eq':      return `= ${value}${u}`;
    case 'between': return `${value} – ${value2 ?? '?'}${u}`;
    default:        return `${value}${u}`;
  }
}

function evaluateCondition(numVal: number, op: ConditionOp, threshold: number, threshold2: number | undefined): boolean {
  switch (op) {
    case 'lt':      return numVal < threshold;
    case 'lte':     return numVal <= threshold;
    case 'gt':      return numVal > threshold;
    case 'gte':     return numVal >= threshold;
    case 'eq':      return numVal === threshold;
    case 'between': return threshold2 !== undefined && numVal >= threshold && numVal <= threshold2;
    default:        return false;
  }
}

function formatRangePopulation(r: ReferenceRange): string {
  const { age } = r.population;
  if (!age) return 'All ages';
  if (age.min !== undefined && age.max !== undefined) {
    return `${age.min}–${age.max} ${age.unit}`;
  }
  if (age.min !== undefined) return `≥ ${age.min} ${age.unit}`;
  if (age.max !== undefined) return `≤ ${age.max} ${age.unit}`;
  return 'All ages';
}

function formatReference(ref: Reference, index: number): string {
  const parts: string[] = [];
  if (ref.authors) parts.push(ref.authors);
  parts.push(ref.title);
  if (ref.journal) parts.push(ref.journal);
  if (ref.year)    parts.push(String(ref.year));
  return `${index + 1}. ${parts.join('. ')}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InterpretationBlock({ rule }: { rule: InterpretationRule }) {
  const { condition, meaning } = rule;
  const label = formatCondition(condition.op, condition.value, condition.value2, condition.unit);

  const isLow  = condition.op === 'lt' || condition.op === 'lte';
  const isHigh = condition.op === 'gt' || condition.op === 'gte';
  const isBetween = condition.op === 'between';

  const color = isLow
    ? 'border-blue-300 bg-blue-50 text-blue-900'
    : isHigh
    ? 'border-amber-300 bg-amber-50 text-amber-900'
    : isBetween
    ? 'border-green-300 bg-green-50 text-green-900'
    : 'border-gray-300 bg-gray-50 text-gray-900';

  const badge = isLow
    ? 'bg-blue-100 text-blue-700'
    : isHigh
    ? 'bg-amber-100 text-amber-700'
    : isBetween
    ? 'bg-green-100 text-green-700'
    : 'bg-gray-100 text-gray-700';

  return (
    <div className={`border-l-4 px-4 py-3 rounded-r ${color}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${badge}`}>
          {label}
        </span>
      </div>
      <p className="text-sm leading-relaxed">{meaning}</p>
    </div>
  );
}

function CriticalValueBlock({ rule }: { rule: CriticalValue }) {
  const { condition, meaning } = rule;
  const label = formatCondition(condition.op, condition.value, condition.value2, condition.unit);

  return (
    <div className="border-l-4 border-red-500 bg-red-50 px-4 py-3 rounded-r flex gap-3">
      <ShieldAlert className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-red-200 text-red-800">
            {label}
          </span>
          <span className="text-xs font-semibold text-red-700 uppercase tracking-wider">Critical</span>
        </div>
        <p className="text-sm text-red-900 leading-relaxed">{meaning}</p>
      </div>
    </div>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function LabDetail() {
  const { id } = useParams<{ id: string }>();
  const lab = labs.find((l) => l.id === id);

  const { savedLabIds, toggleSavedLab, preferences } = useLocalData();

  const [ageValue, setAgeValue] = useState<string>('30');
  const [ageUnit, setAgeUnit]   = useState<AgeUnit>(preferences.defaultAgeUnit);
  const [sex, setSex]           = useState<'male' | 'female' | 'all'>(preferences.defaultSex);
  const [labValue, setLabValue] = useState<string>('');

  if (!lab) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-serif text-gray-900 mb-4">Lab not found</h2>
        <Link to="/" className="text-blue-600 hover:underline">Return to search</Link>
      </div>
    );
  }

  const isSaved = savedLabIds.includes(lab.id);

  const currentAgeDays = useMemo(() => {
    const val = parseFloat(ageValue);
    if (isNaN(val)) return null;
    return getAgeInDays(val, ageUnit);
  }, [ageValue, ageUnit]);

  // Match a range against entered age + sex
  const applicableRange = useMemo((): ReferenceRange | null => {
    if (currentAgeDays === null) return null;

    const matches = lab.ranges.filter((r) => {
      const { age } = r.population;
      if (age) {
        if (age.min !== undefined && currentAgeDays < getAgeInDays(age.min, age.unit)) return false;
        if (age.max !== undefined && currentAgeDays > getAgeInDays(age.max, age.unit)) return false;
      }
      const sexMatch = r.population.sex === 'all' || r.population.sex === sex;
      return sexMatch;
    });

    return matches.length > 0 ? matches[0] : null;
  }, [currentAgeDays, sex, lab.ranges]);

  const numericLabValue = parseFloat(labValue);
  const hasValidLabValue = !isNaN(numericLabValue);

  const getValueStatus = (): 'low' | 'normal' | 'high' | null => {
    if (!applicableRange || !hasValidLabValue) return null;
    if (numericLabValue < applicableRange.value.min) return 'low';
    if (numericLabValue > applicableRange.value.max) return 'high';
    return 'normal';
  };

  const status = getValueStatus();

  // Find first matching interpretation rule for the entered value
  const matchedRule = useMemo((): InterpretationRule | null => {
    if (!hasValidLabValue) return null;
    return (
      lab.interpretation_rules.find((r) =>
        evaluateCondition(numericLabValue, r.condition.op, r.condition.value, r.condition.value2)
      ) ?? null
    );
  }, [numericLabValue, hasValidLabValue, lab.interpretation_rules]);

  const matchedCritical = useMemo((): CriticalValue | null => {
    if (!hasValidLabValue) return null;
    return (
      lab.critical_values.find((r) =>
        evaluateCondition(numericLabValue, r.condition.op, r.condition.value, r.condition.value2)
      ) ?? null
    );
  }, [numericLabValue, hasValidLabValue, lab.critical_values]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link to="/search" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to results
      </Link>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="mb-10 pb-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-baseline gap-3">
                <h1 className="text-3xl md:text-4xl font-serif text-gray-900 tracking-tight">{lab.name}</h1>
                {lab.short_name && lab.short_name !== lab.name && (
                  <span className="text-xl font-mono text-gray-400">{lab.short_name}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => toggleSavedLab(lab.id)}
              className={`p-2 rounded-full transition-colors ${
                isSaved
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save lab'}
            >
              <Bookmark className="w-6 h-6" fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
          <span className="text-lg text-gray-500 font-mono mt-1">{lab.unit}</span>
        </div>

        {/* Category + subcategories */}
        <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
          <span className="bg-gray-900 text-white px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase">
            {lab.category}
          </span>
          {lab.subcategories.map((s) => (
            <span key={s} className="bg-gray-100 text-gray-600 px-2.5 py-0.5 text-xs border border-gray-200">
              {s}
            </span>
          ))}
          {lab.specimen && (
            <span className="flex items-center gap-1 text-gray-500 text-xs">
              <FlaskConical className="w-3 h-3" />
              {lab.specimen}
            </span>
          )}
        </div>

        {/* Aliases */}
        {lab.aliases.length > 0 && (
          <p className="text-sm text-gray-500 mb-2">
            <span className="font-medium">Also known as:</span> {lab.aliases.join(', ')}
          </p>
        )}

        {/* Tags */}
        {lab.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Tag className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
            {lab.tags.map((t) => (
              <span key={t} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* ── Main Content ────────────────────────────────────────────────── */}
        <div className="md:col-span-2 space-y-10">

          {/* Description */}
          <section>
            <h2 className="text-xl font-serif text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{lab.description}</p>
          </section>

          {/* Clinical Use */}
          {lab.clinical_use && (
            <section>
              <h2 className="text-xl font-serif text-gray-900 mb-4">Clinical Use</h2>
              <div className="p-4 bg-gray-50 border-l-4 border-gray-300">
                <p className="text-gray-700 leading-relaxed">{lab.clinical_use}</p>
              </div>
            </section>
          )}

          {/* Reference Ranges */}
          <section>
            <h2 className="text-xl font-serif text-gray-900 mb-4">Reference Ranges</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-900">
                    <th className="py-3 px-4 font-semibold text-gray-900">Label</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">Age</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">Sex</th>
                    <th className="py-3 px-4 font-semibold text-gray-900 text-right">Min</th>
                    <th className="py-3 px-4 font-semibold text-gray-900 text-right">Max</th>
                    <th className="py-3 px-4 font-semibold text-gray-900 text-right">Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lab.ranges.map((r, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800 font-medium">{r.label}</td>
                      <td className="py-3 px-4 text-gray-600">{formatRangePopulation(r)}</td>
                      <td className="py-3 px-4 text-gray-600 capitalize">{r.population.sex}</td>
                      <td className="py-3 px-4 text-gray-900 text-right font-mono">{r.value.min}</td>
                      <td className="py-3 px-4 text-gray-900 text-right font-mono">{r.value.max}</td>
                      <td className="py-3 px-4 text-gray-500 text-right font-mono text-xs">{r.value.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Interpretation Rules */}
          {lab.interpretation_rules.length > 0 && (
            <section>
              <h2 className="text-xl font-serif text-gray-900 mb-4">Interpretation</h2>
              <div className="space-y-3">
                {lab.interpretation_rules.map((rule, i) => (
                  <InterpretationBlock key={i} rule={rule} />
                ))}
              </div>
            </section>
          )}

          {/* Critical Values */}
          {lab.critical_values.length > 0 && (
            <section>
              <h2 className="text-xl font-serif text-gray-900 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                Critical Values
              </h2>
              <div className="space-y-3">
                {lab.critical_values.map((rule, i) => (
                  <CriticalValueBlock key={i} rule={rule} />
                ))}
              </div>
            </section>
          )}

          {/* Warnings */}
          {lab.warnings.length > 0 && (
            <section>
              <h2 className="text-xl font-serif text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Clinical Caveats
              </h2>
              <ul className="space-y-2">
                {lab.warnings.map((w, i) => (
                  <li key={i} className="flex gap-2 text-gray-700 text-sm leading-relaxed">
                    <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Notes */}
          {lab.notes.length > 0 && (
            <section>
              <h2 className="text-xl font-serif text-gray-900 mb-3">Notes</h2>
              <ul className="space-y-1 text-sm text-gray-600">
                {lab.notes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </section>
          )}

          {/* References */}
          {lab.references.length > 0 && (
            <section>
              <h2 className="text-xl font-serif text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-500" />
                References
              </h2>
              <ol className="space-y-2 text-sm text-gray-600">
                {lab.references.map((ref, i) => (
                  <li key={i} className="leading-relaxed">
                    <span className="text-gray-400 font-mono mr-2">{i + 1}.</span>
                    {ref.authors && <span className="font-medium text-gray-700">{ref.authors}. </span>}
                    <span className="italic">{ref.title}</span>
                    {ref.journal && <span className="text-gray-500">. {ref.journal}</span>}
                    {ref.year    && <span className="text-gray-500">, {ref.year}</span>}
                    {ref.url && (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-blue-600 hover:underline"
                      >
                        [link]
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Metadata footer */}
          {(lab.version || lab.updated_at) && (
            <div className="pt-4 border-t border-gray-100 flex gap-4 text-xs text-gray-400">
              {lab.version    && <span>v{lab.version}</span>}
              {lab.updated_at && <span>Updated {lab.updated_at}</span>}
            </div>
          )}
        </div>

        {/* ── Sidebar Calculator ───────────────────────────────────────────── */}
        <div className="md:col-span-1">
          <div className="sticky top-6 bg-white border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-serif text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Evaluate Value
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={ageValue}
                    onChange={(e) => setAgeValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                    min="0"
                    step="any"
                  />
                  <select
                    value={ageUnit}
                    onChange={(e) => setAgeUnit(e.target.value as AgeUnit)}
                    className="w-full px-3 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none bg-white"
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                <div className="flex space-x-4">
                  {(['male', 'female'] as const).map((s) => (
                    <label key={s} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={sex === s}
                        onChange={() => setSex(s)}
                        className="text-gray-900 focus:ring-gray-900"
                      />
                      <span className="text-sm text-gray-700 capitalize">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value ({lab.unit})
                </label>
                <input
                  type="number"
                  value={labValue}
                  onChange={(e) => setLabValue(e.target.value)}
                  placeholder={`e.g. ${lab.ranges[0]?.value.min ?? 0}`}
                  className="w-full px-3 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                  step="any"
                />
              </div>
            </div>

            {/* Result area */}
            <div className="pt-4 border-t border-gray-200">
              {applicableRange ? (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-3">
                    <span className="font-medium">{applicableRange.label}</span>
                    <span className="font-mono">
                      {applicableRange.value.min} – {applicableRange.value.max} {lab.unit}
                    </span>
                  </div>

                  {hasValidLabValue && (
                    <div className="mt-2">
                      {/* Gauge bar */}
                      <div className="relative h-2 bg-gray-200 rounded-full mb-3">
                        <div
                          className="absolute h-full bg-green-200 rounded-full"
                          style={{ left: '20%', width: '60%' }}
                        />
                        <div
                          className={`absolute w-3 h-3 rounded-full -mt-0.5 -ml-1.5 border-2 border-white shadow-sm ${
                            status === 'normal' ? 'bg-green-600' :
                            status === 'low'    ? 'bg-blue-600'  : 'bg-red-600'
                          }`}
                          style={{
                            left: (() => {
                              const span = applicableRange.value.max - applicableRange.value.min;
                              const norm = (numericLabValue - applicableRange.value.min) / span;
                              const clamped = Math.max(0, Math.min(1, norm));
                              return `${20 + clamped * 60}%`;
                            })(),
                          }}
                        />
                      </div>

                      {/* Status badge */}
                      <div className="text-center mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${
                          status === 'normal' ? 'bg-green-100 text-green-800' :
                          status === 'low'    ? 'bg-blue-100 text-blue-800'   :
                          'bg-red-100 text-red-800'
                        }`}>
                          {status}
                        </span>
                      </div>

                      {/* Critical alert */}
                      {matchedCritical && (
                        <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex gap-2">
                          <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                          <span>{matchedCritical.meaning}</span>
                        </div>
                      )}

                      {/* Interpretation rule (non-critical) */}
                      {matchedRule && !matchedCritical && (
                        <div className="mt-3 p-2.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700">
                          {matchedRule.meaning}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-amber-600 flex items-start">
                  <Info className="w-4 h-4 mr-1.5 mt-0.5 shrink-0" />
                  No reference range available for this age and sex combination.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
