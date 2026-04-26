import { useState } from 'react';
import { Settings as SettingsIcon, Database, AlertTriangle } from 'lucide-react';
import { useLocalData } from '../context/LocalDataContext';
import { AgeUnit } from '../types';

export default function Settings() {
  const { preferences, updatePreferences, clearLocalData } = useLocalData();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDeleteData = () => {
    clearLocalData();
    setShowConfirmDelete(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif text-gray-900 mb-8 tracking-tight">Settings & Preferences</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-1">
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-none">
            <SettingsIcon className="w-4 h-4" />
            <span>Preferences</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-none transition-colors">
            <Database className="w-4 h-4" />
            <span>Local Data</span>
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-8">
          <section className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Clinical Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Default Age Unit</h3>
                  <p className="text-sm text-gray-500">Preferred unit for age input on lab detail pages.</p>
                </div>
                <select 
                  value={preferences.defaultAgeUnit}
                  onChange={(e) => updatePreferences({ defaultAgeUnit: e.target.value as AgeUnit })}
                  className="px-3 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none bg-white text-sm"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Default Patient Sex</h3>
                  <p className="text-sm text-gray-500">Pre-select sex for reference range evaluation.</p>
                </div>
                <select 
                  value={preferences.defaultSex}
                  onChange={(e) => updatePreferences({ defaultSex: e.target.value as 'all' | 'male' | 'female' })}
                  className="px-3 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none bg-white text-sm"
                >
                  <option value="all">None</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Local Data Management</h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                All your saved labs and preferences are stored locally in this browser. We do not use accounts or remote servers.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-4 py-2 border border-red-200 text-red-700 bg-red-50 text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Delete local data
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-medium text-gray-900">Delete local data?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              This will permanently remove all your saved labs and locally stored preferences from this browser. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteData}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
