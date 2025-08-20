import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import ImageUploader from './components/ImageUploader';
import ImagePreview from './components/ImagePreview';
import ResultDisplay from './components/ResultDisplay';
import ProgressBar from './components/ProgressBar';
import Toast from './components/Toast';
import DarkModeToggle from './components/DarkModeToggle';
import ConfirmationModal from './components/ConfirmationModal';
import { maskImage } from './services/apiService';

const AppContent = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [maskedImageUrl, setMaskedImageUrl] = useState(null);
  const [detectedPII, setDetectedPII] = useState(null);
  const [maskingStyle, setMaskingStyle] = useState('blackbar');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  const handleImageUpload = useCallback((file) => {
    setUploadedImage(file);
    setMaskedImageUrl(null);
    setDetectedPII(null);
    setError(null);
    setToast({ message: 'Image uploaded successfully!', type: 'success' });
  }, []);

  const handleRemoveImage = useCallback(() => {
    setUploadedImage(null);
    setMaskedImageUrl(null);
    setDetectedPII(null);
    setError(null);
    setToast(null);
  }, []);

  const handleProcessImage = useCallback(async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    setError(null);
    setToast(null);

    try {
      const result = await maskImage(uploadedImage, maskingStyle);
      
      if (result.success) {
        setMaskedImageUrl(result.maskedImageUrl);
        setDetectedPII(result.detectedPII);
        setShowConfirmation(true);
        setToast({ 
          message: 'Image processed successfully! PII data has been masked.', 
          type: 'success' 
        });
      } else {
        throw new Error(result.message || 'Processing failed');
      }
    } catch (err) {
      setError(err.message);
      setToast({ message: err.message, type: 'error' });
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  }, [uploadedImage, maskingStyle]);

  const handleReset = useCallback(() => {
    setUploadedImage(null);
    setMaskedImageUrl(null);
    setDetectedPII(null);
    setError(null);
    setIsProcessing(false);
    setProcessingStep('');
    setToast(null);
  }, []);

  const handleDownload = useCallback(() => {
    setToast({ message: 'Image downloaded successfully!', type: 'success' });
  }, []);

  const handleStyleChange = useCallback(async (newStyle) => {
    if (!uploadedImage || newStyle === maskingStyle) return;
    
    setMaskingStyle(newStyle);
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await maskImage(uploadedImage, newStyle);
      
      if (result.success) {
        setMaskedImageUrl(result.maskedImageUrl);
        setDetectedPII(result.detectedPII);
        setToast({ 
          message: `Masking style changed to ${newStyle}!`, 
          type: 'success' 
        });
      }
    } catch (err) {
      setError(err.message);
      setToast({ message: err.message, type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  }, [uploadedImage, maskingStyle]);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <div className="min-h-screen font-inter">
      {/* Sticky Header */}
      <motion.header 
        className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PII Shield
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI Privacy Protection</p>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div 
            key={uploadedImage ? 'has-image' : 'no-image'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Step 1: Image Upload */}
            {!uploadedImage && !isProcessing && !maskedImageUrl && (
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mb-12">
                  <motion.h2 
                    className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Protect Your Privacy
                  </motion.h2>
                  <motion.p 
                    className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Upload an image and our AI will automatically detect and mask faces, text, and other PII data
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <ImageUploader onImageUpload={handleImageUpload} disabled={isProcessing} />
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: Image Preview & Process */}
            {uploadedImage && !isProcessing && !maskedImageUrl && (
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center">
                  <motion.h2 
                    className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Review & Configure
                  </motion.h2>
                  <motion.p 
                    className="text-gray-600 dark:text-gray-300"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Review your image and choose a masking style
                  </motion.p>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ImagePreview 
                    imageFile={uploadedImage} 
                    onRemove={handleRemoveImage}
                    title="Original Image"
                  />
                </motion.div>
                
                {/* Masking Style Selection */}
                <motion.div 
                  className="max-w-4xl mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="gradient-bg card-shadow rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-center">
                      <svg className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                      Choose Masking Style
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {[
                        { id: 'blackbar', name: 'Black Bar', desc: 'Solid black rectangles with text', icon: '⬛' },
                        { id: 'blur', name: 'Blur', desc: 'Gaussian blur effect', icon: '🌫️' },
                        { id: 'pixelate', name: 'Pixelate', desc: 'Pixelated mosaic effect', icon: '🔲' }
                      ].map((style, index) => (
                        <motion.button
                          key={style.id}
                          onClick={() => setMaskingStyle(style.id)}
                          className={`p-6 rounded-xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
                            maskingStyle === style.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/25'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800/50'
                          }`}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          <div className="text-2xl mb-3">{style.icon}</div>
                          <div className="font-semibold text-gray-900 dark:text-white text-lg">{style.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">{style.desc}</div>
                          {maskingStyle === style.id && (
                            <motion.div
                              className="absolute top-2 right-2"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            >
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                    
                    <div className="text-center">
                      <motion.button
                        onClick={handleProcessImage}
                        className="px-12 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        🛡️ Protect with AI
                      </motion.button>
                      <motion.p 
                        className="text-sm text-gray-500 dark:text-gray-400 mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        AI will analyze your image and apply <span className="font-semibold text-blue-600 dark:text-blue-400">{maskingStyle}</span> masking
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Step 3: Processing */}
            {isProcessing && (
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-12">
                  <motion.h2 
                    className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    🤖 AI Processing
                  </motion.h2>
                  <motion.p 
                    className="text-lg text-gray-600 dark:text-gray-300"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Our advanced AI is analyzing your image and applying privacy protection
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ProgressBar 
                    duration={3000}
                    steps={[
                      "🔐 Uploading image securely...",
                      "👤 Detecting faces and identities...",
                      "📝 Analyzing text regions...",
                      "🛡️ Applying privacy masks...",
                      "✨ Finalizing protected image..."
                    ]}
                  />
                </motion.div>
              </motion.div>
            )}

            {/* Step 4: Results - 2 Column Layout */}
            {maskedImageUrl && !isProcessing && (
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center">
                  <motion.h2 
                    className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    🎉 Privacy Protection Complete
                  </motion.h2>
                  <motion.p 
                    className="text-lg text-gray-600 dark:text-gray-300"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Your image has been processed and PII data has been securely masked
                  </motion.p>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ResultDisplay 
                    maskedImageUrl={maskedImageUrl}
                    detectedPII={detectedPII}
                    maskingStyle={maskingStyle}
                    onDownload={handleDownload}
                    onReset={handleReset}
                    onStyleChange={handleStyleChange}
                  />
                </motion.div>
                
                {/* 2-Column Before/After Comparison */}
                {uploadedImage && (
                  <motion.div 
                    className="gradient-bg card-shadow rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.h3 
                      className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <svg className="w-7 h-7 mr-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Before & After Comparison
                    </motion.h3>
                    <div className="grid lg:grid-cols-2 gap-8">
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <ImagePreview 
                          imageFile={uploadedImage} 
                          title="🔓 Original Image"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <ImagePreview 
                          imageUrl={maskedImageUrl} 
                          title="🔒 Protected Image"
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern Footer */}
      <motion.footer 
        className="border-t border-gray-200/50 dark:border-gray-700/50 mt-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-8 mb-6">
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">100% Local</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Privacy First</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">AI Powered</span>
              </motion.div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              🔒 Your images are processed locally in your browser. No data leaves your device.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Built with React, Tailwind CSS, Framer Motion & Canvas API
            </p>
          </div>
        </div>
      </motion.footer>

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Privacy Protection Complete!"
        message="Your image has been successfully processed and all PII data has been securely masked."
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
