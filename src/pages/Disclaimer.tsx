import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-serif text-red-800 tracking-tight flex items-center">
          <AlertTriangle className="w-8 h-8 mr-3" />
          Medical Disclaimer
        </h1>
      </div>
      
      <div className="space-y-6 text-gray-800 leading-relaxed bg-red-50 p-8 border border-red-200 rounded-sm">
        <p className="font-semibold text-red-900 text-lg border-b border-red-200 pb-4 mb-4">
          This application is for educational purposes only.
        </p>
        
        <ul className="space-y-6">
          <li>
            <strong className="block text-red-900 mb-1">Not for Diagnosis or Treatment</strong>
            The information provided by Lab Values Explorer is not intended to be a substitute for 
            professional medical advice, diagnosis, or treatment. It is a reference tool for learning.
          </li>
          
          <li>
            <strong className="block text-red-900 mb-1">Not for Clinical Decision-Making</strong>
            Do not use this tool in emergencies or for direct patient care. The algorithms and data 
            provided have not been validated for clinical use.
          </li>
          
          <li>
            <strong className="block text-red-900 mb-1">Rely on Professionals</strong>
            Always seek the advice of your physician or other qualified health provider with any 
            questions you may have regarding a medical condition. Never disregard professional medical 
            advice or delay in seeking it because of something you have read on this application.
          </li>
          
          <li>
            <strong className="block text-red-900 mb-1">Official Guidelines & Local Variations</strong>
            Reference ranges can vary significantly between different laboratories, regions, and testing 
            methodologies. Always refer to the specific reference ranges provided by the laboratory 
            performing the test and consult official clinical guidelines.
          </li>
        </ul>
      </div>
    </div>
  );
}
