import { useState, useEffect } from 'react';
import { 
  Brain, 
  FileText, 
  DollarSign, 
  AlertCircle, 
  CheckCircle,
  TrendingUp,
  Globe,
  Shield,
  Loader
} from 'lucide-react';

interface AIComplianceProps {
  shipmentData: any;
  onComplete: (data: any) => void;
}

export function AICompliance({ shipmentData, onComplete }: AIComplianceProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisData, setAnalysisData] = useState<any>(null);

  useEffect(() => {
    // Simulate AI analysis
    setTimeout(() => {
      const hasExceptions = Math.random() > 0.6; // 40% chance of exceptions
      
      const declaredValue = parseFloat(shipmentData?.declaredValue || '1000');
      
      setAnalysisData({
        nlpAnalysis: {
          extractedMeaning: 'Consumer electronics device for audio playback with wireless connectivity capabilities',
          predictedHSCode: '8518.30.20',
          confidence: 94,
          matchScore: 92,
          tariffDefinition: 'Headphones and earphones, whether or not combined with a microphone, and sets consisting of a microphone and one or more loudspeakers'
        },
        regulations: {
          importRules: [
            'FCC certification required for wireless devices',
            'Product safety testing compliance needed',
            'CE marking required for EU destinations'
          ],
          exportRules: [
            'Standard export declaration required',
            'No special export license needed'
          ],
          restricted: [],
          prohibited: [],
          sanctionsStatus: 'Clear - No sanctions matches found'
        },
        documents: {
          required: [
            { name: 'Certificate of Origin', status: 'missing' },
            { name: 'Commercial Invoice', status: 'missing' },
            { name: 'MSDS (Material Safety Data Sheet)', status: 'missing' },
            { name: 'Packing List', status: 'missing' }
          ],
          optional: [
            { name: 'FCC Certificate', status: 'recommended' },
            { name: 'Product Specifications', status: 'recommended' }
          ]
        },
        duties: {
          customsDuty: 2.5,
          customsDutyAmount: declaredValue * 0.025,
          vat: 20,
          vatAmount: declaredValue * 0.20,
          otherFees: 45,
          totalEstimate: declaredValue * 0.025 + declaredValue * 0.20 + 45
        },
        hasExceptions
      });
      
      setIsAnalyzing(false);
    }, 3000);
  }, [shipmentData]);

  const handleContinue = () => {
    onComplete(analysisData);
  };

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Brain className="w-12 h-12 text-blue-600" />
            </div>
            <Loader className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
          </div>
          <h2 className="text-slate-900 mb-2">AI Analysis in Progress</h2>
          <p className="text-slate-600">Analyzing product description and compliance requirements...</p>
          <div className="mt-6 space-y-2 text-slate-500 text-sm">
            <p>✓ Extracting product attributes</p>
            <p>✓ Predicting HS code classification</p>
            <p>✓ Checking trade regulations</p>
            <p>✓ Calculating duties and taxes</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">AI Compliance Verification</h1>
        <p className="text-slate-600">Automated analysis complete for {shipmentData?.productName}</p>
      </div>

      <div className="space-y-6">
        {/* NLP Analysis */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-purple-600" />
            <h2 className="text-slate-900">NLP Analysis</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-600 mb-2">Extracted Meaning</label>
              <p className="text-slate-900 p-4 bg-slate-50 rounded-lg">
                {analysisData.nlpAnalysis.extractedMeaning}
              </p>
            </div>

            <div>
              <label className="block text-slate-600 mb-2">Tariff Definition Match</label>
              <p className="text-slate-900 p-4 bg-slate-50 rounded-lg text-sm">
                {analysisData.nlpAnalysis.tariffDefinition}
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-700">Predicted HS/HTS Code</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-blue-900 text-2xl">{analysisData.nlpAnalysis.predictedHSCode}</p>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Confidence Score</span>
                  <span className="text-green-900">{analysisData.nlpAnalysis.confidence}%</span>
                </div>
                <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 rounded-full transition-all"
                    style={{ width: `${analysisData.nlpAnalysis.confidence}%` }}
                  />
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Match Score</span>
                  <span className="text-green-900">{analysisData.nlpAnalysis.matchScore}%</span>
                </div>
                <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 rounded-full transition-all"
                    style={{ width: `${analysisData.nlpAnalysis.matchScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regulations */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-blue-600" />
            <h2 className="text-slate-900">Regulations & Compliance</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-slate-900 mb-3">Import Rules</h3>
              <ul className="space-y-2">
                {analysisData.regulations.importRules.map((rule: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-slate-900 mb-3">Export Rules</h3>
              <ul className="space-y-2">
                {analysisData.regulations.exportRules.map((rule: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <h3 className="text-slate-900">Sanctions Screening</h3>
              </div>
              <p className="text-green-700">{analysisData.regulations.sanctionsStatus}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="text-slate-900 mb-2">Restricted/Prohibited Items</h3>
              <p className="text-slate-600">
                {analysisData.regulations.restricted.length === 0 
                  ? 'No restrictions found' 
                  : analysisData.regulations.restricted.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Required Documents */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-orange-600" />
            <h2 className="text-slate-900">Required Documents</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {analysisData.documents.required.map((doc: any, index: number) => (
              <div key={index} className="p-4 border-2 border-orange-200 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <span className="text-slate-900">{doc.name}</span>
                  </div>
                  <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm">
                    Required
                  </span>
                </div>
              </div>
            ))}
            
            {analysisData.documents.optional.map((doc: any, index: number) => (
              <div key={index} className="p-4 border border-slate-200 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-600" />
                    <span className="text-slate-900">{doc.name}</span>
                  </div>
                  <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm">
                    Optional
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Duties & Taxes */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h2 className="text-slate-900">Duties & Taxes Estimate</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-700">Customs Duty ({analysisData.duties.customsDuty}%)</span>
              <span className="text-slate-900">${analysisData.duties.customsDutyAmount.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-700">VAT/GST ({analysisData.duties.vat}%)</span>
              <span className="text-slate-900">${analysisData.duties.vatAmount.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-700">Processing & Other Fees</span>
              <span className="text-slate-900">${analysisData.duties.otherFees.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <span className="text-slate-900">Total Estimated Cost</span>
              <span className="text-blue-900 text-xl">${analysisData.duties.totalEstimate.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-xl">
          {analysisData.hasExceptions ? (
            <div className="flex items-center gap-3 text-orange-600">
              <AlertCircle className="w-6 h-6" />
              <div>
                <p className="text-slate-900">Exceptions Detected</p>
                <p className="text-slate-600 text-sm">Some items require your attention</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle className="w-6 h-6" />
              <div>
                <p className="text-slate-900">All Checks Passed</p>
                <p className="text-slate-600 text-sm">Ready to proceed</p>
              </div>
            </div>
          )}

          <button
            onClick={handleContinue}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            {analysisData.hasExceptions ? 'Resolve Exceptions' : 'Generate Pre-Clear Token'}
          </button>
        </div>
      </div>
    </div>
  );
}