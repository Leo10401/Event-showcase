'use client';
// components/App.jsx
import React, { useState } from 'react';
import PanoramaViewer from './PanoramaViewer';
import EventListing from './event-listing/page';

const App = () => {
  return (
    <div className="f ">
      <EventListing/>
    </div>
  );
};

export default App;