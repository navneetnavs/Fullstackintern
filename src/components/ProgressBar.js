import React, { useState, useEffect } from 'react';

const ProgressBar = ({ 
  message = "Processing your image...", 
  subMessage = "This may take a few moments",
  duration = 3000,
  steps = [
    "Uploading image...",
    "Analyzing image for PII...",
    "Detecting faces and text...",
    "Applying privacy masks...",
    "Finalizing results..."
  ]
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepDuration = duration / steps.length;
    const progressIncrement = 100 / steps.length;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (progressIncrement / (stepDuration / 100));
        
        // Update current step based on progress
        const newStep = Math.floor((newProgress / 100) * steps.length);
        if (newStep !== currentStep && newStep < steps.length) {
          setCurrentStep(newStep);
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, steps.length, currentStep]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex flex-col items-center space-y-6">
          {/* AI Processing Animation */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          
          {/* Progress Information */}
          <div className="text-center w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {steps[currentStep] || message}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {subMessage}
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {/* Progress Percentage */}
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
          
          {/* Processing Steps Indicator */}
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index <= currentStep 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
