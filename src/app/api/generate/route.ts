import { NextResponse } from 'next/server';

/**
 * API Route: /api/generate
 * 
 * This endpoint processes career guidance requests by:
 * 1. Validating input
 * 2. Generating mode-specific instructions
 * 3. Calling OpenAI's API
 * 4. Formatting and returning the response
 * 
 * Security: Requires valid OpenAI API key
 * Input: { messages: Message[], mode: string }
 * Output: { result: string } or error
 */
export async function POST(req: Request) {
  // Parse and validate request body
  const body = await req.json();
  const { messages, mode } = body;

  // Input validation
  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json(
      { error: 'Invalid message format' }, 
      { status: 400 }
    );
  }

  /**
   * Generate mode-specific task instructions
   * Each mode produces different guidance:
   * - resume: Focuses on skill presentation
   * - study: Creates learning milestones
   * - interview: Prepares for job interviews
   * - default: Comprehensive career planning
   */
  let taskInstruction = '';
  switch (mode) {
    case 'resume':
      taskInstruction =
        'Suggest resume enhancements: specific skills, certifications, and tools to add based on the user’s goals. Include quantifiable achievements where possible.';
      break;
    case 'study':
      taskInstruction =
        'Build a 6-month personalized study plan. Break it down into monthly milestones with specific topics, recommended resources (free and paid), and practice exercises.';
      break;
    case 'interview':
      taskInstruction =
        'Generate personalized interview prep guidance, including: 5 common technical questions, 3 behavioral questions, ideal answer structures, and company research tips for the user’s target role.';
      break;
    default:
      taskInstruction =
        'Create a detailed 2-year career roadmap. Include: 3 potential career paths, core skills to master, recommended learning resources, networking strategies, and portfolio project ideas.';
  }

  // System prompt template with mode context
  const systemPrompt = `
You are an expert career mentor AI with 10+ years experience in tech recruiting. 
Guidance must be:
- Specific to the user's current skills and goals
- Actionable with clear next steps
- Formatted in Markdown with ## headings and bullet points
- Include resources (links when possible)
- Address potential roadblocks

Current Mode: ${mode}
Focus Area: ${taskInstruction}
`;

  try {
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt }, // Set AI behavior
          ...messages, // User conversation history
        ],
        temperature: 0.7, // Balance creativity vs focus
        max_tokens: 1500, // Limit response length
      }),
    });

    // Handle API errors
    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      return NextResponse.json(
        { 
          error: error.error?.message || 'Failed to generate response',
          details: error.error 
        }, 
        { status: 500 }
      );
    }

    // Process successful response
    const data = await response.json();
    const result = data.choices?.[0]?.message?.content ?? 'No response generated';

    // Return formatted result
    return NextResponse.json({ 
      result,
      metadata: {
        mode,
        tokens_used: data.usage?.total_tokens,
        model: data.model
      }
    });

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}