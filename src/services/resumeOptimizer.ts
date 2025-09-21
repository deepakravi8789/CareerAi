import { GeminiService } from './geminiApi';
import jsPDF from 'jspdf';

const geminiService = new GeminiService();

export interface ResumeAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  atsScore: number;
  keywords: string[];
  missingKeywords: string[];
}

export interface OptimizedResume {
  content: string;
  sections: {
    summary: string;
    experience: string[];
    skills: string[];
    education: string;
    projects: string[];
  };
}

export class ResumeOptimizer {
  async analyzeResume(resumeText: string, targetRole?: string): Promise<ResumeAnalysis> {
    const prompt = `
    Analyze this resume and provide detailed feedback for ATS optimization and overall improvement.
    ${targetRole ? `Target role: ${targetRole}` : ''}
    
    Resume content:
    ${resumeText}
    
    Provide analysis in JSON format:
    {
      "score": 85,
      "atsScore": 78,
      "strengths": ["Strong technical skills", "Relevant experience"],
      "weaknesses": ["Missing quantified achievements", "Weak summary"],
      "suggestions": [
        "Add specific metrics to achievements",
        "Strengthen professional summary",
        "Include more relevant keywords"
      ],
      "keywords": ["JavaScript", "React", "Node.js"],
      "missingKeywords": ["TypeScript", "AWS", "Agile"]
    }
    
    Return only valid JSON.
    `;

    try {
      const response = await geminiService.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Resume analysis failed:', error);
      return this.getFallbackAnalysis();
    }
  }

  async optimizeResume(resumeText: string, targetRole: string, jobDescription?: string): Promise<OptimizedResume> {
    const prompt = `
    Optimize this resume for ATS systems and the target role: ${targetRole}
    ${jobDescription ? `Job description: ${jobDescription}` : ''}
    
    Original resume:
    ${resumeText}
    
    Create an ATS-friendly, optimized version in JSON format:
    {
      "content": "Full optimized resume text",
      "sections": {
        "summary": "Professional summary optimized for ATS",
        "experience": [
          "• Quantified achievement with relevant keywords",
          "• Another achievement with metrics"
        ],
        "skills": ["Skill 1", "Skill 2", "Skill 3"],
        "education": "Education section content",
        "projects": [
          "Project 1: Description with technologies used",
          "Project 2: Description with impact metrics"
        ]
      }
    }
    
    Focus on:
    - ATS-friendly formatting
    - Relevant keywords for the role
    - Quantified achievements
    - Action verbs
    - Industry-specific terminology
    
    Return only valid JSON.
    `;

    try {
      const response = await geminiService.makeRequest(prompt);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Resume optimization failed:', error);
      return this.getFallbackOptimizedResume(resumeText);
    }
  }

  async generateATSResumePDF(optimizedResume: OptimizedResume, personalInfo: any): Promise<Blob> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 30;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * (fontSize * 0.4) + 5;
    };

    // Header with personal info
    addText(personalInfo.name || 'Your Name', 18, true);
    addText(`${personalInfo.email || 'email@example.com'} | ${personalInfo.phone || '(555) 123-4567'}`, 11);
    addText(personalInfo.location || 'City, State', 11);
    yPosition += 10;

    // Professional Summary
    addText('PROFESSIONAL SUMMARY', 14, true);
    addText(optimizedResume.sections.summary, 11);
    yPosition += 10;

    // Experience
    addText('PROFESSIONAL EXPERIENCE', 14, true);
    optimizedResume.sections.experience.forEach(exp => {
      addText(exp, 11);
    });
    yPosition += 10;

    // Skills
    addText('TECHNICAL SKILLS', 14, true);
    addText(optimizedResume.sections.skills.join(' • '), 11);
    yPosition += 10;

    // Education
    if (optimizedResume.sections.education) {
      addText('EDUCATION', 14, true);
      addText(optimizedResume.sections.education, 11);
      yPosition += 10;
    }

    // Projects
    if (optimizedResume.sections.projects.length > 0) {
      addText('PROJECTS', 14, true);
      optimizedResume.sections.projects.forEach(project => {
        addText(project, 11);
      });
    }

    return doc.output('blob');
  }

  private getFallbackAnalysis(): ResumeAnalysis {
    return {
      score: 75,
      atsScore: 70,
      strengths: [
        'Clear contact information',
        'Relevant work experience',
        'Technical skills listed'
      ],
      weaknesses: [
        'Missing quantified achievements',
        'Could use stronger action verbs',
        'Professional summary needs improvement'
      ],
      suggestions: [
        'Add specific metrics to your achievements (e.g., "Increased efficiency by 25%")',
        'Use stronger action verbs like "implemented," "optimized," "led"',
        'Include more industry-relevant keywords',
        'Ensure consistent formatting throughout'
      ],
      keywords: ['JavaScript', 'React', 'Node.js', 'SQL'],
      missingKeywords: ['TypeScript', 'AWS', 'Docker', 'Agile']
    };
  }

  private getFallbackOptimizedResume(originalText: string): OptimizedResume {
    return {
      content: originalText,
      sections: {
        summary: 'Results-driven software developer with expertise in modern web technologies and a proven track record of delivering high-quality applications. Experienced in full-stack development with strong problem-solving skills and collaborative mindset.',
        experience: [
          '• Developed and maintained web applications using React, Node.js, and SQL databases',
          '• Collaborated with cross-functional teams to deliver projects on time and within budget',
          '• Implemented responsive designs and optimized application performance'
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'HTML/CSS', 'Git', 'Agile'],
        education: 'Bachelor of Science in Computer Science',
        projects: [
          'E-commerce Platform: Built full-stack application with React frontend and Node.js backend',
          'Task Management App: Developed responsive web application with real-time updates'
        ]
      }
    };
  }
}