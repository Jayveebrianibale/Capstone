import React, { useCallback, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';

function DragDropUpload({ onFileUpload, accept = '.csv', title = 'Upload CSV', subtitle = 'Drag and drop your CSV file here' }) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full p-6 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer
        ${isDragActive 
          ? 'border-[#1F3463] bg-[#f0f4ff] dark:bg-[#1a2a4a] dark:border-[#5d7cbf]' 
          : 'border-gray-300 dark:border-gray-600 hover:border-[#1F3463] dark:hover:border-[#5d7cbf]'
        }`}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors
          ${isDragActive 
            ? 'bg-[#1F3463] text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}
        >
          <FiUpload className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {subtitle}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          or click to browse files
        </p>
      </div>
    </div>
  );
}

export default DragDropUpload; 