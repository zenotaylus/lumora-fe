import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { getArenaSubmissions, getLeaderboard, likeSubmission } from '../services/api';

const FashionArena = () => {
  const [submissions, setSubmissions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likedSubmissions, setLikedSubmissions] = useState(new Set());

  useEffect(() => {
    loadData();
  }, [sortBy]);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [submissionsResponse, leaderboardResponse] = await Promise.all([
        getArenaSubmissions(sortBy),
        getLeaderboard(10),
      ]);

      if (submissionsResponse.success) {
        setSubmissions(submissionsResponse.submissions);
      }

      if (leaderboardResponse.success) {
        setLeaderboard(leaderboardResponse.leaderboard);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load Fashion Arena data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDoubleClick = async (submissionId) => {
    // Prevent multiple likes
    if (likedSubmissions.has(submissionId)) {
      return;
    }

    try {
      const response = await likeSubmission(submissionId);

      if (response.success) {
        // Update local state
        setLikedSubmissions(new Set([...likedSubmissions, submissionId]));

        // Update submission in list
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === submissionId ? { ...sub, likes: response.likes } : sub
          )
        );

        // Update leaderboard
        setLeaderboard((prev) =>
          prev.map((sub) =>
            sub.id === submissionId ? { ...sub, likes: response.likes } : sub
          )
        );

        // Show animation (you can add CSS animation here)
        const element = document.getElementById(`submission-${submissionId}`);
        if (element) {
          element.classList.add('liked-animation');
          setTimeout(() => {
            element.classList.remove('liked-animation');
          }, 1000);
        }
      }
    } catch (err) {
      console.error('Error liking submission:', err);
    }
  };

  const getMedalEmoji = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  };

  const getSourceBadge = (sourceMode) => {
    return sourceMode === 'rater' ? '⭐' : '🎨';
  };

  if (loading) {
    return <LoadingSpinner message="Loading Fashion Arena..." />;
  }

  return (
    <div className="fashion-arena-container">
      <div className="arena-header">
        <h2>🏆 Fashion Arena</h2>
        <p>Double-click/tap outfits to show your love!</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      {/* Leaderboard Section */}
      <div className="leaderboard-section">
        <h3>🏅 Top 10 Leaderboard</h3>
        <div className="leaderboard-list">
          {leaderboard.map((entry, index) => (
            <div key={entry.id} className="leaderboard-item">
              <div className="leaderboard-rank">
                <span className="rank-number">#{index + 1}</span>
                {index < 3 && <span className="medal">{getMedalEmoji(index + 1)}</span>}
              </div>
              <img
                src={entry.photo}
                alt={entry.title}
                className="leaderboard-thumbnail"
              />
              <div className="leaderboard-info">
                <h4>{entry.title}</h4>
                <p className="leaderboard-occasion">{entry.occasion}</p>
              </div>
              <div className="leaderboard-likes">
                ❤️ {entry.likes || 0}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="sort-controls">
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="recent">Recent</option>
          <option value="top_voted">Top Voted</option>
          <option value="top_rated">Top Rated</option>
        </select>
      </div>

      {/* Submissions Grid */}
      <div className="submissions-grid">
        {submissions.length === 0 ? (
          <div className="empty-state">
            <p>No submissions yet. Be the first to share your outfit!</p>
          </div>
        ) : (
          submissions.map((submission) => (
            <div
              key={submission.id}
              id={`submission-${submission.id}`}
              className="submission-card"
              onDoubleClick={() => handleDoubleClick(submission.id)}
            >
              <div className="submission-image-wrapper">
                <img
                  src={submission.photo}
                  alt={submission.title}
                  className="submission-image"
                />
                <div className="submission-overlay">
                  <div className="heart-icon">❤️</div>
                </div>
              </div>

              <div className="submission-details">
                <div className="submission-header">
                  <h3>{submission.title}</h3>
                  <span className="source-badge" title={submission.source_mode}>
                    {getSourceBadge(submission.source_mode)}
                  </span>
                </div>

                {submission.description && (
                  <p className="submission-description">{submission.description}</p>
                )}

                <div className="submission-meta">
                  <span className="occasion-tag">{submission.occasion}</span>
                  <span className="likes-count">
                    {submission.likes === 1 ? '1 like' : `${submission.likes || 0} likes`}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FashionArena;
