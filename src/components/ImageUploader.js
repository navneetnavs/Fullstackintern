import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUploader = ({ onImageUpload, disabled }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageUpload(imageFile);
    }
  }, [onImageUpload, disabled]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          gradient-bg card-shadow
          ${isDragOver 
            ? 'drag-glow border-blue-500' 
            : isHovered 
              ? 'border-glow border-blue-300' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-700'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => !disabled && document.getElementById('file-input').click()}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        animate={isDragOver ? { scale: 1.05 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center space-y-6">
          <motion.div
            animate={isDragOver ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`p-4 rounded-full ${
              isDragOver 
                ? 'bg-blue-100 dark:bg-blue-900/30' 
                : 'bg-gray-100 dark:bg-gray-800'
            }`}
          >
            <svg
              className={`w-12 h-12 transition-colors duration-300 ${
                isDragOver 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </motion.div>
          
          <div>
            <motion.p
              className={`text-xl font-semibold transition-colors duration-300 ${
                isDragOver 
                  ? 'text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-200'
              }`}
              animate={isDragOver ? { scale: 1.05 } : { scale: 1 }}
            >
              {isDragOver ? '✨ Drop your image here' : '📸 Upload an image'}
            </motion.p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Drag and drop or click to select an image file
            </p>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2 text-xs text-gray-400 dark:text-gray-500">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">JPG</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">PNG</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">GIF</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">WebP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Animated border effect */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl border-2 border-blue-400 animate-pulse"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ImageUploader;
