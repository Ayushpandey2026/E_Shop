import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";

const ReviewsSection = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await API.get(`/reviews?productId=${productId}`);
        setReviews(response.data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };
    fetchReviews();
  }, [productId]);

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  // Submit new review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please enter a comment.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await API.post("/reviews", {
        productId,
        rating,
        comment,
      });
      setReviews((prev) => [...prev, response.data]);
      setRating(0);
      setComment("");
    } catch (err) {
      setError("Failed to submit review.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reviews-section">
      <h2>Customer Reviews</h2>
      <div className="average-rating">
        <strong>Average Rating: </strong>
        {averageRating.toFixed(1)} / 5{" "}
        <span className="stars">
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < Math.round(averageRating) ? "#ffc107" : "#e4e5e9" }}>
              &#9733;
            </span>
          ))}
        </span>
        <span> ({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
      </div>

      <div className="reviews-list">
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((review) => (
          <div key={review._id || review.id} className="review">
            <div className="review-rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: i < review.rating ? "#ffc107" : "#e4e5e9" }}>
                  &#9733;
                </span>
              ))}
            </div>
            <p className="review-comment">{review.comment}</p>
            <p className="review-author">- {review.userName || "Anonymous"}</p>
          </div>
        ))}
      </div>

      {user ? (
        <form className="review-form" onSubmit={handleSubmit}>
          <h3>Leave a Review</h3>
          <label>
            Rating:
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              disabled={loading}
            >
              <option value={0}>Select rating</option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </label>
          <label>
            Comment:
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={loading}
              rows={4}
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <p>Please log in to leave a review.</p>
      )}
    </div>
  );
};

export default ReviewsSection;
