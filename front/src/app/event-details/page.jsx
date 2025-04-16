'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Updated import
import './style.css';

const EventDetails = () => {
  const router = useRouter(); // Use useRouter instead of useNavigate
  const { id } = router.query; // Access query parameters
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [viewMode, setViewMode] = useState('normal'); // normal or panorama

  useEffect(() => {
    if (!id) return; // Ensure id is available before fetching
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/event/getbyid/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        const data = await response.json();
        setEvent(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleBackClick = () => {
    router.push('/events'); // Replace navigate(-1) with router.push
  };

  const handleImageClick = (index) => {
    setActiveImage(index);
  };

  const handleViewModeToggle = () => {
    setViewMode(viewMode === 'normal' ? 'panorama' : 'normal');
  };

  if (loading) {
    return (
      <div className="event-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-details-error">
        <h2>Error Loading Event</h2>
        <p>{error || 'Event not found'}</p>
        <button onClick={handleBackClick}>Go Back</button>
      </div>
    );
  }

  const images = viewMode === 'normal' ? event.eventImages : event.panoramaImages;

  return (
    <div className="event-details-container">
      <button className="back-button" onClick={handleBackClick}>
        &larr; Back to Events
      </button>

      <div className="event-details-header">
        <h1>{event.eventName}</h1>
        <div className="event-details-meta">
          <div className="event-date-time-details">
            <i className="far fa-calendar"></i>
            <span>{formatDate(event.eventDate)}</span>
            <span className="event-time-details">{event.eventTime}</span>
          </div>
          <div className="event-location-details">
            <i className="fas fa-map-marker-alt"></i>
            <span>{event.eventLocation}</span>
          </div>
        </div>
      </div>

      <div className="event-media-section">
        <div className="view-mode-toggle">
          <button 
            className={viewMode === 'normal' ? 'active' : ''} 
            onClick={() => setViewMode('normal')}
          >
            Standard Images
          </button>
          <button 
            className={viewMode === 'panorama' ? 'active' : ''} 
            onClick={() => setViewMode('panorama')}
            disabled={!event.panoramaImages || event.panoramaImages.length === 0}
          >
            Panorama View
          </button>
        </div>

        <div className={`event-main-image ${viewMode === 'panorama' ? 'panorama-container' : ''}`}>
          {images && images.length > 0 ? (
            <img 
              src={images[activeImage]} 
              alt={`${event.eventName} - Image ${activeImage + 1}`} 
              className={viewMode === 'panorama' ? 'panorama-image' : ''}
            />
          ) : (
            <div className="no-image-large">No Images Available</div>
          )}
        </div>

        {images && images.length > 1 && (
          <div className="event-thumbnails">
            {images.map((image, index) => (
              <div 
                key={index}
                className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                onClick={() => handleImageClick(index)}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="event-description-section">
        <h2>About This Event</h2>
        <p>{event.eventDescription}</p>
      </div>
    </div>
  );
};

export default EventDetails;