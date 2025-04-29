import React from "react";

// Spinner component for loading states
const Spinner = () => {
  return (
    // Spinner container
    <div className="spinner">
        {/* Bootstrap spinner element */}
        <div className="spinner-border" role="status">
            {/* Visually hidden text for accessibility */}
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
  );
};

export default Spinner;