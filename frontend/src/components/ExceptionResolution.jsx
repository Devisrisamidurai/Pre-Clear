import { useState } from 'react';
import { AlertTriangle, Upload, CheckCircle, FileText, Sparkles } from 'lucide-react';

interface ExceptionResolutionProps {
  shipmentData: any;
  onResolve: () => void;
}

export function ExceptionResolution({ shipmentData, onResolve }: ExceptionResolutionProps) {
  const [exceptions, setExceptions] = useState([
    {
      id: 1,
      type: 'hs-code',
      title: 'HS Code Verification Required',
      description: 'Predicted HS code 8518.30.20 has medium confidence. Please verify or select alternative.',
      severity: 'medium',
      resolved: false,
      suggestions: [
        { code: '8518.30.20', description: 'Headphones and earphones (wireless)', confidence: 94 },
        { code: '8518.30.10', description: 'Headphones and earphones (wired)', confidence: 78 },
        { code: '8517.62.00', description: 'Machines for reception/transmission of voice/data', confidence: 65 }
      ],
      selectedSuggestion: null
    },
    {
      id: 2,
      type: 'document',
      title: 'Missing Required Documents',
      description: 'Certificate of Origin and MSDS are required for customs clearance.',
      severity: 'high',
      resolved: false,
      missingDocs: [
        { name: 'Certificate of Origin', uploaded: false },
        { name: 'MSDS (Material Safety Data Sheet)', uploaded: false }
      ]
    },
    {
      id: 3,
      type: 'regulation',
      title: 'Country-Specific Regulation',
      description: 'Destination country requires FCC certification for wireless electronic devices.',
      severity: 'medium',
      resolved: false,
      hint: 'Upload FCC certificate or request exemption for low-power devices under 47 CFR Part 15'
    }
  ]);

  const handleSelectHSCode = (exceptionId: number, suggestionIndex: number) => {
    setExceptions(prev => prev.map(ex => 
      ex.id === exceptionId 
        ? { ...ex, selectedSuggestion: suggestionIndex, resolved: true }
        : ex
    ));
  };

  const handleUploadDocument = (exceptionId: number, docIndex: number) => {
    setExceptions(prev => prev.map(ex => {
      if (ex.id === exceptionId && ex.missingDocs) {
        const updatedDocs = [...ex.missingDocs];
        updatedDocs[docIndex] = { ...updatedDocs[docIndex], uploaded: true };
        const allUploaded = updatedDocs.every(doc => doc.uploaded);
        return { ...ex, missingDocs: updatedDocs, resolved: allUploaded };
      }
      return ex;
    }));
  };

  const handleResolveRegulation = (exceptionId: number) => {
    setExceptions(prev => prev.map(ex => 
      ex.id === exceptionId ? { ...ex, resolved: true } : ex
    ));
  };

  const handleResolveAll = () => {
    setExceptions(prev => prev.map(ex => ({ ...ex, resolved: true })));
    setTimeout(() => {
      onResolve();
    }, 1000);
  };

  const allResolved = exceptions.every(ex => ex.resolved);
  const unresolvedCount = exceptions.filter(ex => !ex.resolved).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-slate-900">Exception Resolution Workspace</h1>
            <p className="text-slate-600">
              {unresolvedCount} {unresolvedCount === 1 ? 'issue' : 'issues'} requiring attention
            </p>
          </div>
        </div>
      </div>

      {/* Risk Level Indicator */}
      <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <div>
              <p className="text-slate-900">Risk Level: Medium</p>
              <p className="text-slate-600 text-sm">Shipment can proceed after resolving exceptions</p>
            </div>
          </div>
          <button
            onClick={handleResolveAll}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Resolve All with AI
          </button>
        </div>
      </div>

      {/* Exceptions List */}
      <div className="space-y-6">
        {exceptions.map((exception) => (
          <div 
            key={exception.id} 
            className={`bg-white rounded-xl border-2 transition-all ${
              exception.resolved 
                ? 'border-green-200 bg-green-50/30' 
                : exception.severity === 'high'
                ? 'border-red-200'
                : 'border-orange-200'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  {exception.resolved ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  ) : (
                    <AlertTriangle className={`w-6 h-6 mt-1 ${
                      exception.severity === 'high' ? 'text-red-600' : 'text-orange-600'
                    }`} />
                  )}
                  <div>
                    <h3 className="text-slate-900 mb-1">{exception.title}</h3>
                    <p className="text-slate-600">{exception.description}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  exception.resolved
                    ? 'bg-green-100 text-green-700'
                    : exception.severity === 'high'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {exception.resolved ? 'Resolved' : exception.severity === 'high' ? 'High Priority' : 'Medium Priority'}
                </span>
              </div>

              {/* HS Code Suggestions */}
              {exception.type === 'hs-code' && exception.suggestions && (
                <div className="mt-4 space-y-3">
                  <p className="text-slate-700">Select the correct HS code:</p>
                  {exception.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectHSCode(exception.id, index)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        exception.selectedSuggestion === index
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-900">{suggestion.code}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-600 text-sm">{suggestion.confidence}% confidence</span>
                          {exception.selectedSuggestion === index && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm">{suggestion.description}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Document Upload */}
              {exception.type === 'document' && exception.missingDocs && (
                <div className="mt-4 space-y-3">
                  <p className="text-slate-700">Upload required documents:</p>
                  {exception.missingDocs.map((doc, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border ${
                        doc.uploaded 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className={`w-5 h-5 ${doc.uploaded ? 'text-green-600' : 'text-slate-400'}`} />
                          <span className="text-slate-900">{doc.name}</span>
                        </div>
                        {doc.uploaded ? (
                          <span className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            Uploaded
                          </span>
                        ) : (
                          <button
                            onClick={() => handleUploadDocument(exception.id, index)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Upload
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Regulation Hint */}
              {exception.type === 'regulation' && exception.hint && (
                <div className="mt-4">
                  <div className="p-4 bg-blue-50 rounded-lg mb-3">
                    <p className="text-blue-900">💡 AI Recommendation:</p>
                    <p className="text-slate-700 text-sm mt-1">{exception.hint}</p>
                  </div>
                  {!exception.resolved && (
                    <button
                      onClick={() => handleResolveRegulation(exception.id)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Mark as Resolved
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-900 mb-1">
              {allResolved ? 'All exceptions resolved!' : `${unresolvedCount} exception(s) remaining`}
            </p>
            <p className="text-slate-600 text-sm">
              {allResolved ? 'You can now proceed to generate your Pre-Clear Token' : 'Resolve all exceptions to continue'}
            </p>
          </div>
          <button
            onClick={onResolve}
            disabled={!allResolved}
            className={`px-8 py-3 rounded-xl transition-all ${
              allResolved
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Generate Pre-Clear Token
          </button>
        </div>
      </div>
    </div>
  );
}
