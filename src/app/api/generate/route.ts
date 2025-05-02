import { NextResponse } from 'next/server';

/**
 * POST API endpoint for generating career roadmaps using OpenAI
 * @param req - The incoming request containing skills, interests and goals
 * @returns JSON response with AI-generated career plan or error message
 */
export async function POST(req: Request) {
  // Step 1: Parse the JSON body from the incoming request
  const { skills, interests, goals } = await req.json();

  // Step 2: Construct the prompt for OpenAI
  const prompt = `
You are an AI Career Mentor.
Generate a personalized career roadmap based on:

Skills: ${skills}
Interests: ${interests}
Goals: ${goals}

Include these sections:
1. Recommended Job Roles
2. Skills to Develop
3. Learning Resources
4. Step-by-Step Timeline
5. Networking Opportunities

Use clear markdown formatting with headings and bullet points.
`;

  try {
    // Step 3: Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Using API key from environment variables
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4', // Using GPT-4 model
        messages: [
          // System message to set AI behavior
          { 
            role: 'system', 
            content: 'You are a knowledgeable career coach. Provide practical, actionable advice.' 
          },
          // User message with our constructed prompt
          { role: 'user', content: prompt },
        ],
        temperature: 0.7, // Controls randomness (0-1)
        max_tokens: 1000, // Limit response length
      }),
    });

    // Step 4: Handle the response
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the generated message content
    const message = data.choices?.[0]?.message?.content;

    // Step 5: Return the result to the client
    return NextResponse.json({ 
      success: true,
      result: message || "No response generated."
    });

  } catch (error) {
    // Error handling
    console.error('Career roadmap generation failed:', error);
    return NextResponse.json(
      { success: false, error: "Failed to generate career plan" },
      { status: 500 }
    );
  }
}