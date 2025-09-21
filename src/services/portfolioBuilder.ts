import { GeminiService } from './geminiApi';

const geminiService = new GeminiService();

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  technologies: string[];
  features: string[];
  learningOutcomes: string[];
  estimatedTime: string;
  category: string;
}

export interface PortfolioTemplate {
  name: string;
  description: string;
  sections: string[];
  projects: ProjectIdea[];
  skills: string[];
}

export class PortfolioBuilderService {
  async generateProjectIdeas(skills: string[], interests: string[], experience: string): Promise<ProjectIdea[]> {
    const prompt = `
    Generate 5 portfolio project ideas based on:
    Skills: ${skills.join(', ')}
    Interests: ${interests.join(', ')}
    Experience: ${experience}
    
    Return in JSON format:
    {
      "projects": [
        {
          "id": "1",
          "title": "E-commerce Dashboard",
          "description": "Build a comprehensive admin dashboard for an e-commerce platform with real-time analytics",
          "difficulty": "intermediate",
          "technologies": ["React", "Node.js", "MongoDB", "Chart.js"],
          "features": [
            "User authentication",
            "Real-time sales analytics",
            "Product management",
            "Order tracking"
          ],
          "learningOutcomes": [
            "Full-stack development",
            "Data visualization",
            "Authentication systems"
          ],
          "estimatedTime": "3-4 weeks",
          "category": "Web Development"
        }
      ]
    }
    
    Make projects practical, impressive to employers, and aligned with current industry trends.
    Return only valid JSON.
    `;

    try {
      const response = await geminiService.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const result = JSON.parse(cleanResponse);
      return result.projects || [];
    } catch (error) {
      console.error('Failed to generate project ideas:', error);
      return this.getFallbackProjects(skills);
    }
  }

  async createPortfolioTemplate(role: string, skills: string[]): Promise<PortfolioTemplate> {
    const prompt = `
    Create a portfolio template for a ${role} position with skills: ${skills.join(', ')}
    
    Return in JSON format:
    {
      "name": "Frontend Developer Portfolio",
      "description": "A comprehensive portfolio showcasing frontend development skills",
      "sections": [
        "About Me",
        "Skills",
        "Projects",
        "Experience",
        "Contact"
      ],
      "projects": [
        {
          "id": "1",
          "title": "Responsive Web App",
          "description": "Modern web application with responsive design",
          "difficulty": "intermediate",
          "technologies": ["React", "CSS3", "JavaScript"],
          "features": ["Responsive design", "Interactive UI"],
          "learningOutcomes": ["Modern web development"],
          "estimatedTime": "2 weeks",
          "category": "Web Development"
        }
      ],
      "skills": ["HTML", "CSS", "JavaScript", "React"]
    }
    
    Return only valid JSON.
    `;

    try {
      const response = await geminiService.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Failed to create portfolio template:', error);
      return this.getFallbackTemplate(role, skills);
    }
  }

  async generateProjectDetails(projectTitle: string, technologies: string[]): Promise<any> {
    const prompt = `
    Generate detailed implementation guide for project: ${projectTitle}
    Technologies: ${technologies.join(', ')}
    
    Return in JSON format:
    {
      "setup": [
        "Initialize project with create-react-app",
        "Install required dependencies"
      ],
      "structure": {
        "folders": ["src/components", "src/pages", "src/utils"],
        "files": ["App.js", "index.js", "package.json"]
      },
      "implementation": [
        "Step 1: Set up project structure",
        "Step 2: Create main components",
        "Step 3: Implement core functionality"
      ],
      "challenges": [
        "State management complexity",
        "API integration"
      ],
      "solutions": [
        "Use React Context for state management",
        "Implement error handling for API calls"
      ],
      "deployment": [
        "Build production version",
        "Deploy to Netlify or Vercel"
      ]
    }
    
    Return only valid JSON.
    `;

    try {
      const response = await geminiService.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Failed to generate project details:', error);
      return this.getFallbackProjectDetails();
    }
  }

  private getFallbackProjects(skills: string[]): ProjectIdea[] {
    return [
      {
        id: '1',
        title: 'Personal Portfolio Website',
        description: 'Create a responsive portfolio website to showcase your skills and projects',
        difficulty: 'beginner',
        technologies: ['HTML', 'CSS', 'JavaScript'],
        features: [
          'Responsive design',
          'Project showcase',
          'Contact form',
          'Smooth animations'
        ],
        learningOutcomes: [
          'Web development fundamentals',
          'Responsive design principles',
          'User experience design'
        ],
        estimatedTime: '1-2 weeks',
        category: 'Web Development'
      },
      {
        id: '2',
        title: 'Task Management App',
        description: 'Build a full-stack task management application with user authentication',
        difficulty: 'intermediate',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        features: [
          'User registration and login',
          'Create, edit, delete tasks',
          'Task categories and priorities',
          'Real-time updates'
        ],
        learningOutcomes: [
          'Full-stack development',
          'Database design',
          'Authentication systems',
          'API development'
        ],
        estimatedTime: '3-4 weeks',
        category: 'Full Stack'
      }
    ];
  }

  private getFallbackTemplate(role: string, skills: string[]): PortfolioTemplate {
    return {
      name: `${role} Portfolio`,
      description: `Professional portfolio template for ${role} position`,
      sections: [
        'About Me',
        'Skills',
        'Projects',
        'Experience',
        'Education',
        'Contact'
      ],
      projects: this.getFallbackProjects(skills),
      skills
    };
  }

  private getFallbackProjectDetails(): any {
    return {
      setup: [
        'Set up development environment',
        'Initialize project structure',
        'Install necessary dependencies'
      ],
      structure: {
        folders: ['src', 'public', 'assets'],
        files: ['index.html', 'main.js', 'style.css']
      },
      implementation: [
        'Create basic HTML structure',
        'Add styling with CSS',
        'Implement JavaScript functionality',
        'Test and debug'
      ],
      challenges: [
        'Cross-browser compatibility',
        'Performance optimization'
      ],
      solutions: [
        'Use modern CSS features with fallbacks',
        'Optimize images and assets'
      ],
      deployment: [
        'Build production version',
        'Deploy to hosting platform',
        'Set up custom domain'
      ]
    };
  }
}