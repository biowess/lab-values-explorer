import { BookOpen } from 'lucide-react';

export default function References() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-serif text-gray-900 tracking-tight flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-gray-900" />
          References & Methodology
        </h1>
      </div>
      
      <div className="space-y-10 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-serif text-gray-900 mb-3">Data Structure</h2>
          <p>
            The reference ranges in this application are structured to account for variations in age and sex. 
            When evaluating a lab value, the system matches the entered age (converted internally to days for precision) 
            and sex against the most specific available reference interval in our local database.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-gray-900 mb-3">Variation in Values</h2>
          <p>
            It is crucial to understand that laboratory reference ranges are not universal. 
            Values may vary depending on several factors:
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li>The specific laboratory performing the analysis</li>
            <li>Geographic region and local population demographics</li>
            <li>The assay or analytical methodology used</li>
            <li>Specimen type (e.g., venous vs. capillary blood)</li>
            <li>Reagents and equipment calibration</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-serif text-gray-900 mb-3">Sources</h2>
          <p>
            The data presented in this application is aggregated from standard medical textbooks, 
            peer-reviewed journals, and established clinical guidelines. Specific references for 
            individual lab tests can be found at the bottom of each lab's detail page.
          </p>
        </section>
      </div>
    </div>
  );
}
