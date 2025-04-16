'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import '../event-listing/style.css';

const EventListing = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/event/getall');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (eventId) => {
    router.push(`/event/${eventId}`); // Use router.push for navigation
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="events-loading">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-error">
        <h2>Error Loading Events</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="events-container">
      <header className="events-header">
        <h1>Upcoming Events</h1>
        <p>Discover amazing events happening near you</p>
      </header>

      {events.length === 0 ? (
        <div className="no-events">
          <h2>No events found</h2>
          <p>Check back later for upcoming events!</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div 
              key={event._id} 
              className="event-card"
              onClick={() => handleEventClick(event._id)}
            >
              <div className="event-thumbnail">
                {event.eventImages && event.eventImages.length > 0 ? (
                  <img 
                    src={event.eventImages[0]} 
                    alt={event.eventName} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-event.jpg';
                    }}
                  />
                ) : (
                  <div className="no-image">No Image Available</div>
                )}
              </div>
              <div className="event-info">
                <h3>{event.eventName}</h3>
                <div className="event-details">
                  <div className="event-date-time">
                    <i className="far fa-calendar"></i>
                    <span>{formatDate(event.eventDate)}</span>
                    <span className="event-time">{event.eventTime}</span>
                  </div>
                  <div className="event-location">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{event.eventLocation}</span>
                  </div>
                </div>
                <p className="event-description">
                  {event.eventDescription.length > 100
                    ? `${event.eventDescription.substring(0, 100)}...`
                    : event.eventDescription}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventListing;