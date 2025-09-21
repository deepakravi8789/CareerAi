const GEMINI_API_KEY = 'Your Gemini API Key';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export class GeminiService {
  async makeRequest(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Details:', errorData);
        throw new Error(`API request failed: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Invalid API response structure:', data);
        throw new Error('Invalid response from AI service');
      }

      return data.candidates[0].content.parts[0].text || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('Gemini API Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to connect to AI service. Please try again.');
    }
  }

  async extractSkillsFromResume(resumeText: string): Promise<string[]> {
    const prompt = `
    Extract all technical and professional skills from this resume text. Return only a JSON array of skills, no other text.
    
    Resume text:
    ${resumeText}
    
    Focus on:
    - Programming languages
    - Frameworks and libraries
    - Tools and software
    - Certifications
    - Professional skills
    - Industry knowledge
    
    Return format: ["skill1", "skill2", "skill3", ...]
    `;

    try {
      const response = await this.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const skills = JSON.parse(cleanResponse);
      return Array.isArray(skills) ? skills : [];
    } catch (error) {
      console.error('Error extracting skills:', error);
      // Fallback: try to extract skills using simple text analysis
      return this.extractSkillsBasic(resumeText);
    }
  }

  private extractSkillsBasic(text: string): string[] {
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
      'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
      'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'Jenkins',
      'Machine Learning', 'Data Science', 'AI', 'Deep Learning', 'TensorFlow', 'PyTorch',
      'Project Management', 'Agile', 'Scrum', 'Leadership', 'Communication'
    ];

    const foundSkills: string[] = [];
    const lowerText = text.toLowerCase();

    commonSkills.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });

    return foundSkills;
  }

  async analyzeSkills(skills: string[], experience: string, interests: string[] = []): Promise<any> {
    const prompt = `
    As an AI career advisor, analyze these skills and provide career recommendations:
    
    Skills: ${skills.join(', ')}
    Experience Level: ${experience}
    Interests: ${interests.join(', ')}
    
    Provide a detailed analysis in JSON format with:
    {
      "skillCategories": {
        "technical": ["list of technical skills"],
        "soft": ["list of soft skills"],
        "domain": ["list of domain-specific skills"]
      },
      "skillProficiency": {
        "overall": 85,
        "technical": 80,
        "soft": 90
      },
      "careerPaths": [
        {
          "title": "Career Title",
          "match": 95,
          "description": "Brief description",
          "requiredSkills": ["skill1", "skill2"],
          "missingSkills": ["skill3", "skill4"],
          "averageSalary": "$80,000 - $120,000"
        }
      ],
      "readinessScore": 85,
      "recommendations": [
        "Specific recommendation 1",
        "Specific recommendation 2"
      ],
      "nextSteps": [
        "Action item 1",
        "Action item 2"
      ]
    }
    
    Return only valid JSON, no additional text.
    `;

    try {
      const response = await this.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error analyzing skills:', error);
      return this.getFallbackAnalysis(skills, experience);
    }
  }

  async recommendCareerPaths(skills: string[], interests: string[]): Promise<any> {
    const prompt = `
    Based on these skills: ${skills.join(', ')} and interests: ${interests.join(', ')}, 
    recommend career paths in JSON format:
    
    {
      "careerPaths": [
        {
          "title": "Job Title",
          "description": "2-3 sentence description",
          "requiredSkills": ["skill1", "skill2"],
          "averageSalary": "$75,000 - $120,000",
          "demand": "High",
          "growth": "25% (Much faster than average)",
          "matchScore": 90
        }
      ]
    }
    
    Return only valid JSON.
    `;

    try {
      const response = await this.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error getting career recommendations:', error);
      return this.getFallbackCareerPaths();
    }
  }

  async generateRoadmap(targetCareer: string, currentSkills: string[]): Promise<any> {
    const prompt = `
    Create a detailed learning roadmap for becoming a ${targetCareer}.
    Current skills: ${currentSkills.join(', ')}
    
    Return JSON format:
    {
      "career": "${targetCareer}",
      "duration": "6 months",
      "phases": [
        {
          "name": "Foundation Phase",
          "duration": "2 months",
          "skills": ["skill1", "skill2"],
          "resources": [
            {
              "type": "course",
              "title": "Course Name",
              "provider": "Platform",
              "url": "https://example.com"
            }
          ],
          "projects": ["Project 1", "Project 2"],
          "milestones": ["Milestone 1", "Milestone 2"]
        }
      ]
    }
    
    Return only valid JSON.
    `;

    try {
      const response = await this.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      return this.getFallbackRoadmap(targetCareer);
    }
  }

  async chatWithMentor(message: string, context?: string): Promise<string> {
    const prompt = `
    You are an experienced career mentor and advisor with 15+ years in the tech industry. 
    
    User message: "${message}"
    ${context ? `Previous context: ${context}` : ''}
    
    Provide helpful, encouraging, and practical career advice. Be conversational but professional.
    Focus on actionable insights and specific recommendations.
    Keep responses under 250 words but be comprehensive.
    `;

    return await this.makeRequest(prompt);
  }

  async getJobMarketInsights(): Promise<any> {
    const prompt = `
    Provide current job market insights for tech careers in 2024 in JSON format:
    
    {
      "marketTrends": {
        "hotSkills": ["AI/ML", "Cloud Computing", "Cybersecurity"],
        "emergingRoles": ["AI Engineer", "Cloud Architect"],
        "salaryTrends": "up 8% from 2023"
      },
      "topRoles": [
        {
          "title": "Role Name",
          "demand": 95,
          "averageSalary": 130000,
          "growth": "35%",
          "remoteOpportunities": "High",
          "keySkills": ["skill1", "skill2"]
        }
      ]
    }
    
    Return only valid JSON.
    `;

    try {
      const response = await this.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error getting job market insights:', error);
      return this.getFallbackJobMarket();
    }
  }

  // Fallback methods for when API fails
  private getFallbackAnalysis(skills: string[], experience: string): any {
    return {
      skillCategories: {
        technical: skills.filter(s => ['JavaScript', 'Python', 'React', 'SQL'].includes(s)),
        soft: ['Communication', 'Problem Solving', 'Teamwork'],
        domain: skills.filter(s => !['JavaScript', 'Python', 'React', 'SQL'].includes(s))
      },
      skillProficiency: {
        overall: 75,
        technical: 70,
        soft: 80
      },
      careerPaths: [
        {
          title: 'Software Developer',
          match: 85,
          description: 'Build software applications and systems',
          requiredSkills: ['Programming', 'Problem Solving'],
          missingSkills: ['Advanced Frameworks'],
          averageSalary: '$70,000 - $120,000'
        }
      ],
      readinessScore: 75,
      recommendations: [
        'Focus on building more projects to showcase your skills',
        'Consider learning cloud technologies for better opportunities'
      ],
      nextSteps: [
        'Complete a portfolio project',
        'Practice coding interviews'
      ]
    };
  }

  private getFallbackCareerPaths(): any {
    return {
      careerPaths: [
        {
          title: 'Software Engineer',
          description: 'Design and develop software applications using various programming languages and frameworks.',
          requiredSkills: ['Programming', 'Problem Solving', 'Version Control'],
          averageSalary: '$75,000 - $130,000',
          demand: 'High',
          growth: '22% (Much faster than average)',
          matchScore: 85
        }
      ]
    };
  }

  private getFallbackRoadmap(career: string): any {
    return {
      career,
      duration: '6 months',
      phases: [
        {
          name: 'Foundation Phase',
          duration: '2 months',
          skills: ['Programming Basics', 'Version Control'],
          resources: [
            {
              type: 'course',
              title: 'Programming Fundamentals',
              provider: 'Online Platform',
              url: '#'
            }
          ],
          projects: ['Personal Website', 'Simple Calculator'],
          milestones: ['Complete first project', 'Learn Git basics']
        }
      ]
    };
  }

  private getFallbackJobMarket(): any {
    return {
      marketTrends: {
        hotSkills: ['AI/ML', 'Cloud Computing', 'Cybersecurity'],
        emergingRoles: ['AI Engineer', 'Cloud Architect'],
        salaryTrends: 'up 8% from 2023'
      },
      topRoles: [
        {
          title: 'AI Engineer',
          demand: 95,
          averageSalary: 130000,
          growth: '35%',
          remoteOpportunities: 'High',
          keySkills: ['Python', 'Machine Learning', 'TensorFlow']
        }
      ]
    };
  }
}
