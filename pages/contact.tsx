import React, { useState } from 'react';
import Head from 'next/head';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: 'General Inquiry'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Send form data to the API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      // Handle successful submission
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        subject: 'General Inquiry'
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'There was an error submitting your message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="carbon-bg text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 heading-font">CONTACT US</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Have questions or want to learn more? Get in touch with our team.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Contact Information */}
              <div className="md:w-2/5">
                <div className="bg-gray-50 p-6 rounded-lg shadow-md h-full">
                  <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-simstudio-yellow">Location</h3>
                    <p className="mb-1">South Melbourne</p>
                    <p>Victoria, Australia</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-simstudio-yellow">Email</h3>
                    <a href="mailto:hello@simstudio.com.au" className="text-gray-700 hover:text-simstudio-yellow transition-colors">
                      hello@simstudio.com.au
                    </a>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-simstudio-yellow">Opening Hours</h3>
                    <p className="mb-1">Monday - Friday: 9am - 9pm</p>
                    <p className="mb-1">Saturday: 10am - 6pm</p>
                    <p>Sunday: 10am - 4pm</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-simstudio-yellow">Follow Us</h3>
                    <div className="flex space-x-4">
                      <a href="https://facebook.com/@simstudio.au" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-simstudio-yellow">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                      <a href="https://instagram.com/simstudio.au" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-simstudio-yellow">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="md:w-3/5">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                  
                  {submitSuccess ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
                      <h3 className="font-bold text-lg mb-2">Message Sent!</h3>
                      <p>Thank you for contacting us. We'll get back to you as soon as possible.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {submitError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                          {submitError}
                        </div>
                      )}
                      
                      <div>
                        <label htmlFor="name" className="block mb-2 font-medium">Name*</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-simstudio-yellow focus:border-simstudio-yellow"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block mb-2 font-medium">Email*</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-simstudio-yellow focus:border-simstudio-yellow"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block mb-2 font-medium">Phone</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-simstudio-yellow focus:border-simstudio-yellow"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block mb-2 font-medium">Subject*</label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-simstudio-yellow focus:border-simstudio-yellow"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Booking Question">Booking Question</option>
                          <option value="Corporate Training">Corporate Training</option>
                          <option value="Feedback">Feedback</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block mb-2 font-medium">Message*</label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-simstudio-yellow focus:border-simstudio-yellow"
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-simstudio-yellow hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition duration-300 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
