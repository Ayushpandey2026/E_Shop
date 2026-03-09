import '../style/SkeletonLoader.css';

export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  if (type === 'card') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-text skeleton-title"></div>
              <div className="skeleton-text skeleton-subtitle"></div>
              <div className="skeleton-text skeleton-description"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'image') {
    return <div className="skeleton-image"></div>;
  }

  if (type === 'text') {
    return <div className="skeleton-text"></div>;
  }

  if (type === 'fullpage') {
    return (
      <div className="skeleton-fullpage">
        <div className="skeleton-header"></div>
        <div className="skeleton-content">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-item"></div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
