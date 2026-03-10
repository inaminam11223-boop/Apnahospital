import React, { useState } from 'react';
import { checkSymptoms } from '../../services/ai';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await checkSymptoms(symptoms);
      setResult(data);
    } catch (err) {
      setError('Failed to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">AI Symptom Checker</h1>
      <p className="text-slate-600">Describe your symptoms and get an instant AI assessment.</p>

      <div className="bg-white shadow-sm border border-slate-200 sm:rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="symptoms" className="block text-sm font-medium text-slate-700">
              Describe your symptoms
            </label>
            <textarea
              id="symptoms"
              rows={4}
              className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              placeholder="e.g., headache, fever, sore throat..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all hover:shadow-md"
          >
            {loading ? 'Analyzing...' : 'Check Symptoms'}
          </button>
        </form>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 border border-red-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-white shadow-sm border border-slate-200 sm:rounded-xl overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-blue-100">
            <h3 className="text-lg leading-6 font-medium text-blue-900">Assessment Result</h3>
            <p className="mt-1 max-w-2xl text-sm text-blue-600">Based on AI analysis.</p>
          </div>
          <div className="px-4 py-5 sm:p-6 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-slate-500">Possible Conditions</h4>
              <ul className="mt-2 list-disc list-inside text-sm text-slate-900">
                {result.possibleConditions?.map((c: string, i: number) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-slate-500">Urgency</h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                result.urgency === 'High' ? 'bg-red-100 text-red-800' :
                result.urgency === 'Medium' ? 'bg-amber-100 text-amber-800' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {result.urgency}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-500">Recommendation</h4>
              <p className="mt-1 text-sm text-slate-900">{result.recommendation}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-500">Advice</h4>
              <p className="mt-1 text-sm text-slate-900">{result.advice}</p>
            </div>

            <div className="mt-4 bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-amber-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700">
                    This is an AI-generated assessment and not a medical diagnosis. Please consult a doctor for professional advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
