import { Info } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-serif text-gray-900 tracking-tight flex items-center">
          <Info className="w-8 h-8 mr-3 text-gray-900" />
          About Lab Values Explorer
        </h1>
      </div>
      
      <div className="space-y-10 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-serif text-gray-900 mb-3">What is Lab Values Explorer?</h2>
          <p>
            Lab Values Explorer is an educational clinical reference tool designed to help students, 
            educators, and healthcare professionals explore laboratory values, reference ranges, 
            and interpretation support in a clean, accessible format.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-gray-900 mb-3">Populations Covered</h2>
          <p>
            The database includes reference ranges spanning multiple populations, including adult, 
            pediatric, and neonatal demographics. Age and sex-specific variations are accounted for 
            where applicable, allowing for dynamic evaluation of lab values based on patient parameters.
          </p>
        </section>

        <section className="bg-gray-50 p-6 border border-gray-200">
          <h2 className="text-xl font-serif text-gray-900 mb-3">Educational Project</h2>
          <p>
            Please note that this application is strictly a learning and educational project. 
            It is built to demonstrate modern web development practices in a clinical context 
            and should not be used as a primary source for medical decision-making.
          </p>
        </section>
      </div>
    </div>
  );
}
