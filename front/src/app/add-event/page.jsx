'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const AddEvent = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Validation schema
  const EventSchema = Yup.object().shape({
    eventName: Yup.string().required('Event name is required'),
    eventDate: Yup.date().required('Event date is required'),
    eventTime: Yup.string().required('Event time is required'),
    eventLocation: Yup.string().required('Event location is required'),
    eventDescription: Yup.string().required('Event description is required'),
    eventImages: Yup.array().min(1, 'At least one event image is required'),
    panoramaImages: Yup.array().min(1, 'At least one panorama image is required')
  });

  const initialValues = {
    eventName: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventDescription: '',
    eventImages: [],
    panoramaImages: []
  };

  const handleRegularImageUpload = async (e, setFieldValue, values) => {
    setLoading(true);
    const files = Array.from(e.target.files);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'myuploadpreset'); // Replace with your Cloudinary upload preset
        formData.append('folder', 'event_images');

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/de4osq89e/image/upload', // Replace with your Cloudinary cloud name
          formData
        );

        uploadedUrls.push({
          url: response.data.secure_url,
          publicId: response.data.public_id
        });
      }

      setFieldValue('eventImages', [...values.eventImages, ...uploadedUrls]);
      setMessage({ text: 'Images uploaded successfully', type: 'success' });
    } catch (error) {
      console.error('Error uploading images:', error);
      setMessage({ text: 'Error uploading images. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePanoramaImageUpload = async (e, setFieldValue, values) => {
    setLoading(true);
    const files = Array.from(e.target.files);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'myuploadpreset'); // Replace with your Cloudinary upload preset
        formData.append('folder', 'panorama_images');

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/de4osq89e/image/upload', // Replace with your Cloudinary cloud name
          formData
        );

        uploadedUrls.push({
          url: response.data.secure_url,
          publicId: response.data.public_id
        });
      }

      setFieldValue('panoramaImages', [...values.panoramaImages, ...uploadedUrls]);
      setMessage({ text: 'Panorama images uploaded successfully', type: 'success' });
    } catch (error) {
      console.error('Error uploading panorama images:', error);
      setMessage({ text: 'Error uploading panorama images. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const removeRegularImage = (index, setFieldValue, values) => {
    const updatedImages = [...values.eventImages];
    updatedImages.splice(index, 1);
    setFieldValue('eventImages', updatedImages);
  };

  const removePanoramaImage = (index, setFieldValue, values) => {
    const updatedImages = [...values.panoramaImages];
    updatedImages.splice(index, 1);
    setFieldValue('panoramaImages', updatedImages);
  };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Format the data for the backend - extract just the URLs
      const formattedData = {
        ...values,
        eventImages: values.eventImages.map(img => img.url),
        panoramaImages: values.panoramaImages.map(img => img.url)
      };

      // Send to your backend
      const response = await axios.post('http://localhost:5000/event/add', formattedData);
      setMessage({ text: 'Event added successfully!', type: 'success' });
      
      // Reset form and state
      resetForm();
    } catch (error) {
      console.error('Error adding event:', error);
      setMessage({ text: 'Error adding event. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Add New Event</h1>
      
      {message.text && (
        <div className={`p-4 mb-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}
      
      <Formik
        initialValues={initialValues}
        validationSchema={EventSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventName">
                Event Name
              </label>
              <Field
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.eventName && touched.eventName ? 'border-red-500' : ''
                }`}
                id="eventName"
                type="text"
                name="eventName"
              />
              <ErrorMessage name="eventName" component="p" className="text-red-500 text-xs italic mt-1" />
            </div>
            
            <div className="mb-4 flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventDate">
                  Event Date
                </label>
                <Field
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.eventDate && touched.eventDate ? 'border-red-500' : ''
                  }`}
                  id="eventDate"
                  type="date"
                  name="eventDate"
                />
                <ErrorMessage name="eventDate" component="p" className="text-red-500 text-xs italic mt-1" />
              </div>
              
              <div className="w-full md:w-1/2 px-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventTime">
                  Event Time
                </label>
                <Field
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.eventTime && touched.eventTime ? 'border-red-500' : ''
                  }`}
                  id="eventTime"
                  type="time"
                  name="eventTime"
                />
                <ErrorMessage name="eventTime" component="p" className="text-red-500 text-xs italic mt-1" />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventLocation">
                Event Location
              </label>
              <Field
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.eventLocation && touched.eventLocation ? 'border-red-500' : ''
                }`}
                id="eventLocation"
                type="text"
                name="eventLocation"
              />
              <ErrorMessage name="eventLocation" component="p" className="text-red-500 text-xs italic mt-1" />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventDescription">
                Event Description
              </label>
              <Field
                as="textarea"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.eventDescription && touched.eventDescription ? 'border-red-500' : ''
                }`}
                id="eventDescription"
                name="eventDescription"
                rows="4"
              />
              <ErrorMessage name="eventDescription" component="p" className="text-red-500 text-xs italic mt-1" />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Event Images
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                  </div>
                  <input
                    id="eventImages"
                    type="file" 
                    className="hidden"
                    multiple
                    onChange={(e) => handleRegularImageUpload(e, setFieldValue, values)}
                    accept="image/*"
                  />
                </label>
              </div>
              {errors.eventImages && touched.eventImages && (
                <p className="text-red-500 text-xs italic mt-1">{errors.eventImages}</p>
              )}
              
              {/* Display uploaded regular images */}
              {values.eventImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-semibold mb-2">Uploaded Images:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {values.eventImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={image.url} 
                          alt={`Event ${index}`} 
                          className="w-full h-32 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeRegularImage(index, setFieldValue, values)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Panorama Images
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">Panorama Images (MAX. 10MB)</p>
                  </div>
                  <input
                    id="panoramaImages"
                    type="file" 
                    className="hidden"
                    multiple
                    onChange={(e) => handlePanoramaImageUpload(e, setFieldValue, values)}
                    accept="image/*"
                  />
                </label>
              </div>
              {errors.panoramaImages && touched.panoramaImages && (
                <p className="text-red-500 text-xs italic mt-1">{errors.panoramaImages}</p>
              )}
              
              {/* Display uploaded panorama images */}
              {values.panoramaImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-semibold mb-2">Uploaded Panorama Images:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {values.panoramaImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={image.url} 
                          alt={`Panorama ${index}`} 
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removePanoramaImage(index, setFieldValue, values)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Add Event'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddEvent;