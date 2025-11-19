import axios from 'axios';

// Detect backend URL based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minutes for image generation
});

/**
 * Health check
 */
export const healthCheck = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

/**
 * Rate outfit
 * @param {string} imageData - Base64 encoded image
 * @param {string} occasion - Occasion for the outfit
 * @param {string} budget - Optional budget
 */
export const rateOutfit = async (imageData, occasion, budget = null) => {
  const response = await api.post('/api/rate-outfit', {
    image: imageData,
    occasion,
    budget,
  });
  return response.data;
};

/**
 * Generate outfit
 * @param {object} params - Generation parameters
 */
export const generateOutfit = async (params) => {
  const response = await api.post('/api/generate-outfit', {
    user_image: params.userImage || null,
    wow_factor: params.wowFactor,
    brands: params.brands || [],
    budget: params.budget,
    occasion: params.occasion,
    conditions: params.conditions || '',
  });
  return response.data;
};

/**
 * Regenerate outfit
 */
export const regenerateOutfit = async () => {
  const response = await api.post('/api/regenerate-outfit', {});
  return response.data;
};

/**
 * Submit to Fashion Arena
 * @param {object} submission - Submission data
 */
export const submitToArena = async (submission) => {
  const response = await api.post('/api/arena/submit', submission);
  return response.data;
};

/**
 * Get arena submissions
 * @param {string} sortBy - Sort option: recent, top_voted, top_rated
 */
export const getArenaSubmissions = async (sortBy = 'recent') => {
  const response = await api.get('/api/arena/submissions', {
    params: { sort_by: sortBy },
  });
  return response.data;
};

/**
 * Get leaderboard
 * @param {number} limit - Number of entries
 */
export const getLeaderboard = async (limit = 10) => {
  const response = await api.get('/api/arena/leaderboard', {
    params: { limit },
  });
  return response.data;
};

/**
 * Like submission
 * @param {string} submissionId - Submission ID
 */
export const likeSubmission = async (submissionId) => {
  const response = await api.post('/api/arena/like', {
    submission_id: submissionId,
    user_id: null,
  });
  return response.data;
};

/**
 * Get submission by ID
 * @param {string} submissionId - Submission ID
 */
export const getSubmissionById = async (submissionId) => {
  const response = await api.get(`/api/arena/submission/${submissionId}`);
  return response.data;
};

/**
 * Get arena statistics
 */
export const getArenaStats = async () => {
  const response = await api.get('/api/arena/stats');
  return response.data;
};

export default api;
