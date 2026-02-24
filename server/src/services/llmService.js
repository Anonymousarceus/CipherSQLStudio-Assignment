const OpenAI = require('openai');

let openaiClient = null;

const initializeLLMClient = () => {
  const provider = process.env.LLM_PROVIDER || 'openai';
  
  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  // Gemini init can be added here
};

const createSystemPrompt = () => {
  return `You are a SQL teaching assistant for CipherSQLStudio, an educational SQL learning platform.

Your role is to provide HINTS, not solutions. You help students learn by guiding them without giving away the answer.

STRICT RULES:
1. NEVER provide complete SQL queries that would solve the problem
2. NEVER write out the exact solution syntax
3. Guide students with conceptual explanations
4. Point them toward SQL concepts they might need
5. If they have an error, explain what the error means, not how to fix it directly
6. Use Socratic questioning to help them discover the solution
7. Suggest SQL keywords or clauses they might want to research
8. Keep hints concise (2-4 sentences maximum)

HINT LEVELS:
- Level 1: General concept or approach
- Level 2: Specific SQL clause or function to consider
- Level 3: More detailed guidance without the exact syntax

When a student shares their current query attempt, analyze it and provide guidance on:
- What they're doing correctly
- What concept they might be missing
- Questions to make them think about the problem differently

Remember: Your goal is to help them LEARN, not to do the work for them.`;
};

const createUserPrompt = (assignment, options = {}) => {
  const { currentQuery, errorMessage, hintLevel = 1 } = options;

  let prompt = `ASSIGNMENT:
Title: ${assignment.title}
Question: ${assignment.question}
Expected Output: ${assignment.expectedOutputDescription}

Available Tables:
${assignment.tables.map(t => `- ${t.tableName}: ${t.columns.map(c => c.name).join(', ')}`).join('\n')}

`;

  if (currentQuery) {
    prompt += `STUDENT'S CURRENT ATTEMPT:
\`\`\`sql
${currentQuery}
\`\`\`

`;
  }

  if (errorMessage) {
    prompt += `ERROR MESSAGE RECEIVED:
${errorMessage}

`;
  }

  prompt += `Provide a Level ${hintLevel} hint for this student. Remember: hints only, no solutions.`;

  return prompt;
};

const generateHintWithOpenAI = async (assignment, options = {}) => {
  if (!openaiClient) {
    initializeLLMClient();
  }

  if (!openaiClient) {
    throw new Error('OpenAI client not initialized. Check your API key.');
  }

  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: createSystemPrompt() },
        { role: 'user', content: createUserPrompt(assignment, options) }
      ],
      temperature: 0.7,
      max_tokens: 300,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    return {
      success: true,
      hint: response.choices[0].message.content.trim(),
      model: response.model,
      tokensUsed: response.usage.total_tokens
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to generate hint: ${error.message}`);
  }
};

const generateHintWithGemini = async (assignment, options = {}) => {
  throw new Error('Gemini integration not yet implemented. Please use OpenAI.');
};

const generateHint = async (assignment, options = {}) => {
  const provider = process.env.LLM_PROVIDER || 'openai';

  // Validate inputs
  if (!assignment || !assignment.question) {
    throw new Error('Invalid assignment provided');
  }

  // Generate based on provider
  switch (provider) {
    case 'openai':
      return await generateHintWithOpenAI(assignment, options);
    case 'gemini':
      return await generateHintWithGemini(assignment, options);
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
};

const generateFallbackHint = (assignment, hintLevel = 1) => {
  const hints = {
    1: [
      "Think about which tables contain the data you need.",
      "Consider what columns are relevant to the question.",
      "Break down the problem: what information do you need to retrieve?"
    ],
    2: [
      "Review the SQL keywords: SELECT, FROM, WHERE, JOIN, GROUP BY, HAVING, ORDER BY.",
      "Consider whether you need to combine data from multiple tables.",
      "Think about filtering conditions that match the requirements."
    ],
    3: [
      "Pay attention to the expected output format and columns.",
      "Consider aggregate functions if the question asks for totals, counts, or averages.",
      "Review the relationships between tables - what columns can you use to connect them?"
    ]
  };

  const levelHints = hints[hintLevel] || hints[1];
  
  // Return assignment's built-in hint if available at level 1
  if (hintLevel === 1 && assignment.hint) {
    return {
      success: true,
      hint: assignment.hint,
      model: 'builtin',
      tokensUsed: 0
    };
  }

  // Return random hint from the level
  const randomHint = levelHints[Math.floor(Math.random() * levelHints.length)];
  
  return {
    success: true,
    hint: randomHint,
    model: 'fallback',
    tokensUsed: 0
  };
};

module.exports = {
  generateHint,
  generateFallbackHint,
  initializeLLMClient
};
