'use client';
import { useState } from 'react';

/**
 * CareerForm Component
 * 
 * An AI-powered career mentor form that provides personalized career guidance based on user inputs.
 * Features:
 * - Multiple roadmap types (career, resume, study plan, interview prep)
 * - Chat-like interaction history
 * - Responsive design with error handling
 * - Copy-to-clipboard functionality for results
 */
export default function CareerForm() {
  // State management for form inputs and application state
  const [skills, setSkills] = useState(''); // User's skills input
  const [interests, setInterests] = useState(''); // User's interests input
  const [goals, setGoals] = useState(''); // User's career goals input
  const [result, setResult] = useState(''); // Generated roadmap/advice result
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(''); // Error message state
  const [mode, setMode] = useState('career'); // Selected guidance mode (career/resume/study/interview)

  // Type definition and state for message history
  type Message = { role: 'user' | 'assistant'; content: string };
  const [messages, setMessages] = useState<Message[]>([]); // Conversation history

  /**
   * Handles form submission to generate career guidance
   * @param e - React form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    // Create context message based on selected mode
    let contextMessage = '';
    switch (mode) {
      case 'resume':
        contextMessage = 'You want tips to boost your resume with your current skills and goals.';
        break;
      case 'study':
        contextMessage = 'You want a 6-month personalized study plan to reach your goal.';
        break;
      case 'interview':
        contextMessage = 'You want interview preparation tailored to your field.';
        break;
      default:
        contextMessage = 'You want a full career roadmap to reach your long-term goal.';
    }

    // Create user message with context and inputs
    const userMessage: Message = {
      role: 'user',
      content: `${contextMessage}\n\nSkills: ${skills}\nInterests: ${interests}\nGoals: ${goals}`
    };
  
    const newMessages = [...messages, userMessage];
  
    try {
      // API call to generate response
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, mode }),
      });
  
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      // Process successful response
      const data = await response.json();
      const aiMessage: Message = { role: 'assistant', content: data.result };
  
      // Update state with new messages and result
      setMessages([...newMessages, aiMessage]);
      setResult(data.result);
      setSkills('');
      setInterests('');
      setGoals('');
    } catch (err) {
      // Handle errors
      console.error('Generation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate response');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">AI Career Mentor Agent</h1>
      
      {/* Main form for user input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Skills input */}
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Your Skills 
          </label>
          <input
            type="text"
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Example: Python, JavaScript, Data Analysis"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Interests input */}
        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
            Your Interests 
          </label>
          <input
            type="text"
            id="interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Example: Web Development, AI, Cybersecurity"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Goals input */}
        <div>
          <label htmlFor="goals" className="block text-sm font-medium text-gray-700">
            Your Career Goals 
          </label>
          <textarea
            id="goals"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="Example: Become a Full-stack Developer in 2 years"
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Roadmap type selector */}
        <div>
          <label htmlFor="mode" className="block text-sm font-medium text-gray-700">
            Roadmap Type
          </label>
          <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="career">Full Career Roadmap</option>
            <option value="resume">Resume Skill Boost</option>
            <option value="study">Study Plan (6 months)</option>
            <option value="interview">Interview Prep Guidance</option>
          </select>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Generating...' : 'Generate User Selection'}
        </button>
      </form>

      {/* Error display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Results display */}
      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Your Career Roadmap:</h2>
          <button
            className="mb-3 text-sm text-blue-600 underline hover:text-blue-800"
            onClick={() => navigator.clipboard.writeText(result)}
          >
            📋 Copy to Clipboard
          </button>
          <div 
            className="prose max-w-none" 
            dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br />') }}
          />
        </div>
      )}

      {/* Conversation history */}
      {messages.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold">Chat History:</h2>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-md ${
                msg.role === 'user'
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : 'bg-gray-100 border border-gray-300 text-gray-800'
              }`}
            >
              <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
              <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />') }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}