import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';
import { generateOutfit, regenerateOutfit, submitToArena } from '../services/api';
import { getWowFactorLabel, validateBrands } from '../utils/validation';

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

const OutfitGenerator = () => {
  const [userImage, setUserImage] = useState(null);
  const [wowFactor, setWowFactor] = useState(5);
  const [brands, setBrands] = useState('');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [occasion, setOccasion] = useState('');
  const [customOccasion, setCustomOccasion] = useState('');
  const [conditions, setConditions] = useState('');
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

    const selectedOccasion = occasion === 'custom' ? customOccasion : occasion;
    if (!selectedOccasion) {
      setError('Please select or enter an occasion');
      return;
    }

    if (!budget) {
      setError('Please enter a budget');
      return;
    }

    // Validate brands
    const brandsValidation = validateBrands(brands);
    if (!brandsValidation.valid) {
      setError(brandsValidation.error);
      return;
    }

    setLoading(true);

    try {
      const budgetString = `${currency} ${budget}`;
      const response = await generateOutfit({
        userImage,
        wowFactor,
        brands: brandsValidation.brandsList,
        budget: budgetString,
        occasion: selectedOccasion,
        conditions,
      });

      if (response.success) {
        setResult(response);
      } else {
        setError(response.error || 'Failed to generate outfit');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await regenerateOutfit();

      if (response.success) {
        setResult(response);
      } else {
        setError(response.error || 'Failed to regenerate outfit');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUserImage(null);
    setWowFactor(5);
    setBrands('');
    setBudget('');
    setOccasion('');
    setCustomOccasion('');
    setConditions('');
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
        photo: result.outfit_image_url,
        title: arenaTitle,
        description: arenaDescription,
        occasion: selectedOccasion,
        source_mode: 'generator',
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
        message="Creating your perfect outfit..."
        subMessage="This may take 30-60 seconds for image generation"
      />
    );
  }

  if (result) {
    const desc = result.outfit_description;

    return (
      <div className="results-container">
        <h2 className="results-title">Your Generated Outfit</h2>

        {result.outfit_image_url && (
          <div className="outfit-image-container">
            <img
              src={result.outfit_image_url}
              alt="Generated outfit"
              className="generated-outfit-image"
            />
          </div>
        )}

        <div className="outfit-details">
          <h3>Outfit Concept</h3>
          <p className="outfit-concept">{desc.outfit_concept}</p>

          <h3>Items</h3>
          <div className="items-grid">
            {desc.items?.map((item, index) => (
              <div key={index} className="item-card">
                <h4>{item.type}</h4>
                <p><strong>Description:</strong> {item.description}</p>
                <p><strong>Color:</strong> {item.color}</p>
                <p><strong>Style Notes:</strong> {item.style_notes}</p>
              </div>
            ))}
          </div>

          <h3>Color Palette</h3>
          <p className="color-palette">{desc.color_palette}</p>

          <h3>Occasion Notes</h3>
          <p className="occasion-notes">{desc.occasion_notes}</p>
        </div>

        {desc.product_recommendations && desc.product_recommendations.length > 0 && (
          <div className="shopping-section">
            <h3>🛍️ Shopping Recommendations</h3>
            <div className="products-grid">
              {desc.product_recommendations.map((product, index) => (
                <div key={index} className="product-card">
                  <h4>{product.item}</h4>
                  <p className="product-type">{product.type}</p>
                  <p className="product-brand"><strong>Brand:</strong> {product.brand}</p>
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
            Create New Outfit
          </button>
          <button className="btn-secondary" onClick={handleRegenerate}>
            Generate Another
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
        <h2>🎨 Outfit Generator</h2>
        <p>Create personalized outfit recommendations with AI</p>
      </div>

      <form onSubmit={handleSubmit} className="outfit-form">
        <ImageUpload
          onImageSelect={setUserImage}
          label="Upload Your Photo"
          optional={true}
        />

        <div className="form-group">
          <label>
            Wow Factor: {wowFactor} - {getWowFactorLabel(wowFactor)}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={wowFactor}
            onChange={(e) => setWowFactor(parseInt(e.target.value))}
            className="slider"
          />
          <div className="slider-labels">
            <span>Classic & Safe</span>
            <span>Balanced & Stylish</span>
            <span>Bold & Creative</span>
          </div>
        </div>

        <div className="form-group">
          <label>
            Favorite Brands <span className="optional-tag">(Optional, max 5)</span>
          </label>
          <input
            type="text"
            value={brands}
            onChange={(e) => setBrands(e.target.value)}
            placeholder="e.g., Zara, H&M, Uniqlo"
          />
        </div>

        <div className="form-group">
          <label>Budget *</label>
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
              required
            />
          </div>
        </div>

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
            Special Conditions <span className="optional-tag">(Optional)</span>
          </label>
          <textarea
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            placeholder="e.g., must include red, no heels, formal but comfortable"
            rows={3}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn-primary" disabled={!occasion || !budget}>
          Generate Outfit
        </button>
      </form>
    </div>
  );
};

export default OutfitGenerator;
