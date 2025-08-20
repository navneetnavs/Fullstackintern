# PII Image Masking Tool

A React.js frontend application for automatically detecting and masking personally identifiable information (PII) in images. Built with React, Tailwind CSS, and modern web technologies.

## Features

- **Drag & Drop Upload**: Intuitive image upload with drag-and-drop functionality
- **Image Preview**: Preview uploaded images before processing
- **PII Detection & Masking**: Mock API simulation for PII detection and masking
- **Loading States**: Beautiful loading animations during processing
- **Error Handling**: Comprehensive error handling for failed API calls
- **Download Results**: Download processed images with masked PII
- **Responsive Design**: Clean, minimal UI that works on all devices
- **Modular Components**: Well-structured, reusable React components

## Tech Stack

- **React 18** - Modern React with functional components and hooks
- **Tailwind CSS** - Utility-first CSS framework for styling
- **JavaScript ES6+** - Modern JavaScript features
- **Canvas API** - For image processing and masking simulation

## Project Structure

```
src/
├── components/
│   ├── ImageUploader.js    # Drag-and-drop image upload component
│   ├── ImagePreview.js     # Image preview and display component
│   ├── ResultDisplay.js    # Masked image results component
│   └── Loader.js          # Loading spinner component
├── services/
│   └── apiService.js      # Mocked API service for PII masking
├── App.js                 # Main application component
├── index.js              # React app entry point
└── index.css             # Global styles with Tailwind imports
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd Fullstackintern
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## How to Use

1. **Upload Image**: Drag and drop an image file or click to select from your computer
2. **Preview**: Review the uploaded image and click "Process Image for PII"
3. **Processing**: Wait while the app simulates PII detection and masking
4. **Results**: View the masked image and download if needed
5. **Reset**: Click "New Image" to start over with a different image

## API Simulation

The app includes a mocked API service (`/src/services/apiService.js`) that simulates:

- **Processing Delays**: 1.5-3.5 second realistic processing time
- **PII Detection**: Simulates detection of names, phone numbers, emails
- **Image Masking**: Creates black overlay rectangles with "MASKED" labels
- **Error Simulation**: 10% chance of API failure for testing error handling
- **Success Responses**: Returns processed image URLs and metadata

## Component Details

### ImageUploader
- Drag-and-drop functionality
- File type validation (images only)
- Visual feedback for drag states
- Disabled state during processing

### ImagePreview
- Displays uploaded or processed images
- Shows file metadata (name, size, type)
- Remove/reset functionality
- Responsive image sizing

### ResultDisplay
- Shows masked image results
- Download functionality
- Success indicators
- Reset option for new uploads

### Loader
- Animated spinner with multiple elements
- Dynamic status messages
- Progress indicators
- Smooth animations

## Styling

The app uses Tailwind CSS for styling with:
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, minimal interface
- **Smooth Animations**: Hover effects and transitions
- **Accessibility**: Proper contrast and focus states
- **Custom Animations**: Extended Tailwind config for spinners

## Error Handling

Comprehensive error handling includes:
- File type validation
- API failure simulation
- Network error handling
- User-friendly error messages
- Graceful degradation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Real backend API integration
- Multiple image upload support
- Advanced PII detection options
- Image format conversion
- Batch processing capabilities
- User authentication
- Processing history

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and demonstration purposes.