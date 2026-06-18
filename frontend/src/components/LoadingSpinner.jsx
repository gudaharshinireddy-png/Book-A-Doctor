const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="loading-spinner">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading</span>
    </div>
    <p>{message}</p>
  </div>
);

export default LoadingSpinner;
