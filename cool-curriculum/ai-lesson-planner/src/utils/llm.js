// LLM Integration Utilities for AI Lesson Planner
// Handles communication with Anthropic Claude API

const ANTHROPIC_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

/**
 * Builds the system and user prompt for LLM generation
 */
export function buildPrompt(request) {
  const { prompt, options, selectedProfiles } = request;

  // Build profile context if profiles are selected
  let profileContext = '';
  if (selectedProfiles && selectedProfiles.length > 0) {
    profileContext = '\n\n--- STUDENT PROFILES FOR DIFFERENTIATION ---\n';
    selectedProfiles.forEach((profile, idx) => {
      profileContext += `\nProfile ${idx + 1}: ${profile.name}\n`;
      profileContext += `- Grade Range: ${profile.gradeRange?.map(g => g === 0 ? 'K' : g).join(', ')}\n`;
      profileContext += `- Reading Level: ${profile.readingLevel?.replace('_', ' ')}\n`;
      if (profile.interestThemes?.length > 0) {
        profileContext += `- Interests: ${profile.interestThemes.join(', ')}\n`;
      }
      if (profile.characteristics?.length > 0) {
        profileContext += `- Characteristics: ${profile.characteristics.map(c => c.replace('_', ' ')).join(', ')}\n`;
      }
      if (profile.notes) {
        profileContext += `- Notes: ${profile.notes}\n`;
      }
    });
  }

  // Build options context
  let optionsContext = '';
  if (options.grade !== null) {
    optionsContext += `\nGrade Level: ${options.grade === 0 ? 'K' : options.grade}`;
  }
  if (options.subject) {
    optionsContext += `\nSubject: ${options.subject}`;
  }
  if (options.materialType) {
    optionsContext += `\nMaterial Type: ${options.materialType}`;
  }
  if (options.language && options.language !== 'english') {
    optionsContext += `\nLanguage: ${options.language}`;
  }

  const systemPrompt = `You are an expert K-4 educator specializing in creating age-appropriate, engaging learning materials. You create standards-aligned content that is developmentally appropriate and visually engaging.

Your task is to generate educational materials in a structured JSON format that can be used to create worksheets, quizzes, and activities.

IMPORTANT OUTPUT FORMAT:
You must respond with ONLY valid JSON. No markdown, no explanations, just pure JSON.

The JSON structure must be:
{
  "title": "Clear, engaging title for the material",
  "learningObjective": "Specific learning objective (what students will be able to do)",
  "instructions": "Clear, age-appropriate instructions for students",
  "questions": [
    {
      "number": 1,
      "question": "The question text or problem",
      "answer": "The correct answer",
      "workSpace": true/false (whether students need space to show work)
    }
  ],
  "differentiation": {
    "scaffolding": "Optional scaffolding tips",
    "extension": "Optional extension activity"
  }
}

KEY PRINCIPLES:
- Use age-appropriate language and vocabulary
- Include clear, simple instructions
- Make questions engaging and relevant to student interests
- Ensure answers are accurate
- Consider reading level and learning characteristics`;

  const userPrompt = `${prompt}${optionsContext}${profileContext}

Please generate the learning material following the JSON format specified. Make it engaging, accurate, and appropriate for the grade level.`;

  return {
    systemPrompt,
    userPrompt
  };
}

/**
 * Calls the Anthropic Claude API to generate content
 */
export async function generateDraft(request) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured. Please add REACT_APP_ANTHROPIC_API_KEY to .env.local');
  }

  const { systemPrompt, userPrompt } = buildPrompt(request);

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`
      );
    }

    const data = await response.json();

    // Extract the text content from the response
    const textContent = data.content?.[0]?.text;
    if (!textContent) {
      throw new Error('No content returned from API');
    }

    // Parse the JSON response
    const parsedContent = parseLLMResponse(textContent);

    return {
      success: true,
      data: parsedContent,
      rawResponse: textContent
    };

  } catch (error) {
    console.error('LLM Generation Error:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}

/**
 * Parses the LLM response and extracts JSON
 */
export function parseLLMResponse(rawText) {
  try {
    // Remove markdown code blocks if present
    let cleanedText = rawText.trim();

    // Remove ```json and ``` if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    // Try to find JSON object in the text
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    const parsed = JSON.parse(cleanedText);

    // Validate required fields
    if (!parsed.title || !parsed.learningObjective || !parsed.instructions || !parsed.questions) {
      throw new Error('Missing required fields in LLM response');
    }

    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error('Questions must be a non-empty array');
    }

    return parsed;

  } catch (error) {
    console.error('Parse Error:', error);
    console.error('Raw text:', rawText);
    throw new Error(`Failed to parse LLM response: ${error.message}`);
  }
}

/**
 * Generates multiple variants for different student profiles
 */
export async function generateMultipleVariants(request) {
  const { selectedProfiles } = request;

  if (!selectedProfiles || selectedProfiles.length === 0) {
    // Just generate one variant
    const result = await generateDraft(request);
    return {
      success: result.success,
      variants: result.success ? [{ profileName: 'Standard', data: result.data }] : [],
      errors: result.success ? [] : [result.error]
    };
  }

  // Generate variant for each profile
  const results = await Promise.all(
    selectedProfiles.map(async (profile) => {
      const profileRequest = {
        ...request,
        selectedProfiles: [profile] // Generate for one profile at a time
      };
      const result = await generateDraft(profileRequest);
      return {
        profile,
        result
      };
    })
  );

  const variants = results
    .filter(r => r.result.success)
    .map(r => ({
      profileName: r.profile.name,
      profileId: r.profile.id,
      data: r.result.data
    }));

  const errors = results
    .filter(r => !r.result.success)
    .map(r => `${r.profile.name}: ${r.result.error}`);

  return {
    success: variants.length > 0,
    variants,
    errors
  };
}
