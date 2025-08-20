// Mocked API service for PII image masking
const API_BASE_URL = '/api';

// Simulate different masking techniques
const applyMaskingStyle = (ctx, area, style, img) => {
  const { x, y, width, height } = area;
  
  switch (style) {
    case 'blur':
      // Create a blurred version of the area
      const imageData = ctx.getImageData(x, y, width, height);
      const blurredData = applyGaussianBlur(imageData, 15);
      ctx.putImageData(blurredData, x, y);
      break;
      
    case 'pixelate':
      // Pixelate the area
      const pixelSize = Math.max(8, Math.min(width, height) / 10);
      for (let px = x; px < x + width; px += pixelSize) {
        for (let py = y; py < y + height; py += pixelSize) {
          const sampleData = ctx.getImageData(px, py, 1, 1).data;
          ctx.fillStyle = `rgb(${sampleData[0]}, ${sampleData[1]}, ${sampleData[2]})`;
          ctx.fillRect(px, py, pixelSize, pixelSize);
        }
      }
      break;
      
    case 'blackbar':
    default:
      // Black bar with text
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = 'white';
      ctx.font = `${Math.max(12, height * 0.4)}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('MASKED', x + width / 2, y + height * 0.6);
      break;
  }
};

// Simple Gaussian blur implementation
const applyGaussianBlur = (imageData, radius) => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const output = new Uint8ClampedArray(data);
  
  const kernel = createGaussianKernel(radius);
  const kernelSize = kernel.length;
  const half = Math.floor(kernelSize / 2);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      
      for (let ky = 0; ky < kernelSize; ky++) {
        for (let kx = 0; kx < kernelSize; kx++) {
          const px = Math.min(width - 1, Math.max(0, x + kx - half));
          const py = Math.min(height - 1, Math.max(0, y + ky - half));
          const idx = (py * width + px) * 4;
          const weight = kernel[ky][kx];
          
          r += data[idx] * weight;
          g += data[idx + 1] * weight;
          b += data[idx + 2] * weight;
          a += data[idx + 3] * weight;
        }
      }
      
      const idx = (y * width + x) * 4;
      output[idx] = r;
      output[idx + 1] = g;
      output[idx + 2] = b;
      output[idx + 3] = a;
    }
  }
  
  return new ImageData(output, width, height);
};

const createGaussianKernel = (radius) => {
  const size = radius * 2 + 1;
  const kernel = [];
  const sigma = radius / 3;
  let sum = 0;
  
  for (let y = 0; y < size; y++) {
    kernel[y] = [];
    for (let x = 0; x < size; x++) {
      const distance = Math.sqrt((x - radius) ** 2 + (y - radius) ** 2);
      const value = Math.exp(-(distance ** 2) / (2 * sigma ** 2));
      kernel[y][x] = value;
      sum += value;
    }
  }
  
  // Normalize kernel
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      kernel[y][x] /= sum;
    }
  }
  
  return kernel;
};

// Generate realistic PII detection areas
const generatePIIAreas = (width, height) => {
  const areas = [];
  const detectedPII = {
    faces: 0,
    textRegions: 0,
    idNumbers: 0,
    addresses: 0
  };
  
  // Simulate face detection (1-3 faces)
  const faceCount = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < faceCount; i++) {
    areas.push({
      type: 'face',
      x: Math.random() * (width * 0.6),
      y: Math.random() * (height * 0.4),
      width: width * (0.15 + Math.random() * 0.1),
      height: height * (0.2 + Math.random() * 0.1)
    });
    detectedPII.faces++;
  }
  
  // Simulate text regions (0-4 text areas)
  const textCount = Math.floor(Math.random() * 5);
  for (let i = 0; i < textCount; i++) {
    areas.push({
      type: 'text',
      x: Math.random() * (width * 0.7),
      y: Math.random() * (height * 0.8),
      width: width * (0.2 + Math.random() * 0.3),
      height: height * (0.03 + Math.random() * 0.04)
    });
    
    // Categorize text types
    const textType = Math.random();
    if (textType < 0.4) detectedPII.textRegions++;
    else if (textType < 0.7) detectedPII.idNumbers++;
    else detectedPII.addresses++;
  }
  
  return { areas, detectedPII };
};

// Create masked image with specified style
const createMaskedImage = (originalImage, maskingStyle = 'blackbar') => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Generate PII areas
      const { areas, detectedPII } = generatePIIAreas(img.width, img.height);
      
      // Apply masking to each area
      areas.forEach(area => {
        applyMaskingStyle(ctx, area, maskingStyle, img);
      });
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        const maskedImageUrl = URL.createObjectURL(blob);
        resolve({ maskedImageUrl, detectedPII });
      }, 'image/png');
    };
    
    img.src = originalImage;
  });
};

export const maskImage = async (imageFile, maskingStyle = 'blackbar') => {
  // Simulate API delay
  const delay = Math.random() * 2000 + 1500; // 1.5-3.5 seconds
  
  return new Promise(async (resolve, reject) => {
    try {
      // Simulate potential API failures (10% chance)
      if (Math.random() < 0.1) {
        setTimeout(() => {
          reject(new Error('API service temporarily unavailable. Please try again.'));
        }, delay);
        return;
      }
      
      // Create object URL from the uploaded file
      const originalImageUrl = URL.createObjectURL(imageFile);
      
      setTimeout(async () => {
        try {
          const { maskedImageUrl, detectedPII } = await createMaskedImage(originalImageUrl, maskingStyle);
          
          // Clean up the original object URL
          URL.revokeObjectURL(originalImageUrl);
          
          resolve({
            success: true,
            maskedImageUrl,
            detectedPII,
            message: 'Image processed successfully',
            maskingStyle
          });
        } catch (error) {
          reject(new Error('Failed to process image. Please try again.'));
        }
      }, delay);
      
    } catch (error) {
      reject(new Error('Failed to upload image. Please check your file and try again.'));
    }
  });
};

export const checkApiHealth = async () => {
  // Mock health check
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'healthy',
        timestamp: new Date().toISOString()
      });
    }, 500);
  });
};
