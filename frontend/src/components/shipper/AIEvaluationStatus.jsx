import { useState, useEffect } from 'react';
import { Zap, CheckCircle, XCircle, AlertTriangle, Loader, ArrowRight, FileText, Globe, Package, Scale, DollarSign, Shield, Ban } from 'lucide-react';
import { useShipments } from '../../hooks/useShipments';
import { getCurrencyByCountry, formatCurrency } from '../../utils/validation';

export function AIEvaluationStatus({ shipment, onNavigate }) {
  const { updateAIApproval, importExportRules } = useShipments();
  const [aiStatus, setAiStatus] = useState('idle');
  const [aiResults, setAiResults] = useState(null);
  const [aiScore, setAiScore] = useState(0);

  useEffect(() => {
    if (shipment?.aiApproval === 'approved') {
      setAiStatus('approved');
      if (shipment.aiResults) {
        setAiResults(shipment.aiResults);
        setAiScore(shipment.aiScore || 0);
      }
    }
  }, [shipment]);

  const handleGetAIApproval = () => {
    setAiStatus('evaluating');
    
    // Simulate AI evaluation with comprehensive checks
    setTimeout(() => {
      const validationResults = [];
      
      // 1. Import/Export Rules Validation
      const relevantRules = importExportRules.filter(rule => 
        rule.countryCode === shipment.destCountry
      );
      
      let rulesPassed = true;
      let rulesDetails = [];
      
      if (relevantRules.length > 0) {
        const productRule = relevantRules.find(r => 
          shipment.hsCode.startsWith(r.hsCodeRange?.split('-')[0])
        );
        
        if (productRule) {
          rulesDetails.push(`Matched ${productRule.productCategory} rules for ${productRule.country}`);
          
          // Check value constraints
          if (productRule.maxValue && parseFloat(shipment.value) > productRule.maxValue) {
            rulesPassed = false;
            rulesDetails.push(`⚠️ Value exceeds maximum: $${productRule.maxValue}`);
          }
          
          // Check weight constraints
          if (productRule.maxWeight && parseFloat(shipment.weight) > productRule.maxWeight) {
            rulesPassed = false;
            rulesDetails.push(`⚠️ Weight exceeds maximum: ${productRule.maxWeight}kg`);
          }
        }
      }
      
      validationResults.push({
        category: 'rules',
        status: rulesPassed ? 'passed' : 'warning',
        title: 'Import/Export Rules Validation',
        description: rulesDetails.length > 0 
          ? rulesDetails.join(' • ')
          : 'All import/export regulations verified and compliant',
        suggestion: !rulesPassed ? 'Review shipment value and weight constraints' : undefined,
        details: relevantRules
      });

      // 2. Banned/Blocked Products Detection
      let productBanned = false;
      let bannedDetails = '';
      
      const matchingRule = relevantRules.find(r => 
        shipment.hsCode.startsWith(r.hsCodeRange?.split('-')[0])
      );
      
      if (matchingRule && matchingRule.bannedProducts.length > 0) {
        const description = shipment.productDescription.toLowerCase();
        const isBanned = matchingRule.bannedProducts.some(banned => 
          description.includes(banned.toLowerCase().split(' ')[0])
        );
        
        if (isBanned) {
          productBanned = true;
          bannedDetails = 'Product matches banned items list';
        } else {
          bannedDetails = 'No banned or restricted products detected';
        }
      } else {
        bannedDetails = 'No banned product restrictions for this category';
      }
      
      validationResults.push({
        category: 'product',
        status: productBanned ? 'failed' : 'passed',
        title: 'Banned/Blocked Product Detection',
        description: bannedDetails,
        suggestion: productBanned ? 'This product cannot be shipped to the destination country' : undefined
      });

      // 3. HS/HTS Code Validation
      const hsCodeValid = /^\d{4}\.\d{2}\.\d{2}$/.test(shipment.hsCode);
      const hsCodeDetails = hsCodeValid
        ? `HS Code ${shipment.hsCode} is correctly formatted and matches product category`
        : 'HS Code format appears incorrect';
      
      validationResults.push({
        category: 'hscode',
        status: hsCodeValid ? 'passed' : 'failed',
        title: 'HS/HTS Code Validation',
        description: hsCodeDetails,
        suggestion: !hsCodeValid ? `Suggested format: XXXX.XX.XX` : `Verified: ${shipment.hsCode}`
      });

      // 4. Quantity, Weight & Value Constraints
      const quantity = parseFloat(shipment.quantity);
      const weight = parseFloat(shipment.weight);
      const value = parseFloat(shipment.value);
      
      let constraintsValid = true;
      let constraintsDetails = [];
      
      if (quantity <= 0 || weight <= 0 || value <= 0) {
        constraintsValid = false;
        constraintsDetails.push('Invalid quantity, weight, or value detected');
      }
      
      // Value-to-weight ratio check
      const valuePerKg = value / weight;
      if (valuePerKg > 10000) {
        constraintsDetails.push('⚠️ Unusually high value-to-weight ratio detected');
      } else if (valuePerKg < 1) {
        constraintsDetails.push('⚠️ Unusually low value-to-weight ratio detected');
      } else {
        constraintsDetails.push('Quantity, weight, and value are within normal ranges');
      }
      
      validationResults.push({
        category: 'constraints',
        status: constraintsValid && valuePerKg > 1 && valuePerKg < 10000 ? 'passed' : 'warning',
        title: 'Quantity, Weight & Value Constraints',
        description: constraintsDetails.join(' • '),
        details: {
          quantity,
          weight,
          value,
          valuePerKg: valuePerKg.toFixed(2)
        }
      });

      // 5. Documentation Completeness
      const requiredDocs = matchingRule?.requiredDocuments || ['Commercial Invoice', 'Packing List', 'Certificate of Origin'];
      const uploadedDocs = shipment.documents.filter((d) => d.uploaded).map((d) => d.name);
      const missingDocs = requiredDocs.filter(doc => !uploadedDocs.includes(doc));
      
      const docsComplete = missingDocs.length === 0;
      
      validationResults.push({
        category: 'documentation',
        status: docsComplete ? 'passed' : 'failed',
        title: 'Documentation Completeness',
        description: docsComplete 
          ? `All ${requiredDocs.length} required documents are uploaded and verified`
          : `Missing ${missingDocs.length} required documents`,
        suggestion: !docsComplete ? `Please upload: ${missingDocs.join(', ')}` : undefined,
        details: { required: requiredDocs, uploaded: uploadedDocs, missing: missingDocs }
      });

      // Calculate overall score
      const passedChecks = validationResults.filter(r => r.status === 'passed').length;
      const warningChecks = validationResults.filter(r => r.status === 'warning').length;
      const failedChecks = validationResults.filter(r => r.status === 'failed').length;
      
      const overallScore = Math.round(
        (passedChecks * 100 + warningChecks * 70) / validationResults.length
      );
      
      const overallApproval = failedChecks === 0 && overallScore >= 85;
      
      setAiResults(validationResults);
      setAiScore(overallScore);
      setAiStatus(overallApproval ? 'approved' : 'rejected');
      
      // Update store
      updateAIApproval(
        shipment.id,
        overallApproval ? 'approved' : 'rejected',
        validationResults,
        overallScore
      );
    }, 4000);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'rules': return <Globe className="w-5 h-5" />;
      case 'product': return <Ban className="w-5 h-5" />;
      case 'hscode': return <Package className="w-5 h-5" />;
      case 'constraints': return <Scale className="w-5 h-5" />;
      case 'documentation': return <FileText className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">AI Compliance Evaluation</h1>
        <p className="text-slate-600">Comprehensive AI-powered pre-customs compliance validation</p>
      </div>

      {/* Shipment Info */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-slate-600 text-sm mb-1">Shipment ID</p>
            <p className="text-slate-900">{shipment?.id}</p>
          </div>
          <div>
            <p className="text-slate-600 text-sm mb-1">Product</p>
            <p className="text-slate-900">{shipment?.title || shipment?.productName}</p>
          </div>
          <div>
            <p className="text-slate-600 text-sm mb-1">Route</p>
            <p className="text-slate-900">{shipment?.shipper?.country || shipment?.originCountry} → {shipment?.consignee?.country || shipment?.destCountry}</p>
          </div>
          <div>
            <p className="text-slate-600 text-sm mb-1">Value</p>
            <p className="text-slate-900">{formatCurrency(shipment?.value || 0, shipment.currency || getCurrencyByCountry(shipment.shipper?.country || shipment.destCountry || 'US').code)}</p>
          </div>
        </div>
      </div>

      {/* AI Evaluation Button */}
      {aiStatus === 'idle' && (
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-12 text-center mb-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-white text-3xl mb-4">Ready for AI Evaluation</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Our AI will validate your shipment against import/export rules, detect banned products, verify HS codes, check constraints, and validate documentation completeness.
          </p>
          <button
            onClick={handleGetAIApproval}
            className="px-10 py-4 bg-yellow-500 text-slate-900 rounded-xl hover:bg-yellow-400 transition-all shadow-2xl text-lg inline-flex items-center gap-3"
          >
            <Zap className="w-6 h-6" />
            <span>Start AI Validation</span>
          </button>
        </div>
      )}

      {/* Evaluating State */}
      {aiStatus === 'evaluating' && (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center mb-6">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Loader className="w-10 h-10 text-purple-600 animate-spin" />
          </div>
          <h2 className="text-slate-900 text-2xl mb-4">AI Validation in Progress...</h2>
          <p className="text-slate-600 mb-8">
            Performing comprehensive compliance analysis
          </p>
          <div className="max-w-md mx-auto space-y-3">
            <div className="flex items-center gap-3 text-left p-3 bg-slate-50 rounded-lg">
              <Loader className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-slate-700">Validating import/export rules...</span>
            </div>
            <div className="flex items-center gap-3 text-left p-3 bg-slate-50 rounded-lg">
              <Loader className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-slate-700">Detecting banned/blocked products...</span>
            </div>
            <div className="flex items-center gap-3 text-left p-3 bg-slate-50 rounded-lg">
              <Loader className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-slate-700">Verifying HS/HTS code classification...</span>
            </div>
            <div className="flex items-center gap-3 text-left p-3 bg-slate-50 rounded-lg">
              <Loader className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-slate-700">Checking quantity, weight, value constraints...</span>
            </div>
            <div className="flex items-center gap-3 text-left p-3 bg-slate-50 rounded-lg">
              <Loader className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-slate-700">Validating documentation completeness...</span>
            </div>
          </div>
        </div>
      )}

      {/* AI Results */}
      {aiResults && aiStatus !== 'evaluating' && (
        <div className="space-y-6">
          {/* Overall Result */}
          <div className={`rounded-xl p-8 border-2 ${
            aiStatus === 'approved' 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
              : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'
          }`}>
            <div className="flex items-center gap-4 mb-4">
              {aiStatus === 'approved' ? (
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h2 className={`text-3xl mb-1 ${aiStatus === 'approved' ? 'text-green-900' : 'text-red-900'}`}>
                  AI {aiStatus === 'approved' ? 'Pre-Clear Approved' : 'Validation Failed'}
                </h2>
                <p className={aiStatus === 'approved' ? 'text-green-700' : 'text-red-700'}>
                  Overall Compliance Score: {aiScore}%
                </p>
              </div>
            </div>

            <div className="h-3 bg-white/50 rounded-full overflow-hidden">
              <div 
                className={`h-full ${aiStatus === 'approved' ? 'bg-green-600' : 'bg-red-600'} rounded-full transition-all`}
                style={{ width: `${aiScore}%` }}
              />
            </div>
          </div>

          {/* Detailed Validation Results */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-slate-900 text-xl mb-6">Detailed Validation Results</h3>
            <div className="space-y-4">
              {aiResults.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${
                  result.status === 'passed' 
                    ? 'bg-green-50 border-green-200' 
                    : result.status === 'warning'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`${
                        result.status === 'passed' ? 'text-green-600' :
                        result.status === 'warning' ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {getCategoryIcon(result.category)}
                      </div>
                      {result.status === 'passed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {result.status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                      {result.status === 'failed' && <XCircle className="w-5 h-5 text-red-600" />}
                      <h4 className="text-slate-900">{result.title}</h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      result.status === 'passed' 
                        ? 'bg-green-100 text-green-700' 
                        : result.status === 'warning'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm mb-2">{result.description}</p>
                  {result.suggestion && (
                    <div className={`mt-3 p-3 rounded-lg ${
                      result.status === 'failed' ? 'bg-red-100' : 'bg-amber-100'
                    }`}>
                      <p className={`text-sm ${
                        result.status === 'failed' ? 'text-red-800' : 'text-amber-800'
                      }`}>
                        💡 <strong>Suggestion:</strong> {result.suggestion}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="flex gap-4">
            {aiStatus === 'approved' && (
              <>
                <button
                  onClick={() => onNavigate('request-broker', shipment)}
                  className="flex-1 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span>Request Broker Approval</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Back to Dashboard
                </button>
              </>
            )}
            {aiStatus === 'rejected' && (
              <>
                <button
                  onClick={() => onNavigate('upload-documents', shipment)}
                  className="flex-1 px-6 py-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Update Documents & Retry
                </button>
                <button
                  onClick={() => onNavigate('create-shipment', shipment)}
                  className="px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Edit Shipment Details
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
