import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API: Check Gemini Status
app.get('/api/ai/status', (req, res) => {
  res.json({
    available: !!ai,
    model: 'gemini-3.8-flash',
  });
});

// API: Generate Pedagogical Insight & Recommendations for a student
app.post('/api/ai/analyze-student', async (req, res) => {
  try {
    const { student, readingHistory, sessionData, teacherObservation } = req.body;

    if (!student) {
      return res.status(400).json({ error: 'Missing student data' });
    }

    if (ai) {
      const prompt = `You are an expert junior high school English reading pedagogy specialist assisting an English teacher (Ms. Dewi).
Analyze this junior high school student's reading performance and affective indicators.

Context:
- Student Name: ${student.name} (${student.id})
- Class: ${student.class || 'VIII-A'}
- Reading Text: ${sessionData?.readingTextTitle || 'General English Reading'} (${sessionData?.textType || 'Expository'}, Level ${sessionData?.textLevel || 'A2'})
- Reading Comprehension Scores (0-100):
  * Overall Reading Score: ${sessionData?.readingScore ?? student.readingScore}
  * Main Idea: ${sessionData?.mainIdeaScore ?? student.mainIdea}
  * Specific Information: ${sessionData?.specificInfoScore ?? student.specificInfo}
  * Inference: ${sessionData?.inferenceScore ?? student.inference}
  * Vocabulary in Context: ${sessionData?.vocabularyScore ?? student.vocabulary}
- Engagement & Affective Indicators:
  * Task Completion: ${sessionData?.taskCompletion ?? 85}%
  * Response Time: ${sessionData?.responseTime ?? 120} seconds
  * Engagement Level (1-5): ${sessionData?.engagement ?? student.engagement}
  * Confidence Level (1-5): ${sessionData?.confidence ?? student.confidence}
  * Reading Anxiety Level (1-5, note: HIGHER anxiety = greater concern): ${sessionData?.anxiety ?? student.anxiety}
  * Motivation Level (1-5): ${sessionData?.motivation ?? 3.5}
- Teacher Observation (optional): ${teacherObservation || 'None provided'}

CRITICAL GUIDELINES:
1. Do NOT diagnose students or make psychological/clinical claims.
2. Use cautious, evidence-grounded academic phrases: "may indicate", "appears to", "is associated with", "the data suggest".
3. Distinguish observed data from AI interpretation.
4. Note that Reading Anxiety is interpreted inversely (higher = more distress/reluctance).
5. Ground your recommendations in Krashen's Affective Filter hypothesis and Reading Comprehension Strategies for EFL/ESL junior high students (scaffolded questioning, contextual vocabulary clues, graphic organizers).
6. Provide 3 specific, classroom-feasible suggested actions for the teacher.

Return JSON adhering strictly to this schema:
{
  "priority": "High" | "Medium" | "Low",
  "detectedPattern": "Short headline of the pattern",
  "evidence": "Concrete metrics from the student's scores and affective indicators",
  "aiInsight": "2-3 sentences synthesizing reading skills and affective indicators cautiously",
  "suggestedActions": [
    "Classroom-feasible action 1",
    "Classroom-feasible action 2",
    "Classroom-feasible action 3"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              priority: { type: Type.STRING },
              detectedPattern: { type: Type.STRING },
              evidence: { type: Type.STRING },
              aiInsight: { type: Type.STRING },
              suggestedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['priority', 'detectedPattern', 'evidence', 'aiInsight', 'suggestedActions'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    }

    // Fallback heuristic pedagogical engine if no GEMINI_API_KEY
    const score = sessionData?.readingScore ?? student.readingScore ?? 75;
    const mainIdea = sessionData?.mainIdeaScore ?? student.mainIdea ?? 75;
    const specificInfo = sessionData?.specificInfoScore ?? student.specificInfo ?? 75;
    const inference = sessionData?.inferenceScore ?? student.inference ?? 70;
    const vocab = sessionData?.vocabularyScore ?? student.vocabulary ?? 65;
    const anxiety = sessionData?.anxiety ?? student.anxiety ?? 2.5;
    const confidence = sessionData?.confidence ?? student.confidence ?? 3.5;

    let priority = 'Medium';
    let pattern = 'Balanced skill development with growth opportunities';
    let suggestedActions = [
      'Provide short reading texts containing target vocabulary embedded in contextual clues.',
      'Incorporate guided peer-discussion for inference questions before individual tasks.',
      'Maintain positive feedback loops to sustain reading confidence.',
    ];

    if (score < 60 || anxiety >= 4.0) {
      priority = 'High';
      pattern = 'Elevated reading anxiety and comprehension challenge';
      suggestedActions = [
        'Reduce text complexity temporarily (use A1+/A2 leveled readers) to lower affective filter.',
        'Use pre-reading visual glossaries and bilingual vocabulary anchors.',
        'Allow untimed reading comprehension tasks to alleviate time-related anxiety.',
      ];
    } else if (vocab < 65 && inference < 65) {
      pattern = 'Vocabulary barrier impacting contextual inference';
      suggestedActions = [
        'Introduce morphology and semantic clue cards for reading passages.',
        'Use scaffolded graphic organizers (concept maps) before answering inference prompts.',
        'Model think-aloud strategies for deriving word meaning from surrounding sentences.',
      ];
    } else if (score >= 85) {
      priority = 'Low';
      pattern = 'Strong holistic comprehension and affective readiness';
      suggestedActions = [
        'Provide supplementary authentic reading materials (junior science articles, short narratives).',
        'Assign peer-tutoring or reading circle leader roles during group synthesis.',
        'Gradually introduce B1 level texts with nuanced rhetorical questions.',
      ];
    }

    const insight = `${student.name} demonstrates ${score >= 80 ? 'solid' : 'developing'} performance overall (${score}/100), with main idea at ${mainIdea}% and specific details at ${specificInfo}%. The data suggest vocabulary in context (${vocab}%) and inference (${inference}%) represent key developmental areas, while confidence (${confidence}/5) and anxiety (${anxiety}/5) indicate an affective profile that will benefit from supportive scaffolding.`;

    return res.json({
      priority,
      detectedPattern: pattern,
      evidence: `Score: ${score}, Main Idea: ${mainIdea}%, Vocab: ${vocab}%, Anxiety: ${anxiety}/5, Confidence: ${confidence}/5`,
      aiInsight: insight,
      suggestedActions,
    });
  } catch (error: any) {
    console.error('Error generating AI insight:', error);
    res.status(500).json({ error: error.message || 'Failed to generate AI insight' });
  }
});

// API: Proxy for Google Apps Script Web App sync (handles redirects & CORS)
app.post('/api/sync/apps-script', async (req, res) => {
  try {
    const { scriptUrl, action = 'fetch', payload } = req.body;
    if (!scriptUrl || !scriptUrl.startsWith('https://script.google.com/')) {
      return res.status(400).json({ error: 'Valid Google Apps Script Web App URL required' });
    }

    if (action === 'fetch') {
      const response = await fetch(scriptUrl, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      const data = await response.json();
      return res.json(data);
    } else if (action === 'sync') {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return res.json(data);
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error: any) {
    console.error('Apps Script proxy error:', error);
    res.status(500).json({ error: error.message || 'Error communicating with Google Apps Script' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer();
