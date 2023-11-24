import React from 'react';

const SVGAnimation = ({ style, onAnimationEnd, origin, destination, progress }) => {
  // Calculate the position based on the progress
  const left = `${origin.lng() + (destination.lng() - origin.lng()) * (progress / 100)}px`;
  const top = `${origin.lat() + (destination.lat() - origin.lat()) * (progress / 100)}px`;

  return (
    <div
      style={{
        ...style,
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: 'blue', // Set the color of the circle
        position: 'absolute',
       
      }}
      onAnimationEnd={onAnimationEnd}
    />
  );
};

export default SVGAnimation;


