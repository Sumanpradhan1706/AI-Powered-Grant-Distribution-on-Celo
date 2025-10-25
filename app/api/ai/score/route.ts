import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { projectData } = await request.json();

    const {
      githubUrl,
      description,
      commits,
      pullRequests,
      issues,
      stars,
      forks,
      contributors,
    } = projectData;

    // Create a comprehensive prompt for AI analysis
    const prompt = `Analyze this blockchain project for grant eligibility and calculate an impact score (0-100).

Project Details:
- GitHub URL: ${githubUrl}
- Description: ${description}
- Commits (last 90 days): ${commits}
- Pull Requests: ${pullRequests}
- Issues Resolved: ${issues}
- Stars: ${stars}
- Forks: ${forks}
- Contributors: ${contributors}

Please analyze:
1. Code quality and activity level
2. Community engagement
3. Project sustainability
4. Impact potential on the Celo ecosystem
5. Innovation and uniqueness

Provide a JSON response with:
- impactScore (0-100)
- breakdown: { codeQuality, communityEngagement, sustainability, impactPotential, innovation }
- reasoning: Brief explanation
- recommendations: Array of improvement suggestions`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert blockchain project evaluator specializing in assessing Web3 projects for grant distribution. Provide objective, data-driven analysis.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error('AI Scoring Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to calculate impact score',
      },
      { status: 500 }
    );
  }
}
