import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';
import { rateOutfit } from '../services/api';
import { submitToArena } from '../services/api';

const OCCASIONS = [
  'Job Interview',
  'Casual Outing',
  'Formal Event',
  'Date Night',
  'Business Meeting',
  'Wedding',
  'Beach Trip',
  'Gym/Sports',
  'Party/Club',
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'SGD'];

const OutfitRater = () => {
  const [image, setImage] = useState(null);
  const [occasion, setOccasion] = useState('');
  const [customOccasion, setCustomOccasion] = useState('');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showArenaModal, setShowArenaModal] = useState(false);
  const [arenaTitle, setArenaTitle] = useState('');
  const [arenaDescription, setArenaDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!image) {
      setError('Please upload an outfit image');
      return;
    }

    const selectedOccasion = occasion === 'custom' ? customOccasion : occasion;
    if (!selectedOccasion) {
      setError('Please select or enter an occasion');
      return;
    }

    setLoading(true);

    try {
      const budgetString = budget ? `${currency} ${budget}` : null;
      const response = await rateOutfit(image, selectedOccasion, budgetString);

      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error || 'Failed to rate outfit');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setOccasion('');
    setCustomOccasion('');
    setBudget('');
    setResult(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitToArena = async () => {
    if (!arenaTitle.trim()) {
      alert('Please enter a title for your submission');
      return;
    }

    try {
      const selectedOccasion = occasion === 'custom' ? customOccasion : occasion;
      await submitToArena({
        photo: image,
        title: arenaTitle,
        description: arenaDescription,
        occasion: selectedOccasion,
        source_mode: 'rater',
      });

      alert('Successfully submitted to Fashion Arena!');
      setShowArenaModal(false);
      setArenaTitle('');
      setArenaDescription('');
    } catch (err) {
      alert('Failed to submit to arena. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner
        message="Analyzing your outfit..."
        subMessage="This will take about 10-15 seconds"
      />
    );
  }

  if (result) {
    return (
      <div className="results-container">
        <h2 className="results-title">Your Outfit Rating</h2>

        <div className="ratings-grid">
          <div className="rating-card">
            <h3>Wow Factor</h3>
            <div className="rating-score">{result.wow_factor}/10</div>
            <p className="rating-explanation">{result.wow_factor_explanation}</p>
          </div>

          <div className="rating-card">
            <h3>Occasion Fitness</h3>
            <div className="rating-score">{result.occasion_fitness}/10</div>
            <p className="rating-explanation">{result.occasion_fitness_explanation}</p>
          </div>

          <div className="rating-card">
            <h3>Overall Rating</h3>
            <div className="rating-score">{result.overall_rating}/10</div>
            <p className="rating-explanation">{result.overall_explanation}</p>
          </div>
        </div>

        <div className="feedback-section">
          <div className="feedback-card">
            <h3>✨ Strengths</h3>
            <ul>
              {result.strengths?.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>

          <div className="feedback-card">
            <h3>💡 Areas for Improvement</h3>
            <ul>
              {result.improvements?.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          </div>

          <div className="feedback-card">
            <h3>👔 Styling Suggestions</h3>
            <ul>
              {result.suggestions?.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>

        {result.shopping_recommendations && result.shopping_recommendations.length > 0 && (
          <div className="shopping-section">
            <h3>🛍️ Shopping Recommendations</h3>
            <div className="products-grid">
              {result.shopping_recommendations.map((product, index) => (
                <div key={index} className="product-card">
                  <h4>{product.item}</h4>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">{product.price}</p>
                  <p className="product-reason">{product.reason}</p>
                  <button className="shop-btn">Shop Now</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="actions-row">
          <button className="btn-primary" onClick={handleReset}>
            Rate Another Outfit
          </button>
          <button className="btn-secondary" onClick={() => setShowArenaModal(true)}>
            Submit to Arena
          </button>
        </div>

        <Modal
          isOpen={showArenaModal}
          onClose={() => setShowArenaModal(false)}
          title="Submit to Fashion Arena"
        >
          <div className="arena-form">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={arenaTitle}
                onChange={(e) => setArenaTitle(e.target.value)}
                placeholder="Give your outfit a catchy title"
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>Description (optional)</label>
              <textarea
                value={arenaDescription}
                onChange={(e) => setArenaDescription(e.target.value)}
                placeholder="Tell us about your outfit..."
                rows={4}
                maxLength={500}
              />
            </div>

            <button className="btn-primary" onClick={handleSubmitToArena}>
              Submit
            </button>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="mode-container">
      <div className="mode-header">
        <h2>⭐ Outfit Rater</h2>
        <p>Upload your outfit photo and get AI-powered feedback</p>
      </div>

      <form onSubmit={handleSubmit} className="outfit-form">
        <ImageUpload onImageSelect={setImage} label="Upload Outfit Photo" />

        <div className="form-group">
          <label>Occasion *</label>
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            required
          >
            <option value="">Select an occasion</option>
            {OCCASIONS.map((occ) => (
              <option key={occ} value={occ}>
                {occ}
              </option>
            ))}
            <option value="custom">Custom...</option>
          </select>
        </div>

        {occasion === 'custom' && (
          <div className="form-group">
            <label>Custom Occasion</label>
            <input
              type="text"
              value={customOccasion}
              onChange={(e) => setCustomOccasion(e.target.value)}
              placeholder="Enter your occasion"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>
            Budget <span className="optional-tag">(Optional)</span>
          </label>
          <div className="budget-input">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="currency-select"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter amount"
              min="0"
            />
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn-primary" disabled={!image || !occasion}>
          Rate My Outfit
        </button>
      </form>
    </div>
  );
};

export default OutfitRater;
