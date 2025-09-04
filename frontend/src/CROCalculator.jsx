import React, { useState, useEffect } from 'react';
import { ChevronRight, Zap, TrendingUp, Target, Users, DollarSign, AlertTriangle, CheckCircle, Mail, Phone, ExternalLink, BarChart3, Monitor, Smartphone, Globe } from 'lucide-react';

const API_BASE = "http://localhost:8000/api/v1/cro-audit";

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
  
  // Enhanced scanning animation states
  const [scanProgress, setScanProgress] = useState(0);
  const [issuesFound, setIssuesFound] = useState(0);
  const [currentScanText, setCurrentScanText] = useState('');
  const [scanningPhase, setScanningPhase] = useState('initializing');
  const [websiteScreenshot, setWebsiteScreenshot] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);

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

  const scanningSteps = [
    { text: 'Capturing website screenshot...', duration: 2000, phase: 'screenshot' },
    { text: 'Analyzing page structure and layout...', duration: 2500, phase: 'structure' },
    { text: 'Checking mobile responsiveness...', duration: 2200, phase: 'mobile' },
    { text: 'Evaluating page load speed...', duration: 1800, phase: 'performance' },
    { text: 'Scanning conversion funnels...', duration: 2000, phase: 'funnels' },
    { text: 'Analyzing checkout process...', duration: 1900, phase: 'checkout' },
    { text: 'Checking trust signals and security...', duration: 1600, phase: 'trust' },
    { text: 'Reviewing user experience patterns...', duration: 2300, phase: 'ux' },
    { text: 'Running competitor analysis...', duration: 2400, phase: 'competitors' },
    { text: 'Calculating revenue opportunities...', duration: 1800, phase: 'revenue' },
    { text: 'Finalizing recommendations...', duration: 1500, phase: 'final' }
  ];

  const analysisChecks = [
    'Page Speed Analysis',
    'Mobile Optimization',
    'Conversion Funnel Review',
    'Trust Signal Assessment', 
    'Checkout Process Audit',
    'User Experience Evaluation',
    'Competitor Benchmarking',
    'Revenue Opportunity Calculation'
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

  const generateWebsiteScreenshot = () => {
    // Simulate screenshot generation with a mock image
    const domain = formData.website_url.replace(/https?:\/\//, '').replace(/\/.*/, '');
    setWebsiteScreenshot(`https://api.screenshotmachine.com/?key=4eaebd&url=${encodeURIComponent(formData.website_url)}&dimension=1024x768`);
  };

  const analyzeWebsite = async () => {
    setIsAnalyzing(true);
    setError(null);
    setScanProgress(0);
    setIssuesFound(0);
    setCurrentScanText('');
    setCheckedItems([]);
    setScanningPhase('initializing');

    // Generate screenshot
    generateWebsiteScreenshot();

    // Start scanning animation
    let totalDuration = 0;
    let currentProgress = 0;
    let currentCheckIndex = 0;
    
    for (let i = 0; i < scanningSteps.length; i++) {
      const step = scanningSteps[i];
      totalDuration += step.duration;
      
      setTimeout(() => {
        setCurrentScanText(step.text);
        setScanningPhase(step.phase);
        currentProgress += (step.duration / 20000) * 100;
        setScanProgress(Math.min(currentProgress, 95));
        
        // Add completed checks
        if (currentCheckIndex < analysisChecks.length) {
          setCheckedItems(prev => [...prev, analysisChecks[currentCheckIndex]]);
          currentCheckIndex++;
        }
        
        // Randomly add issues during scan
        if (Math.random() > 0.5) {
          setIssuesFound(prev => prev + Math.floor(Math.random() * 2) + 1);
        }
      }, totalDuration - step.duration);
    }

    try {
      // Simulate API call with realistic timing
      setTimeout(async () => {
        setScanProgress(100);
        setCurrentScanText('Analysis complete!');
        setScanningPhase('complete');
        
        // Mock API response - replace with actual API call
        const mockResult = {
          audit_id: 'audit_' + Date.now(),
          website_screenshot: websiteScreenshot,
          current_metrics: {
            monthly_visitors: parseInt(formData.monthly_visitors),
            conversion_rate: parseFloat(formData.current_conversion_rate),
            average_order_value: parseFloat(formData.average_order_value),
            monthly_revenue: Math.round(parseInt(formData.monthly_visitors) * (parseFloat(formData.current_conversion_rate) / 100) * parseFloat(formData.average_order_value))
          },
          revenue_potential: {
            current_monthly_revenue: Math.round(parseInt(formData.monthly_visitors) * (parseFloat(formData.current_conversion_rate) / 100) * parseFloat(formData.average_order_value)),
            potential_monthly_revenue: Math.round(parseInt(formData.monthly_visitors) * (parseFloat(formData.current_conversion_rate) / 100) * parseFloat(formData.average_order_value) * 1.65),
            monthly_revenue_uplift: Math.round(parseInt(formData.monthly_visitors) * (parseFloat(formData.current_conversion_rate) / 100) * parseFloat(formData.average_order_value) * 0.65),
            annual_revenue_uplift: Math.round(parseInt(formData.monthly_visitors) * (parseFloat(formData.current_conversion_rate) / 100) * parseFloat(formData.average_order_value) * 0.65 * 12),
            total_uplift_percentage: 65
          },
          confidence_score: 87,
          issues_found: [
            {
              category: "Checkout Optimization",
              severity: "High",
              issue: "Complex checkout process with 5+ steps",
              description: "Your checkout has too many steps, causing 67% cart abandonment",
              potential_uplift: 23
            },
            {
              category: "Mobile Experience",
              severity: "High", 
              issue: "Mobile site loads 4.2s slower than desktop",
              description: "Mobile users are abandoning due to slow load times",
              potential_uplift: 18
            },
            {
              category: "Trust Signals",
              severity: "Medium",
              issue: "Missing security badges and testimonials",
              description: "Lack of trust indicators reducing conversion confidence",
              potential_uplift: 12
            },
            {
              category: "Product Pages",
              severity: "Medium",
              issue: "Product images lack zoom functionality",
              description: "Customers can't examine products closely before buying",
              potential_uplift: 8
            }
          ],
          competitor_analysis: [
            {
              name: "Top Competitor A",
              conversion_rate: 4.2,
              key_advantage: "One-click checkout with Apple Pay integration",
              estimated_revenue: Math.round(parseInt(formData.monthly_visitors) * 1.2 * 0.042 * parseFloat(formData.average_order_value))
            },
            {
              name: "Top Competitor B", 
              conversion_rate: 3.8,
              key_advantage: "Advanced product filtering and search",
              estimated_revenue: Math.round(parseInt(formData.monthly_visitors) * 1.1 * 0.038 * parseFloat(formData.average_order_value))
            }
          ],
          recommendations: [
            "Implement single-page checkout with guest option",
            "Add mobile-first design with progressive web app features",
            "Install trust badges, reviews, and security certifications",
            "Create urgency with limited-time offers and stock counters",
            "Optimize product images with 360° view and zoom",
            "Add exit-intent popups with discount incentives"
          ]
        };

        setTimeout(() => {
          setAuditResult(mockResult);
          setIsAnalyzing(false);
        }, 1500);
      }, 20000);

    } catch (err) {
      setError(err.message);
      setIsAnalyzing(false);
    }
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
      case 'High': return 'text-red-400 bg-red-900/20 border-red-800';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
      case 'Low': return 'text-green-400 bg-green-900/20 border-green-800';
      default: return 'text-gray-400 bg-gray-800/20 border-gray-700';
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
        {/* Enhanced Top Progress Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-lg border-b border-gray-700">
          <div className="relative h-2">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
              style={{ 
                width: `${scanProgress}%`,
                boxShadow: '0 2px 20px rgba(59, 130, 246, 0.3)'
              }}
            />
            {scanProgress < 100 && (
              <div 
                className="absolute top-0 w-32 h-full bg-gradient-to-r from-blue-400/30 to-transparent animate-pulse"
                style={{ left: `${Math.max(0, scanProgress - 10)}%` }}
              />
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-8 container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
                <Globe className="h-10 w-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Analyzing Your Store
              </h1>
              <p className="text-xl text-gray-300 mb-2">
                This may take a few seconds
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-gray-800 rounded-full text-sm text-blue-400 font-medium border border-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                Deep scanning for optimization opportunities
              </div>
            </div>

            {/* Enhanced Two-Column Layout */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              
              {/* Website Preview with Screenshot */}
              <div className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
                {/* Browser Header */}
                <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-gray-600 rounded-lg px-4 py-2 flex items-center">
                    <div className="w-4 h-4 text-green-400 mr-3">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-200 font-mono text-sm truncate">{formData.website_url}</span>
                  </div>
                  <div className="px-3 py-1 bg-orange-600 text-orange-100 rounded-lg text-xs font-semibold animate-pulse">
                    Scanning...
                  </div>
                </div>
                
                {/* Website Screenshot Area */}
                <div className="relative h-96 bg-gray-900">
                  {websiteScreenshot ? (
                    <div className="relative h-full">
                      <img 
                        src={websiteScreenshot} 
                        alt="Website Screenshot" 
                        className="w-full h-full object-cover object-top"
                        onError={() => setWebsiteScreenshot(null)}
                      />
                      {/* Scanning Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent">
                        <div 
                          className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse transition-all duration-1000"
                          style={{ 
                            marginTop: `${(scanProgress / 100) * 384}px`,
                            boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)'
                          }}
                        />
                      </div>
                      {/* Scanning Points */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                          <div 
                            key={i}
                            className="absolute w-3 h-3 bg-blue-500 rounded-full animate-ping"
                            style={{
                              left: `${20 + (i * 10)}%`,
                              top: `${30 + (i * 5)}%`,
                              animationDelay: `${i * 0.3}s`,
                              animationDuration: '2s'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Placeholder while loading screenshot
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-700 rounded-xl mx-auto mb-4 animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded w-32 mx-auto mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-600 rounded w-24 mx-auto animate-pulse"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Analysis Status */}
                <div className="px-6 py-4 bg-gray-700 border-t border-gray-600">
                  <div className="text-sm font-medium text-gray-200 mb-2">
                    {currentScanText}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Phase: {scanningPhase}</span>
                    <span>{Math.round(scanProgress)}% Complete</span>
                  </div>
                </div>
              </div>

              {/* Analysis Progress */}
              <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <BarChart3 className="mr-3 text-blue-400" />
                  Analysis Progress
                </h2>
                
                {/* Progress Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-6 bg-red-900/20 rounded-2xl text-center border border-red-800">
                    <div className="text-3xl font-bold text-red-400">{issuesFound}</div>
                    <div className="text-sm text-red-300 font-medium">Issues Found</div>
                  </div>
                  <div className="p-6 bg-blue-900/20 rounded-2xl text-center border border-blue-800">
                    <div className="text-3xl font-bold text-blue-400">{Math.round(scanProgress)}%</div>
                    <div className="text-sm text-blue-300 font-medium">Complete</div>
                  </div>
                </div>

                {/* Analysis Checklist */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">Optimization Checks</h3>
                  {analysisChecks.map((check, index) => (
                    <div key={index} className="flex items-center p-3 rounded-lg bg-gray-700 border border-gray-600">
                      <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                        checkedItems.includes(check) 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-600'
                      }`}>
                        {checkedItems.includes(check) && (
                          <CheckCircle className="w-3 h-3" />
                        )}
                      </div>
                      <span className={`text-sm font-medium ${
                        checkedItems.includes(check) ? 'text-green-300' : 'text-gray-300'
                      }`}>
                        {check}
                      </span>
                      {checkedItems.includes(check) && (
                        <div className="ml-auto text-green-400 animate-pulse">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Additional Stats */}
                <div className="mt-8 pt-6 border-t border-gray-600">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-800">
                      <div className="text-lg font-bold text-purple-400">250+</div>
                      <div className="text-xs text-purple-300">Data Points</div>
                    </div>
                    <div className="p-3 bg-green-900/20 rounded-lg border border-green-800">
                      <div className="text-lg font-bold text-green-400">{Math.round(scanProgress / 4)}s</div>
                      <div className="text-xs text-green-300">Time Elapsed</div>
                    </div>
                    <div className="p-3 bg-yellow-900/20 rounded-lg border border-yellow-800">
                      <div className="text-lg font-bold text-yellow-400">AI</div>
                      <div className="text-xs text-yellow-300">Powered</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">AI Analysis Engine</div>
                    <div className="text-sm text-gray-300">{currentScanText}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">{Math.round(scanProgress)}%</div>
                  <div className="text-sm text-gray-400">Progress</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <style jsx>{`
          @keyframes scanning-glow {
            0% { opacity: 0.4; transform: translateX(-50px); }
            50% { opacity: 1; }
            100% { opacity: 0.4; transform: translateX(50px); }
          }
        `}</style>
      </div>
    );
  }

  if (auditResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12 text-white">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Your CRO Audit is Ready!</h1>
              <p className="text-xl text-gray-300">We've identified significant opportunities for growth</p>
            </div>

            {/* Current Performance */}
            <div className="bg-gray-800 rounded-2xl p-8 mb-8 shadow-2xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
                <BarChart3 className="mr-3 text-blue-400" />
                Current Performance Snapshot
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-800">
                  <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-400">{auditResult.current_metrics.monthly_visitors.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">Monthly Visitors</div>
                </div>
                <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-800">
                  <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400">{auditResult.current_metrics.conversion_rate}%</div>
                  <div className="text-sm text-gray-300">Conversion Rate</div>
                </div>
                <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-800">
                  <DollarSign className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-400">${auditResult.current_metrics.average_order_value}</div>
                  <div className="text-sm text-gray-300">Average Order Value</div>
                </div>
                <div className="text-center p-4 bg-yellow-900/20 rounded-lg border border-yellow-800">
                  <TrendingUp className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-400">${auditResult.current_metrics.monthly_revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">Monthly Revenue</div>
                </div>
              </div>
            </div>

            {/* Revenue Potential */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 mb-8 text-white shadow-2xl">
              <h2 className="text-3xl font-bold mb-6">Revenue Recovery Roadmap</h2>
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
            <div className="bg-gray-800 rounded-2xl p-8 mb-8 shadow-2xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center text-red-400">
                <AlertTriangle className="mr-3" />
                Critical Issues Found
              </h2>
              <div className="grid gap-4">
                {auditResult.issues_found.slice(0, 4).map((issue, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="font-semibold text-sm text-gray-300">{issue.category}</span>
                          <span className={`ml-3 px-2 py-1 rounded text-xs font-bold ${getSeverityColor(issue.severity)}`}>
                            {issue.severity}
                          </span>
                        </div>
                        <h3 className="font-bold text-white mb-2">{issue.issue}</h3>
                        <p className="text-sm text-gray-300 mb-2">{issue.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">+{issue.potential_uplift}%</div>
                        <div className="text-xs text-gray-400">Potential Uplift</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-800">
                <p className="text-sm text-blue-300">
                  <strong>Found {auditResult.issues_found.length} total issues.</strong> The top 4 critical issues above represent your biggest opportunities for immediate impact.
                </p>
              </div>
            </div>

            {/* Competitor Analysis */}
            <div className="bg-gray-800 rounded-2xl p-8 mb-8 shadow-2xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-white">Competitor Gap Analysis</h2>
              <p className="text-gray-300 mb-6">Your top competitors are significantly outperforming you:</p>
              <div className="grid gap-4">
                {auditResult.competitor_analysis.map((competitor, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border border-gray-600 rounded-lg hover:bg-gray-700">
                    <div>
                      <div className="font-semibold text-white">{competitor.name}</div>
                      <div className="text-sm text-gray-300">{competitor.key_advantage}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-400">{competitor.conversion_rate}% CR</div>
                      <div className="text-sm text-gray-400">${competitor.estimated_revenue.toLocaleString()}/mo revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gray-800 rounded-2xl p-8 mb-8 shadow-2xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
                <Zap className="mr-3 text-yellow-400" />
                Priority Recommendations
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {auditResult.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start p-4 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="text-gray-300">{rec}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-orange-600 to-red-700 rounded-2xl p-8 text-white text-center shadow-2xl">
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
                Limited slots available - 2 spots left this week
              </div>
            </div>

            {/* Contact Form Modal */}
            {showContactForm && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
                  <h3 className="text-2xl font-bold mb-6 text-white">Get Your Complete CRO Roadmap</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone (Optional)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-800 text-red-400 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  {contactSuccess && (
                    <div className="mt-4 p-3 bg-green-900/20 border border-green-800 text-green-400 rounded-lg text-sm">
                      Thank you! Your details have been submitted. We'll be in touch soon.
                    </div>
                  )}
                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setShowContactForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 text-gray-300"
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
    <div className="min-h-screen bg-gradient-to-br from-[#401F86] via-slate-900 to-[#633eac]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12 text-white">
            <h1 className="text-4xl font-bold mb-4">AI Powered CRO Audit</h1>
            <p className="text-xl text-gray-300">
              Uncover exactly how much revenue you're leaving on the table
            </p>
            <div className="mt-4 text-sm bg-[#401F86] inline-block px-4 py-2 rounded-full">
              Only 7 free audits remaining today
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
                      ? 'bg-[#401F86] text-[#D5C8F0]'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-[#D5C8F0] h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-gradient-to-br from-[#401F86] via-slate-900 to-[#633eac] rounded-2xl p-8 shadow-2xl border border-gray-700">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-300">{steps[currentStep].subtitle}</p>
            </div>

            <div className="space-y-6">
              
              {/* Step 1: Website Information */}
              {currentStep === 0 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => handleInputChange('website_url', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      placeholder="https://yourstore.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Monthly Website Visitors
                    </label>
                    <input
                      type="number"
                      value={formData.monthly_visitors}
                      onChange={(e) => handleInputChange('monthly_visitors', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      placeholder="e.g., 50000"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Check Google Analytics or similar tools for this data
                    </p>
                  </div>
                </>
              )}

              {/* Step 2: Current Performance */}
              {currentStep === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Conversion Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.current_conversion_rate}
                      onChange={(e) => handleInputChange('current_conversion_rate', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      placeholder="e.g., 2.5"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Orders ÷ Visitors × 100 (Industry average: 2-3%)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Average Order Value ($)
                    </label>
                    <input
                      type="number"
                      value={formData.average_order_value}
                      onChange={(e) => handleInputChange('average_order_value', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      placeholder="e.g., 125"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Total Revenue ÷ Number of Orders
                    </p>
                  </div>
                  
                  {/* Show current revenue preview */}
                  {formData.monthly_visitors && formData.current_conversion_rate && formData.average_order_value && (
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800">
                      <div className="text-sm text-gray-300 mb-1">Current Monthly Revenue:</div>
                      <div className="text-2xl font-bold text-blue-400">
                        ${Math.round(parseInt(formData.monthly_visitors) * (parseFloat(formData.current_conversion_rate) / 100) * parseFloat(formData.average_order_value)).toLocaleString()}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Step 3: Goals */}
              {currentStep === 2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    What's your primary optimization goal?
                  </label>
                  <div className="grid gap-3">
                    {primaryGoals.map((goal, index) => (
                      <button
                        key={index}
                        onClick={() => handleInputChange('primary_goal', goal)}
                        className={`p-4 text-left border rounded-lg transition-all ${
                          formData.primary_goal === goal
                            ? 'border-blue-500 bg-blue-900/20 text-blue-400'
                            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            formData.primary_goal === goal
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-500'
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
                className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className="px-6 py-3 bg-[#6f51b1] text-white rounded-lg hover:bg-[#60449c] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={analyzeWebsite}
                  disabled={!isStepValid(currentStep)}
                  className="px-8 py-3 bg-gradient-to-r from-[#6f51b1] to-[#60449c] text-white rounded-lg hover:from-[#6f51b1] hover:to-[#60449c] disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Analyze My Website
                </button>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-gray-600 text-center text-gray-400 text-sm">
              <div className="flex items-center justify-center space-x-6">
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-[#D5C8F0]" />
                  Trusted by 500+ brands
                </span>
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-[#D5C8F0]" />
                  100% Free Analysis
                </span>
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-[#D5C8F0]" />
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