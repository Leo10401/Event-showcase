// components/PanoramaViewer.jsx
'use client';

import React, { useEffect, useRef } from 'react';

const PanoramaViewer = ({ imageUrl }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const loadMarzipano = async () => {
      const Marzipano = (await import('marzipano')).default;

      const viewer = new Marzipano.Viewer(containerRef.current);
      
      // Create an image source from the provided URL
      const source = Marzipano.ImageUrlSource.fromString(imageUrl);
      
      // Use EquirectGeometry for spherical projection instead of CubeGeometry
      const geometry = new Marzipano.EquirectGeometry([{ width: 30000, height: 15000 }]);
      
      // Set up view with maximum zoom-out limits
      const limiter = Marzipano.RectilinearView.limit.traditional(
        4096, // Increase max resolution for better zoom-out quality
        120 * Math.PI / 180 // Set max FOV to 180 degrees for maximum zoom-out
      );
      const view = new Marzipano.RectilinearView(
        { yaw: 0, pitch: 0, fov: 120 * Math.PI / 180 }, // Default to maximum zoom-out
        limiter
      );
      // Create the scene
      const scene = viewer.createScene({
        source,
        geometry,
        view
      });

      // Switch to this scene
      scene.switchTo();
    };

    loadMarzipano();
  }, [imageUrl]);

  return (
    <div
      ref={containerRef}
      className="w-[1244px] h-[700px]"
      style={{ position: 'relative' }}
    ></div>
  );
};

export default PanoramaViewer;