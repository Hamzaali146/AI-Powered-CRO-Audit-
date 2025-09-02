import React, { useState } from 'react';
import { ChevronRight, Zap, TrendingUp, Target, Users, DollarSign, AlertTriangle, CheckCircle, Mail, Phone, ExternalLink, BarChart3 } from 'lucide-react';

const API_BASE = "http://localhost:8000/cro-audit";

const CROCalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    website_url: '',
    monthly_visitors: '',
    current_conversion_rate: '',
    average_order_value: '',
    primary_goal: '',
    name: '',
    email: '',
    phone: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [error, setError] = useState(null);
  const [contactSuccess, setContactSuccess] = useState(false);

  const steps = [
    {
      title: "Website Information",
      subtitle: "Let's start with your basic website metrics",
      fields: ['website_url', 'monthly_visitors']
    },
    {
      title: "Current Performance",
      subtitle: "Tell us about your current conversion metrics",
      fields: ['current_conversion_rate', 'average_order_value']
    },
    {
      title: "Optimization Goals", 
      subtitle: "What's your primary conversion goal?",
      fields: ['primary_goal']
    }
  ];

  const primaryGoals = [
    "Increase overall conversion rate",
    "Reduce cart abandonment",
    "Improve average order value",
    "Boost mobile conversions",
    "Optimize checkout process",
    "Enhance user experience"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = (stepIndex) => {
    const stepFields = steps[stepIndex].fields;
    return stepFields.every(field => formData[field] && formData[field].toString().trim() !== '');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const analyzeWebsite = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website_url: formData.website_url,
          monthly_visitors: parseInt(formData.monthly_visitors),
          current_conversion_rate: parseFloat(formData.current_conversion_rate),
          average_order_value: parseFloat(formData.average_order_value),
          industry: 'ecommerce',
          primary_goal: formData.primary_goal
        })
      });
      if (!response.ok) throw new Error('Failed to analyze website');
      const result = await response.json();
      setAuditResult(result);
    } catch (err) {
      setError(err.message);
    }
    setIsAnalyzing(false);
  };

  const submitContactInfo = async () => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/contact?audit_id=${auditResult.audit_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
      });
      if (!response.ok) throw new Error('Failed to submit contact info');
      setContactSuccess(true);
      setShowContactForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-8"></div>
          <h2 className="text-3xl font-bold mb-4">🤖 AI Analysis in Progress...</h2>
          <div className="space-y-2 text-lg opacity-90">
            <p>🔍 Scanning your website for CRO opportunities</p>
            <p>📊 Analyzing competitor conversion strategies</p>
            <p>💡 Calculating your revenue potential</p>
          </div>
          <div className="mt-8 bg-white/10 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-sm">Our AI is analyzing over 150+ conversion factors to identify your biggest opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (auditResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12 text-white">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-6">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4">🎉 Your CRO Audit is Ready!</h1>
              <p className="text-xl opacity-90">We've identified significant opportunities for growth</p>
            </div>

            {/* Current Performance */}
            <div className="bg-white rounded-2xl p-8 mb-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <BarChart3 className="mr-3 text-blue-600" />
                Current Performance Snapshot
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{auditResult.current_metrics.monthly_visitors.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Monthly Visitors</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{auditResult.current_metrics.conversion_rate}%</div>
                  <div className="text-sm text-gray-600">Conversion Rate</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">${auditResult.current_metrics.average_order_value}</div>
                  <div className="text-sm text-gray-600">Average Order Value</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">${auditResult.current_metrics.monthly_revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                </div>
              </div>
            </div>

            {/* Revenue Potential */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 mb-8 text-white shadow-2xl">
              <h2 className="text-3xl font-bold mb-6">💰 Revenue Recovery Roadmap</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Current vs Potential</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Current Monthly Revenue:</span>
                      <span className="font-bold">${auditResult.revenue_potential.current_monthly_revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Potential Monthly Revenue:</span>
                      <span className="font-bold">${auditResult.revenue_potential.potential_monthly_revenue.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-green-400 pt-3 flex justify-between items-center text-lg font-bold">
                      <span>Monthly Uplift:</span>
                      <span>+${auditResult.revenue_potential.monthly_revenue_uplift.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Annual Impact</h3>
                  <div className="text-center p-6 bg-white/20 rounded-lg">
                    <div className="text-4xl font-bold mb-2">
                      +${auditResult.revenue_potential.annual_revenue_uplift.toLocaleString()}
                    </div>
                    <div className="text-lg opacity-90">Annual Revenue Potential</div>
                    <div className="text-sm mt-2 opacity-75">
                      {auditResult.revenue_potential.total_uplift_percentage}% total uplift potential
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Issues */}
            <div className="bg-white rounded-2xl p-8 mb-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center text-red-600">
                <AlertTriangle className="mr-3" />
                Critical Issues Found
              </h2>
              <div className="grid gap-4">
                {auditResult.issues_found.slice(0, 4).map((issue, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="font-semibold text-sm">{issue.category}</span>
                          <span className={`ml-3 px-2 py-1 rounded text-xs font-bold ${getSeverityColor(issue.severity)}`}>
                            {issue.severity}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{issue.issue}</h3>
                        <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">+{issue.potential_uplift}%</div>
                        <div className="text-xs text-gray-500">Potential Uplift</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Found {auditResult.issues_found.length} total issues.</strong> The top 4 critical issues above represent your biggest opportunities for immediate impact.
                </p>
              </div>
            </div>

            {/* Competitor Analysis */}
            <div className="bg-white rounded-2xl p-8 mb-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">📊 Competitor Gap Analysis</h2>
              <p className="text-gray-600 mb-6">Your top competitors are significantly outperforming you:</p>
              <div className="grid gap-4">
                {auditResult.competitor_analysis.map((competitor, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <div className="font-semibold">{competitor.name}</div>
                      <div className="text-sm text-gray-600">{competitor.key_advantage}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{competitor.conversion_rate}% CR</div>
                      <div className="text-sm text-gray-500">${competitor.estimated_revenue.toLocaleString()}/mo revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl p-8 mb-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Zap className="mr-3 text-yellow-500" />
                Priority Recommendations
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {auditResult.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="text-gray-700">{rec}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white text-center shadow-2xl">
              <h2 className="text-3xl font-bold mb-4">Ready to Capture Your ${Math.round(auditResult.revenue_potential.monthly_revenue_uplift/1000)}K/mo Opportunity?</h2>
              <p className="text-xl mb-8 opacity-90">
                Get your complete audit report + 90-day implementation roadmap
              </p>
              
              <div className="bg-white/20 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold">{auditResult.confidence_score}%</div>
                    <div className="text-sm opacity-75">Confidence Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{auditResult.issues_found.length}</div>
                    <div className="text-sm opacity-75">Issues Identified</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">${auditResult.revenue_potential.annual_revenue_uplift.toLocaleString()}</div>
                    <div className="text-sm opacity-75">Annual Potential</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowContactForm(true)}
                className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
              >
                Get Your Complete Report <ChevronRight className="ml-2" />
              </button>
              
              <div className="mt-6 text-sm opacity-75">
                ⏰ Limited slots available • 🔥 2 spots left this week
              </div>
            </div>

            {/* Contact Form Modal */}
            {showContactForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                  <h3 className="text-2xl font-bold mb-6">Get Your Complete CRO Roadmap</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  {contactSuccess && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
                      Thank you! Your details have been submitted. We'll be in touch soon.
                    </div>
                  )}
                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setShowContactForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitContactInfo}
                      disabled={!formData.name || !formData.email}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Get My Report
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12 text-white">
            <h1 className="text-4xl font-bold mb-4">AI-Powered CRO Audit</h1>
            <p className="text-xl opacity-90">
              Uncover exactly how much revenue you're leaving on the table
            </p>
            <div className="mt-4 text-sm bg-orange-500 inline-block px-4 py-2 rounded-full">
              ⚡ Only 7 free audits remaining today
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index <= currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/20 text-white/60'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600">{steps[currentStep].subtitle}</p>
            </div>

            <div className="space-y-6">
              
              {/* Step 1: Website Information */}
              {currentStep === 0 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => handleInputChange('website_url', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://yourstore.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Website Visitors
                    </label>
                    <input
                      type="number"
                      value={formData.monthly_visitors}
                      onChange={(e) => handleInputChange('monthly_visitors', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 50000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Check Google Analytics or similar tools for this data
                    </p>
                  </div>
                </>
              )}

              {/* Step 2: Current Performance */}
              {currentStep === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Conversion Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.current_conversion_rate}
                      onChange={(e) => handleInputChange('current_conversion_rate', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 2.5"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Orders ÷ Visitors × 100 (Industry average: 2-3%)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average Order Value ($)
                    </label>
                    <input
                      type="number"
                      value={formData.average_order_value}
                      onChange={(e) => handleInputChange('average_order_value', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 125"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Total Revenue ÷ Number of Orders
                    </p>
                  </div>
                  
                  {/* Show current revenue preview */}
                  {formData.monthly_visitors && formData.current_conversion_rate && formData.average_order_value && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Current Monthly Revenue:</div>
                      <div className="text-2xl font-bold text-blue-600">
                        ${Math.round(parseInt(formData.monthly_visitors) * (parseFloat(formData.current_conversion_rate) / 100) * parseFloat(formData.average_order_value)).toLocaleString()}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Step 3: Goals */}
              {currentStep === 2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    What's your primary optimization goal?
                  </label>
                  <div className="grid gap-3">
                    {primaryGoals.map((goal, index) => (
                      <button
                        key={index}
                        onClick={() => handleInputChange('primary_goal', goal)}
                        className={`p-4 text-left border rounded-lg transition-all ${
                          formData.primary_goal === goal
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            formData.primary_goal === goal
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {formData.primary_goal === goal && (
                              <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                            )}
                          </div>
                          <span className="font-medium">{goal}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={analyzeWebsite}
                  disabled={!isStepValid(currentStep)}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Analyze My Website
                </button>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t text-center text-gray-500 text-sm">
              <div className="flex items-center justify-center space-x-6">
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Trusted by 500+ brands
                </span>
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  100% Free Analysis
                </span>
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  No Credit Card Required
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CROCalculator;