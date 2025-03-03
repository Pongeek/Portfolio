import { useState, useEffect } from 'react';

/**
 * A component that tries multiple image URLs until one loads successfully
 */
export default function FallbackImage({ 
  src, 
  fallbacks = [], 
  alt, 
  className, 
  width, 
  height, 
  ...rest 
}) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [error, setError] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [allUrlsFailed, setAllUrlsFailed] = useState(false);
  
  // Create a combined array of all sources to try
  const allSources = [src, ...fallbacks].filter(Boolean);
  
  useEffect(() => {
    // Reset state when the src prop changes
    setCurrentSrc(src);
    setError(false);
    setAttemptCount(0);
    setAllUrlsFailed(false);
  }, [src]);
  
  const handleError = () => {
    // Try the next URL in the list
    const nextAttempt = attemptCount + 1;
    setAttemptCount(nextAttempt);
    
    if (nextAttempt < allSources.length) {
      console.log(`Image failed to load: ${currentSrc}. Trying next source: ${allSources[nextAttempt]}`);
      setCurrentSrc(allSources[nextAttempt]);
      setError(false);
    } else {
      console.log('All image sources failed to load');
      setAllUrlsFailed(true);
    }
  };
  
  // If all URLs have failed, show a placeholder
  if (allUrlsFailed) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center text-gray-500 ${className}`}
        style={{ width: width || '100%', height: height || '200px' }}
        {...rest}
      >
        <span>Image not available</span>
      </div>
    );
  }
  
  return (
    <img
      src={currentSrc}
      alt={alt || 'Image'}
      className={className}
      width={width}
      height={height}
      onError={handleError}
      {...rest}
    />
  );
} 