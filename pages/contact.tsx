import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import PageHeader from '../components/layout/PageHeader';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: '',
    website: '', // Honeypot field
    notes: ''    // Another honeypot field
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [businessHours, setBusinessHours] = useState<any[]>([]);
  const formLoadTime = useRef(Date.now());
  const [formToken, setFormToken] = useState('');
  const [mathAnswer, setMathAnswer] = useState<number | null>(null);
  
  // Fetch business hours from the API and generate form token
  useEffect(() => {
    const fetchBusinessHours = async () => {
      try {
        const res = await fetch('/api/business-hours');
        const data = await res.json();
        setBusinessHours(data);
      } catch (error) {
        console.error('Error fetching business hours:', error);
      }
    };
    
    fetchBusinessHours();
    
    // Generate a random token for this form session
    const randomToken = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15);
    setFormToken(randomToken);
    
    // Add some randomization to field names to confuse bots
    setTimeout(() => {
      console.log('Randomizing field names for anti-bot protection');
      const formFields = document.querySelectorAll('form input, form textarea, form select');
      formFields.forEach(field => {
        const originalName = field.getAttribute('name');
        const fieldId = field.getAttribute('id');
        console.log(`Processing field: ${fieldId}, original name: ${originalName}`);
        
        if (originalName && !originalName.includes('honeypot')) {
          field.setAttribute('data-real-name', originalName);
          const randomAttr = 'field_' + Math.random().toString(36).substring(2, 8);
          field.setAttribute('name', randomAttr);
          console.log(`Field ${fieldId}: Set data-real-name=${originalName}, randomized name=${randomAttr}`);
        }
      });
    }, 500); // Small delay to ensure the form is fully rendered
    
    // Generate a simple math challenge
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setMathAnswer(num1 + num2);
    
    // Add the math challenge to a hidden field in the DOM
    // This will be checked server-side
    const mathChallengeElement = document.createElement('div');
    mathChallengeElement.style.display = 'none';
    mathChallengeElement.setAttribute('id', 'math-challenge');
    mathChallengeElement.setAttribute('data-question', `${num1}+${num2}`);
    mathChallengeElement.setAttribute('data-answer', `${num1 + num2}`);
    document.body.appendChild(mathChallengeElement);
  }, []);
  
  // Format business hours for display
  const formatBusinessHours = () => {
    if (!businessHours || businessHours.length === 0) {
      return (
        <>
          <p className="mb-1">Monday - Friday: 9am - 9pm</p>
          <p className="mb-1">Saturday: 10am - 6pm</p>
          <p>Sunday: 10am - 4pm</p>
        </>
      );
    }
    
    // Sort by day of week, but put Sunday at the end
    const sortedHours = [...businessHours].sort((a, b) => {
      // Convert 0 (Sunday) to 7 for sorting purposes
      const dayA = a.day_of_week === 0 ? 7 : a.day_of_week;
      const dayB = b.day_of_week === 0 ? 7 : b.day_of_week;
      return dayA - dayB;
    });
    
    // Group consecutive days with the same hours
    const groupedHours: any[] = [];
    let currentGroup: any = null;
    
    sortedHours.forEach((day) => {
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day.day_of_week];
      
      if (day.is_closed) {
        groupedHours.push({ days: [dayName], hours: 'Closed' });
        currentGroup = null;
        return;
      }
      
      const formattedHours = `${day.open_hour}:00 - ${day.close_hour}:00`;
      
      if (!currentGroup || currentGroup.hours !== formattedHours) {
        currentGroup = { days: [dayName], hours: formattedHours };
        groupedHours.push(currentGroup);
      } else {
        currentGroup.days.push(dayName);
      }
    });
    
    // Format the display
    return groupedHours.map((group, index) => {
      const isLast = index === groupedHours.length - 1;
      let daysText = '';
      
      if (group.days.length === 1) {
        daysText = group.days[0];
      } else if (group.days.length === 2) {
        daysText = `${group.days[0]} and ${group.days[1]}`;
      } else {
        const firstDay = group.days[0];
        const lastDay = group.days[group.days.length - 1];
        daysText = `${firstDay} - ${lastDay}`;
      }
      
      return (
        <p key={index} className={isLast ? '' : 'mb-1'}>
          {daysText}: {group.hours}
        </p>
      );
    });
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { value } = e.target;
    // Use data-real-name if available (for randomized fields), otherwise use name
    const realName = e.target.getAttribute('data-real-name') || e.target.name;
    
    console.log('Field changed:', {
      element: e.target.id,
      realName,
      value
    });
    
    // Ensure we're updating the correct field in the form data
    if (realName) {
      setFormData(prev => ({
        ...prev,
        [realName]: value
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // Anti-bot checks
    const submissionTime = Date.now();
    const timeElapsed = submissionTime - formLoadTime.current;
    
    // Check if honeypot fields are filled (bots often fill all fields)
    if (formData.website !== '' || formData.notes !== '') {
      console.log('Honeypot triggered - likely bot submission');
      // Pretend the submission was successful to not alert the bot
      setSubmitSuccess(true);
      setIsSubmitting(false);
      return;
    }
    
    // Check if the form was submitted too quickly (less than 3 seconds)
    if (timeElapsed < 3000) {
      console.log('Form submitted too quickly - likely bot submission');
      // Pretend the submission was successful to not alert the bot
      setSubmitSuccess(true);
      setIsSubmitting(false);
      return;
    }
    
    // Reconstruct the actual form data from data attributes
    const form = e.target as HTMLFormElement;
    const actualFormData: any = {};
    
    Array.from(form.elements).forEach((element: any) => {
      if (element.dataset && element.dataset.realName) {
        actualFormData[element.dataset.realName] = element.value;
      }
    });
    
    // Add the form token and math answer for server-side validation
    actualFormData.formToken = formToken;
    actualFormData.mathAnswer = mathAnswer;
    
    try {
      // Send form data to the API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(actualFormData),
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
        subject: '',
        website: '',
        notes: ''
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
      <PageHeader 
        title="Contact us"
        subtitle="Have questions or want to learn more? Get in touch with our team."
        useCarbonBg={false}
      />

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
                    <h3 className="text-lg font-semibold mb-2 text-black flex items-center">
                      <svg className="w-5 h-5 mr-2 text-simstudio-yellow" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                      </svg>
                      Location
                    </h3>
                    <p className="mb-1">83 Gladstone Street, South Melbourne, VIC</p>
                    <p className="mb-3">Victoria, Australia</p>
                    <a 
                      href="https://www.google.com/maps/dir/?api=1&destination=83+Gladstone+Street+South+Melbourne+VIC+Australia" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center"
                    >
                      <svg className="w-5 h-5 mr-1 text-simstudio-yellow" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-black hover:text-gray-700 transition-colors">Get Directions</span>
                    </a>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-black flex items-center">
                      <svg className="w-5 h-5 mr-2 text-simstudio-yellow" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                      </svg>
                      Opening Hours
                    </h3>
                    <p className="mb-3 text-sm italic text-gray-600">
                      By appointment only. Please book online to reserve your simulator session.
                    </p>
                    {formatBusinessHours()}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-black flex items-center">
                      <svg className="w-5 h-5 mr-2 text-simstudio-yellow" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                      </svg>
                      Follow Us
                    </h3>
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
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="What is your message about?"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-simstudio-yellow focus:border-simstudio-yellow"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block mb-2 font-medium">Message*</label>
                        <textarea
                          id="message"
                          name="message"
                          data-real-name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-simstudio-yellow focus:border-simstudio-yellow"
                        ></textarea>
                      </div>
                      
                      {/* Hidden trap fields - invisible to humans */}
                      <div style={{ opacity: 0, position: 'absolute', top: '-9999px', left: '-9999px' }}>
                        <label htmlFor="company_url">Company Website</label>
                        <input
                          type="text"
                          id="company_url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>
                      
                      <div style={{ display: 'none' }}>
                        <label htmlFor="additional_info">Additional Information</label>
                        <textarea
                          id="additional_info"
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          tabIndex={-1}
                          autoComplete="off"
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
