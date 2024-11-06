"use client";

import { useState } from 'react';
import axios from 'axios';
import './styles.css'; // Importing the CSS file

export default function Home() {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [structuredResponse, setStructuredResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle file upload
  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) {
      setErrorMessage('Please upload an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    setIsLoading(true);
    setErrorMessage('');
    setExtractedText('');
    setStructuredResponse(null);

    try {
      const response = await axios.post('https://deepkk-9-dlocr-backend.onrender.com/process-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data.structuredResponse);

      setStructuredResponse(response.data.structuredResponse);

    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Driving License OCR Processor</h2>
      <p>Upload an image of a driving license to extract and analyze its details.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Upload and Process'}
        </button>
      </form>

      {errorMessage && (
        <div className="error-message">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      {structuredResponse && (
        <div className="structured-response">
          <h3>Important Information Extracted:</h3>
          <ul>
            {Object.entries(structuredResponse).map(([key, value]) => (
              <li key={key}>
                <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* {extractedText && !structuredResponse && (
        <div className="extracted-text">
          <h3>Extracted JSON Data:</h3>
          <pre>{extractedText}</pre>
        </div>
      )} */}
    </div>
  );
}
