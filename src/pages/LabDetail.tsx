import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Info, AlertTriangle } from 'lucide-react';
import { labs } from '../data/labs';
import { AgeUnit, ReferenceRange } from '../types';

export default function LabDetail() {
  const { id } = useParams<{ id: string }>();
  const lab = labs.find((l) => l.id === id);

  const [ageValue, setAgeValue] = useState<string>('30');
  const [ageUnit, setAgeUnit] = useState<AgeUnit>('years');
  const [sex, setSex] = useState<'male' | 'female' | 'all'>('male');
  const [labValue, setLabValue] = useState<string>('');

  if (!lab) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-serif text-gray-900 mb-4">Lab not found</h2>
        <Link to="/" className="text-blue-600 hover:underline">Return to search</Link>
      </div>
    );
  }

  // Convert age to days for comparison
  const getAgeInDays = (val: number, unit: AgeUnit) => {
    switch (unit) {
      case 'hours': return val / 24;
      case 'days': return val;
      case 'weeks': return val * 7;
      case 'months': return val * 30.44; // average month
      case 'years': return val * 365.25;
      default: return val;
    }
  };

  const currentAgeDays = useMemo(() => {
    const val = parseFloat(ageValue);
    if (isNaN(val)) return null;
    return getAgeInDays(val, ageUnit);
  }, [ageValue, ageUnit]);

  const applicableRange = useMemo(() => {
    if (currentAgeDays === null) return null;

    // Find the most specific range that matches age and sex
    const matches = lab.ranges.filter(r => {
      let ageMatch = true;
      if (r.age_min) {
        const minDays = getAgeInDays(r.age_min.value, r.age_min.unit);
        if (currentAgeDays < minDays) ageMatch = false;
      }
      if (r.age_max) {
        const maxDays = getAgeInDays(r.age_max.value, r.age_max.unit);
        if (currentAgeDays > maxDays) ageMatch = false;
      }

      const sexMatch = r.sex === 'all' || r.sex === sex;

      return ageMatch && sexMatch;
    });

    return matches.length > 0 ? matches[0] : null;
  }, [currentAgeDays, sex, lab.ranges]);

  const numericLabValue = parseFloat(labValue);
  const hasValidLabValue = !isNaN(numericLabValue);

  const getValueStatus = () => {
    if (!applicableRange || !hasValidLabValue) return null;
    if (numericLabValue < applicableRange.low) return 'low';
    if (numericLabValue > applicableRange.high) return 'high';
    return 'normal';
  };

  const status = getValueStatus();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link to="/search" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to results
      </Link>

      <header className="mb-10 pb-6 border-b border-gray-200">
        <div className="flex items-baseline justify-between mb-2">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 tracking-tight">{lab.name}</h1>
          <span className="text-lg text-gray-500 font-mono">{lab.unit}</span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
          <span className="bg-gray-100 px-2 py-1">{lab.category}</span>
          {lab.subtype && <span>{lab.subtype}</span>}
        </div>
        {lab.aliases.length > 0 && (
          <p className="text-sm text-gray-500">Aliases: {lab.aliases.join(', ')}</p>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-10">
          <section>
            <h2 className="text-xl font-serif text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{lab.description}</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-gray-900 mb-4">Clinical Interpretation</h2>
            <div className="p-4 bg-gray-50 border-l-4 border-gray-300">
              <p className="text-gray-700 leading-relaxed">{lab.interpretation}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-gray-900 mb-4">Reference Ranges</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-900">
                    <th className="py-3 px-4 font-semibold text-gray-900">Population / Age</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">Sex</th>
                    <th className="py-3 px-4 font-semibold text-gray-900 text-right">Low</th>
                    <th className="py-3 px-4 font-semibold text-gray-900 text-right">High</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lab.ranges.map((r, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{r.label}</td>
                      <td className="py-3 px-4 text-gray-600 capitalize">{r.sex}</td>
                      <td className="py-3 px-4 text-gray-900 text-right font-mono">{r.low}</td>
                      <td className="py-3 px-4 text-gray-900 text-right font-mono">{r.high}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {lab.warnings && lab.warnings.length > 0 && (
            <section>
              <h2 className="text-xl font-serif text-gray-900 mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
                Clinical Caveats
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {lab.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </section>
          )}

          <section>
            <h2 className="text-xl font-serif text-gray-900 mb-3">References</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              {lab.references.map((ref, i) => <li key={i}>{ref}</li>)}
            </ul>
          </section>
        </div>

        {/* Sidebar Calculator */}
        <div className="md:col-span-1">
          <div className="sticky top-6 bg-white border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-serif text-gray-900 mb-4 border-b border-gray-200 pb-2">Evaluate Value</h3>
            
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
                  <label className="flex items-center space-x-2">
                    <input type="radio" checked={sex === 'male'} onChange={() => setSex('male')} className="text-gray-900 focus:ring-gray-900" />
                    <span className="text-sm text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" checked={sex === 'female'} onChange={() => setSex('female')} className="text-gray-900 focus:ring-gray-900" />
                    <span className="text-sm text-gray-700">Female</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value ({lab.unit})</label>
                <input
                  type="number"
                  value={labValue}
                  onChange={(e) => setLabValue(e.target.value)}
                  placeholder={`e.g. ${lab.ranges[0]?.low || 0}`}
                  className="w-full px-3 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                  step="any"
                />
              </div>
            </div>

            {/* Visualization */}
            <div className="pt-4 border-t border-gray-200">
              {applicableRange ? (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Applicable Range:</span>
                    <span className="font-mono">{applicableRange.low} - {applicableRange.high} {lab.unit}</span>
                  </div>
                  
                  {hasValidLabValue && (
                    <div className="mt-4">
                      <div className="relative h-2 bg-gray-200 rounded-full mb-2">
                        {/* Normal range highlight */}
                        <div 
                          className="absolute h-full bg-green-200"
                          style={{
                            left: '20%', // Visual padding
                            width: '60%'
                          }}
                        />
                        
                        {/* Value marker */}
                        <div 
                          className={`absolute w-3 h-3 rounded-full -mt-0.5 -ml-1.5 border-2 border-white shadow-sm ${
                            status === 'normal' ? 'bg-green-600' : status === 'low' ? 'bg-blue-600' : 'bg-red-600'
                          }`}
                          style={{
                            left: (() => {
                              const rangeSpan = applicableRange.high - applicableRange.low;
                              // Map value to percentage, with padding on ends
                              const normalized = (numericLabValue - applicableRange.low) / rangeSpan;
                              // Clamp between 0 and 1
                              const clamped = Math.max(0, Math.min(1, normalized));
                              // Map 0-1 to 20%-80% of the bar
                              return `${20 + (clamped * 60)}%`;
                            })()
                          }}
                        />
                      </div>
                      <div className="text-center mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${
                          status === 'normal' ? 'bg-green-100 text-green-800' : 
                          status === 'low' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {status}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-amber-600 flex items-start">
                  <Info className="w-4 h-4 mr-1.5 mt-0.5 shrink-0" />
                  No reference range available for this specific age and sex combination.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
