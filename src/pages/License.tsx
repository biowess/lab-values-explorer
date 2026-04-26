import { FileText } from 'lucide-react';

export default function License() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-serif text-gray-900 tracking-tight flex items-center">
          <FileText className="w-8 h-8 mr-3 text-gray-900" />
          License
        </h1>
      </div>
      
      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-serif text-gray-900 mb-3">Apache License 2.0</h2>
          <p>
            This project is licensed under the Apache License, Version 2.0.
          </p>
          
          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-2">This license allows you to:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Commercial Use:</strong> Use the software for commercial purposes.</li>
              <li><strong>Modification:</strong> Alter the source code.</li>
              <li><strong>Distribution:</strong> Distribute copies of the software.</li>
              <li><strong>Patent Use:</strong> Provides an express grant of patent rights from contributors.</li>
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-2">Under the following conditions:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>License and Copyright Notice:</strong> You must include a copy of the license and original copyright notices.</li>
              <li><strong>State Changes:</strong> You must state any significant changes made to the software.</li>
            </ul>
          </div>
        </section>
        
        <section className="bg-gray-50 p-6 border border-gray-200 text-sm">
          <p>
            Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
          </p>
        </section>
      </div>
    </div>
  );
}
