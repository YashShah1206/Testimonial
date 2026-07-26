import axios from 'axios';

// Get configurable API base URL from Vite environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create configured Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json'
  }
});

/**
 * Submit a customer testimonial to the backend API.
 * 
 * @param {FormData} formData - Multipart form data containing name, email, company, rating, testimonial, and optional photo file.
 * @returns {Promise<Object>} API response data
 */
export const submitTestimonial = async (formData) => {
  try {
    const response = await apiClient.post('/testimonials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    // Extract and rethrow structured error message from API response if available
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Network error: Unable to connect to server.'
    };
  }
};

export default apiClient;
