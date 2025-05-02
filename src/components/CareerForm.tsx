'use client'; // Next.js directive for client-side component

import React, { useState } from 'react';

/**
 * CareerForm Component
 * 
 * A complete career planning form that:
 * 1. Collects user skills, interests, and goals
 * 2. Submits data to an API endpoint
 * 3. Displays generated career plan
 * 
 * Features:
 * - Loading state management
 * - Result display area
 * - Responsive design
 */
export default function CareerForm() {
  // State for form inputs
  const [skills, setSkills] = useState(''); // Stores user's skills
  const [interests, setInterests] = useState(''); // Stores user's interests
  const [goals, setGoals] = useState(''); // Stores user's career goals

  // State for UI control
  const [loading, setLoading] = useState(false); // Tracks API request status
  const [result, setResult] = useState(''); // Stores API response

  /**
   * Handles form submission
   * @param e - React form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form behavior
    
    // Reset and prepare UI
    setLoading(true); // Show loading state
    setResult(''); // Clear previous results

    try {
      // Send data to API endpoint
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' // Specify JSON content
        },
        body: JSON.stringify({ 
          skills, 
          interests, 
          goals 
        }), // Convert data to JSON string
      });

      // Parse API response
      const data = await response.json();
      
      // Update UI with results
      setResult(data.result); // Display the generated plan
    } catch (error) {
      console.error('Submission failed:', error);
      setResult('Failed to generate career plan. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <main className="max-w-2xl mx-auto mt-10 p-4">
      {/* Career Planning Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Skills Input */}
        <div>
          <label className="block text-sm font-medium">Skills</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g., Python, networking"
            required // Make field mandatory
          />
        </div>

        {/* Interests Input */}
        <div>
          <label className="block text-sm font-medium">Interests</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g., cybersecurity, finance"
            required
          />
        </div>

        {/* Goals Input */}
        <div>
          <label className="block text-sm font-medium">Career Goals</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="e.g., become a quant analyst"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          disabled={loading} // Disable during API call
        >
          {loading ? (
            <>
              <span className="animate-pulse">⚡</span> Generating...
            </>
          ) : (
            'Generate Career Plan'
          )}
        </button>
      </form>

      {/* Results Display */}
      {result && (
        <div className="mt-6 p-4 bg-white border rounded whitespace-pre-wrap">
          <h2 className="text-lg font-semibold mb-2">Your Career Plan</h2>
          <div className="prose max-w-none">
            {result}
          </div>
        </div>
      )}
    </main>
  );
}