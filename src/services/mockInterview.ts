import { GeminiService } from './geminiApi';

const geminiService = new GeminiService();

export interface InterviewQuestion {
  id: string;
  question: string;
  type: 'behavioral' | 'technical' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedAnswer?: string;
  tips: string[];
}

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
  nextSteps: string[];
}

export class MockInterviewService {
  async generateQuestions(role: string, experience: string, count: number = 5): Promise<InterviewQuestion[]> {
    const prompt = `
    Generate ${count} interview questions for a ${role} position with ${experience} experience level.
    
    Include a mix of:
    - Behavioral questions (STAR method)
    - Technical questions relevant to the role
    - Situational questions
    
    Return in JSON format:
    {
      "questions": [
        {
          "id": "1",
          "question": "Tell me about a challenging project you worked on",
          "type": "behavioral",
          "difficulty": "medium",
          "tips": [
            "Use the STAR method (Situation, Task, Action, Result)",
            "Focus on your specific contributions",
            "Quantify the impact when possible"
          ]
        }
      ]
    }
    
    Return only valid JSON.
    `;

    try {
      const response = await geminiService.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const result = JSON.parse(cleanResponse);
      return result.questions || [];
    } catch (error) {
      console.error('Failed to generate interview questions:', error);
      return this.getFallbackQuestions(role);
    }
  }

  async evaluateAnswer(question: string, answer: string, role: string): Promise<InterviewFeedback> {
    const prompt = `
    Evaluate this interview answer for a ${role} position:
    
    Question: ${question}
    Answer: ${answer}
    
    Provide detailed feedback in JSON format:
    {
      "score": 85,
      "strengths": [
        "Clear structure using STAR method",
        "Specific examples provided"
      ],
      "improvements": [
        "Could include more quantified results",
        "Add more technical details"
      ],
      "detailedFeedback": "Your answer demonstrates good problem-solving skills...",
      "nextSteps": [
        "Practice quantifying your achievements",
        "Prepare more technical examples"
      ]
    }
    
    Return only valid JSON.
    `;

    try {
      const response = await geminiService.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Failed to evaluate answer:', error);
      return this.getFallbackFeedback();
    }
  }

  private getFallbackQuestions(role: string): InterviewQuestion[] {
    return [
      {
        id: '1',
        question: 'Tell me about yourself and your background.',
        type: 'behavioral',
        difficulty: 'easy',
        tips: [
          'Keep it professional and relevant to the role',
          'Highlight key achievements and skills',
          'End with why you\'re interested in this position'
        ]
      },
      {
        id: '2',
        question: 'Describe a challenging project you worked on and how you overcame obstacles.',
        type: 'behavioral',
        difficulty: 'medium',
        tips: [
          'Use the STAR method (Situation, Task, Action, Result)',
          'Focus on your problem-solving process',
          'Quantify the impact of your solution'
        ]
      },
      {
        id: '3',
        question: 'What are your greatest strengths and how do they apply to this role?',
        type: 'behavioral',
        difficulty: 'easy',
        tips: [
          'Choose strengths relevant to the job requirements',
          'Provide specific examples',
          'Connect to how you\'ll add value to the team'
        ]
      }
    ];
  }

  private getFallbackFeedback(): InterviewFeedback {
    return {
      score: 75,
      strengths: [
        'Clear communication',
        'Relevant examples provided'
      ],
      improvements: [
        'Add more specific details',
        'Include quantified results',
        'Structure answer more clearly'
      ],
      detailedFeedback: 'Your answer shows good understanding of the question and provides relevant information. To improve, consider adding more specific metrics and structuring your response using the STAR method.',
      nextSteps: [
        'Practice the STAR method for behavioral questions',
        'Prepare specific examples with quantified results',
        'Research common questions for your target role'
      ]
    };
  }
}