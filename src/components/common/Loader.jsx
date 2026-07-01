import React from 'react';
import Spinner from './Spinner';

const Loader = ({ size = 'lg', text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Spinner size={size} className="text-primary-600 mb-4" />
      <p className="text-neutral-600 text-sm">{text}</p>
    </div>
  );
};

export default Loader;
