import { User, Settings as SettingsIcon, Bell, Shield } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif text-gray-900 mb-8 tracking-tight">Settings & Preferences</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-1">
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-none">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-none transition-colors">
            <SettingsIcon className="w-4 h-4" />
            <span>Preferences</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-none transition-colors">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-none transition-colors">
            <Shield className="w-4 h-4" />
            <span>Privacy</span>
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-8">
          <section className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Profile Information</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" defaultValue="Dr. Jane Doe" className="w-full px-3 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" defaultValue="jane.doe@hospital.org" className="w-full px-3 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <input type="text" defaultValue="General Medical Center" className="w-full px-3 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none" />
              </div>
              <div className="pt-4">
                <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Clinical Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Default Age Unit</h3>
                  <p className="text-sm text-gray-500">Preferred unit for age input on lab detail pages.</p>
                </div>
                <select className="px-3 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none bg-white text-sm">
                  <option>Years</option>
                  <option>Months</option>
                  <option>Days</option>
                </select>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Default Patient Sex</h3>
                  <p className="text-sm text-gray-500">Pre-select sex for reference range evaluation.</p>
                </div>
                <select className="px-3 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none bg-white text-sm">
                  <option>None</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
