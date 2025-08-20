import React from 'react';

const ResultDisplay = ({ 
  maskedImageUrl, 
  detectedPII, 
  maskingStyle = 'blackbar',
  onDownload, 
  onReset, 
  onStyleChange 
}) => {
  if (!maskedImageUrl) {
    return null;
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = maskedImageUrl;
    link.download = `masked-image-${maskingStyle}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (onDownload) {
      onDownload();
    }
  };

  const getMaskingStyleLabel = (style) => {
    switch (style) {
      case 'blur': return 'Blur';
      case 'pixelate': return 'Pixelate';
      case 'blackbar': return 'Black Bar';
      default: return 'Black Bar';
    }
  };

  const getTotalMaskedItems = () => {
    if (!detectedPII) return 0;
    return detectedPII.faces + detectedPII.textRegions + detectedPII.idNumbers + detectedPII.addresses;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <h3 className="text-xl font-semibold text-green-900 flex items-center">
            <svg
              className="w-6 h-6 mr-3 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Processing Complete
          </h3>
          <div className="flex space-x-3">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center shadow-sm"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download
            </button>
            {onReset && (
              <button
                onClick={onReset}
                className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                New Image
              </button>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {/* Masking Style Selector */}
          {onStyleChange && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Masking Style
              </label>
              <div className="flex space-x-3">
                {['blackbar', 'blur', 'pixelate'].map((style) => (
                  <button
                    key={style}
                    onClick={() => onStyleChange(style)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      maskingStyle === style
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getMaskingStyleLabel(style)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Display */}
          <div className="relative mb-6">
            <img
              src={maskedImageUrl}
              alt="Masked result"
              className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-200 shadow-sm"
            />
            <div className="absolute top-3 left-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
              {getMaskingStyleLabel(maskingStyle)} Applied
            </div>
          </div>
          
          {/* PII Detection Details */}
          {detectedPII && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Detection Summary
                </h4>
                <p className="text-sm text-green-800 mb-3">
                  <span className="font-medium">{getTotalMaskedItems()} PII elements</span> successfully masked
                </p>
                <div className="space-y-2 text-sm">
                  {detectedPII.faces > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">👤 Faces:</span>
                      <span className="font-medium text-green-800">{detectedPII.faces}</span>
                    </div>
                  )}
                  {detectedPII.textRegions > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">📝 Text Regions:</span>
                      <span className="font-medium text-green-800">{detectedPII.textRegions}</span>
                    </div>
                  )}
                  {detectedPII.idNumbers > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">🆔 ID Numbers:</span>
                      <span className="font-medium text-green-800">{detectedPII.idNumbers}</span>
                    </div>
                  )}
                  {detectedPII.addresses > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">📍 Addresses:</span>
                      <span className="font-medium text-green-800">{detectedPII.addresses}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Privacy Protection
                </h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All sensitive information masked</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Original image not stored</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Safe for sharing and distribution</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
