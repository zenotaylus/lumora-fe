/**
 * Validate budget input
 * @param {string} budget - Budget string (e.g., "USD 500")
 * @returns {boolean} - Is valid
 */
export const validateBudget = (budget) => {
  if (!budget || budget.trim() === '') {
    return false;
  }
  return true;
};

/**
 * Validate occasion input
 * @param {string} occasion - Occasion string
 * @returns {boolean} - Is valid
 */
export const validateOccasion = (occasion) => {
  if (!occasion || occasion.trim() === '') {
    return false;
  }
  return true;
};

/**
 * Validate wow factor
 * @param {number} wowFactor - Wow factor value
 * @returns {boolean} - Is valid
 */
export const validateWowFactor = (wowFactor) => {
  const num = parseInt(wowFactor);
  return !isNaN(num) && num >= 1 && num <= 10;
};

/**
 * Get wow factor label
 * @param {number} wowFactor - Wow factor value
 * @returns {string} - Label
 */
export const getWowFactorLabel = (wowFactor) => {
  const num = parseInt(wowFactor);
  if (num <= 3) return 'Classic & Safe';
  if (num <= 6) return 'Balanced & Stylish';
  return 'Bold & Creative';
};

/**
 * Validate brands list
 * @param {string} brands - Comma-separated brands
 * @returns {object} - { valid: boolean, error: string, brandsList: array }
 */
export const validateBrands = (brands) => {
  if (!brands || brands.trim() === '') {
    return { valid: true, error: null, brandsList: [] };
  }

  const brandsList = brands
    .split(',')
    .map((b) => b.trim())
    .filter((b) => b !== '');

  if (brandsList.length > 5) {
    return {
      valid: false,
      error: 'Maximum 5 brands allowed',
      brandsList: [],
    };
  }

  return { valid: true, error: null, brandsList };
};
