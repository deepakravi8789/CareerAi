import { GeminiService } from './geminiApi';

const geminiService = new GeminiService();

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skill: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  skillLevel: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  certifications: string[];
}

export class SkillQuizService {
  async generateQuiz(skill: string, difficulty: string, questionCount: number = 10): Promise<QuizQuestion[]> {
    const prompt = `
    Generate ${questionCount} multiple choice questions for ${skill} at ${difficulty} level.
    
    Return in JSON format:
    {
      "questions": [
        {
          "id": "1",
          "question": "What is the purpose of React hooks?",
          "options": [
            "To add styling to components",
            "To manage state and lifecycle in functional components",
            "To create class components",
            "To handle routing"
          ],
          "correctAnswer": 1,
          "explanation": "React hooks allow you to use state and other React features in functional components.",
          "difficulty": "intermediate",
          "skill": "React"
        }
      ]
    }
    
    Make questions practical and relevant to real-world scenarios.
    Return only valid JSON.
    `;

    try {
      const response = await geminiService.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const result = JSON.parse(cleanResponse);
      return result.questions || [];
    } catch (error) {
      console.error('Failed to generate quiz questions:', error);
      return this.getFallbackQuestions(skill);
    }
  }

  async evaluateQuizResults(answers: number[], questions: QuizQuestion[]): Promise<QuizResult> {
    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    const prompt = `
    Analyze quiz results and provide recommendations:
    
    Skill: ${questions[0]?.skill || 'General'}
    Score: ${score}%
    Correct: ${correctAnswers}/${questions.length}
    
    Provide analysis in JSON format:
    {
      "skillLevel": "Intermediate",
      "strengths": ["Strong understanding of core concepts"],
      "weaknesses": ["Need to improve advanced topics"],
      "recommendations": [
        "Practice more advanced concepts",
        "Take online course on advanced topics"
      ],
      "certifications": [
        "AWS Certified Developer",
        "React Developer Certification"
      ]
    }
    
    Return only valid JSON.
    `;

    try {
      const response = await geminiService.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const analysis = JSON.parse(cleanResponse);
      
      return {
        score,
        totalQuestions: questions.length,
        correctAnswers,
        ...analysis
      };
    } catch (error) {
      console.error('Failed to analyze quiz results:', error);
      return this.getFallbackResults(score, correctAnswers, questions.length);
    }
  }

  private getFallbackQuestions(skill: string): QuizQuestion[] {
    return [
      {
        id: '1',
        question: `What is a key concept in ${skill}?`,
        options: [
          'Option A',
          'Option B',
          'Option C',
          'Option D'
        ],
        correctAnswer: 1,
        explanation: `This is a fundamental concept in ${skill}.`,
        difficulty: 'intermediate',
        skill
      }
    ];
  }

  private getFallbackResults(score: number, correct: number, total: number): QuizResult {
    let skillLevel = 'Beginner';
    if (score >= 80) skillLevel = 'Advanced';
    else if (score >= 60) skillLevel = 'Intermediate';

    return {
      score,
      totalQuestions: total,
      correctAnswers: correct,
      skillLevel,
      strengths: ['Basic understanding demonstrated'],
      weaknesses: ['Room for improvement in advanced concepts'],
      recommendations: [
        'Continue practicing with real projects',
        'Take additional courses to strengthen weak areas'
      ],
      certifications: [
        'Industry-relevant certification',
        'Professional development course'
      ]
    };
  }
}