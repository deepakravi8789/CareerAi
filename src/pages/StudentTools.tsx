import React, { useState } from 'react';
import { 
  FileText, 
  MessageSquare, 
  Award, 
  Briefcase, 
  Upload, 
  Download,
  CheckCircle,
  AlertCircle,
  Play,
  RotateCcw,
  Lightbulb,
  Code,
  Star,
  Clock,
  Users
} from 'lucide-react';
import { ResumeParser } from '../services/resumeParser';
import { ResumeOptimizer, ResumeAnalysis, OptimizedResume } from '../services/resumeOptimizer';
import { MockInterviewService, InterviewQuestion, InterviewFeedback } from '../services/mockInterview';
import { SkillQuizService, QuizQuestion, QuizResult } from '../services/skillQuiz';
import { PortfolioBuilderService, ProjectIdea } from '../services/portfolioBuilder';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const resumeParser = new ResumeParser();
const resumeOptimizer = new ResumeOptimizer();
const mockInterviewService = new MockInterviewService();
const skillQuizService = new SkillQuizService();
const portfolioBuilderService = new PortfolioBuilderService();

export default function StudentTools() {
  const [activeTab, setActiveTab] = useState('resume');
  
  // Resume Optimizer State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [optimizedResume, setOptimizedResume] = useState<OptimizedResume | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // Mock Interview State
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [interviewFeedback, setInterviewFeedback] = useState<InterviewFeedback | null>(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // Skill Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [quizDifficulty, setQuizDifficulty] = useState('intermediate');
  
  // Portfolio Builder State
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState('intermediate');
  const [isGeneratingProjects, setIsGeneratingProjects] = useState(false);

  const tabs = [
    { id: 'resume', label: 'Resume Optimizer', icon: FileText },
    { id: 'interview', label: 'Mock Interview', icon: MessageSquare },
    { id: 'quiz', label: 'Skill Quiz', icon: Award },
    { id: 'portfolio', label: 'Portfolio Builder', icon: Briefcase }
  ];

  // Resume Optimizer Functions
  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    try {
      const text = await resumeParser.parseFile(file);
      setResumeText(text);
    } catch (error) {
      console.error('Failed to parse resume:', error);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await resumeOptimizer.analyzeResume(resumeText, targetRole);
      setResumeAnalysis(analysis);
    } catch (error) {
      console.error('Resume analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const optimizeResume = async () => {
    if (!resumeText || !targetRole) return;
    
    setIsOptimizing(true);
    try {
      const optimized = await resumeOptimizer.optimizeResume(resumeText, targetRole);
      setOptimizedResume(optimized);
    } catch (error) {
      console.error('Resume optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const downloadOptimizedResume = async () => {
    if (!optimizedResume) return;
    
    try {
      const personalInfo = {
        name: 'Your Name',
        email: 'your.email@example.com',
        phone: '(555) 123-4567',
        location: 'City, State'
      };
      
      const pdfBlob = await resumeOptimizer.generateATSResumePDF(optimizedResume, personalInfo);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'optimized-resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download resume:', error);
    }
  };

  // Mock Interview Functions
  const startInterview = async () => {
    if (!targetRole) return;
    
    try {
      const questions = await mockInterviewService.generateQuestions(targetRole, experienceLevel);
      setInterviewQuestions(questions);
      setCurrentQuestionIndex(0);
      setIsInterviewActive(true);
      setInterviewFeedback(null);
    } catch (error) {
      console.error('Failed to start interview:', error);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim() || !interviewQuestions[currentQuestionIndex]) return;
    
    setIsEvaluating(true);
    try {
      const feedback = await mockInterviewService.evaluateAnswer(
        interviewQuestions[currentQuestionIndex].question,
        userAnswer,
        targetRole
      );
      setInterviewFeedback(feedback);
    } catch (error) {
      console.error('Failed to evaluate answer:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setInterviewFeedback(null);
    } else {
      setIsInterviewActive(false);
    }
  };

  // Skill Quiz Functions
  const startQuiz = async () => {
    if (!selectedSkill) return;
    
    try {
      const questions = await skillQuizService.generateQuiz(selectedSkill, quizDifficulty);
      setQuizQuestions(questions);
      setCurrentQuizIndex(0);
      setQuizAnswers([]);
      setIsQuizActive(true);
      setQuizResult(null);
    } catch (error) {
      console.error('Failed to start quiz:', error);
    }
  };

  const selectQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuizIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const nextQuizQuestion = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    try {
      const result = await skillQuizService.evaluateQuizResults(quizAnswers, quizQuestions);
      setQuizResult(result);
      setIsQuizActive(false);
    } catch (error) {
      console.error('Failed to evaluate quiz:', error);
    }
  };

  // Portfolio Builder Functions
  const generateProjectIdeas = async () => {
    if (userSkills.length === 0) return;
    
    setIsGeneratingProjects(true);
    try {
      const ideas = await portfolioBuilderService.generateProjectIdeas(
        userSkills,
        userInterests,
        experienceLevel
      );
      setProjectIdeas(ideas);
    } catch (error) {
      console.error('Failed to generate project ideas:', error);
    } finally {
      setIsGeneratingProjects(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const renderResumeOptimizer = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Resume Analysis & Optimization</h3>
        
        {/* Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleResumeUpload}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Click to upload your resume</p>
              <p className="text-sm text-gray-500">TXT(Supported) or PDF, DOC, DOCX,(Coming Soon)</p>
            </label>
          </div>
          {resumeFile && (
            <p className="mt-2 text-sm text-green-600">✓ {resumeFile.name} uploaded</p>
          )}
        </div>

        {/* Target Role */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g., Software Engineer, Data Scientist"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={analyzeResume}
            disabled={!resumeText || isAnalyzing}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
          </button>
          <button
            onClick={optimizeResume}
            disabled={!resumeText || !targetRole || isOptimizing}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOptimizing ? 'Optimizing...' : 'Optimize Resume'}
          </button>
        </div>

        {/* Analysis Results */}
        {resumeAnalysis && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600">{resumeAnalysis.score}%</div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{resumeAnalysis.atsScore}%</div>
                  <div className="text-sm text-gray-600">ATS Score</div>
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Key Suggestions:</h5>
                <ul className="space-y-1">
                  {resumeAnalysis.suggestions.slice(0, 3).map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Optimized Resume */}
        {optimizedResume && (
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Optimized Resume</h4>
              <button
                onClick={downloadOptimizedResume}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            </div>
            <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {optimizedResume.content}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMockInterview = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Mock Interview Simulator</h3>
        
        {!isInterviewActive ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Software Engineer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="beginner">Beginner (0-2 years)</option>
                <option value="intermediate">Intermediate (2-5 years)</option>
                <option value="experienced">Experienced (5+ years)</option>
              </select>
            </div>
            <button
              onClick={startInterview}
              disabled={!targetRole}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Interview
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-900">
                Question {currentQuestionIndex + 1} of {interviewQuestions.length}
              </h4>
              <button
                onClick={() => setIsInterviewActive(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
            
            {interviewQuestions[currentQuestionIndex] && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-900 font-medium">
                    {interviewQuestions[currentQuestionIndex].question}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 rounded-full">
                      {interviewQuestions[currentQuestionIndex].type}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded-full">
                      {interviewQuestions[currentQuestionIndex].difficulty}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Answer</label>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your answer here..."
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim() || isEvaluating}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEvaluating ? 'Evaluating...' : 'Submit Answer'}
                  </button>
                  {interviewFeedback && (
                    <button
                      onClick={nextQuestion}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {currentQuestionIndex < interviewQuestions.length - 1 ? 'Next Question' : 'Finish Interview'}
                    </button>
                  )}
                </div>
                
                {interviewFeedback && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Feedback (Score: {interviewFeedback.score}%)</h5>
                    <p className="text-gray-700 mb-3">{interviewFeedback.detailedFeedback}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h6 className="font-medium text-green-700 mb-1">Strengths:</h6>
                        <ul className="text-sm text-gray-600">
                          {interviewFeedback.strengths.map((strength, index) => (
                            <li key={index}>• {strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h6 className="font-medium text-orange-700 mb-1">Areas for Improvement:</h6>
                        <ul className="text-sm text-gray-600">
                          {interviewFeedback.improvements.map((improvement, index) => (
                            <li key={index}>• {improvement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderSkillQuiz = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Skill Assessment Quiz</h3>
        
        {!isQuizActive && !quizResult ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Skill</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a skill</option>
                <option value="JavaScript">JavaScript</option>
                <option value="React">React</option>
                <option value="Python">Python</option>
                <option value="Data Science">Data Science</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="SQL">SQL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
              <select
                value={quizDifficulty}
                onChange={(e) => setQuizDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <button
              onClick={startQuiz}
              disabled={!selectedSkill}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Award className="w-5 h-5 mr-2" />
              Start Quiz
            </button>
          </div>
        ) : isQuizActive ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-900">
                Question {currentQuizIndex + 1} of {quizQuestions.length}
              </h4>
              <div className="text-sm text-gray-600">
                {selectedSkill} - {quizDifficulty}
              </div>
            </div>
            
            {quizQuestions[currentQuizIndex] && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-900 font-medium">
                    {quizQuestions[currentQuizIndex].question}
                  </p>
                </div>
                
                <div className="space-y-2">
                  {quizQuestions[currentQuizIndex].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => selectQuizAnswer(index)}
                      className={`w-full text-left p-4 border rounded-lg transition-colors ${
                        quizAnswers[currentQuizIndex] === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={nextQuizQuestion}
                  disabled={quizAnswers[currentQuizIndex] === undefined}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuizIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </button>
              </div>
            )}
          </div>
        ) : quizResult ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{quizResult.score}%</div>
              <div className="text-lg text-gray-700 mb-4">
                {quizResult.correctAnswers} out of {quizResult.totalQuestions} correct
              </div>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
                {quizResult.skillLevel} Level
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h5 className="font-semibold text-green-800 mb-2">Strengths</h5>
                <ul className="text-sm text-green-700">
                  {quizResult.strengths.map((strength, index) => (
                    <li key={index}>• {strength}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h5 className="font-semibold text-orange-800 mb-2">Areas to Improve</h5>
                <ul className="text-sm text-orange-700">
                  {quizResult.weaknesses.map((weakness, index) => (
                    <li key={index}>• {weakness}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-semibold text-blue-800 mb-2">Recommended Certifications</h5>
              <div className="flex flex-wrap gap-2">
                {quizResult.certifications.map((cert, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => {
                setQuizResult(null);
                setQuizAnswers([]);
                setCurrentQuizIndex(0);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Take Another Quiz
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );

  const renderPortfolioBuilder = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Project Generator</h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Skills</label>
            <input
              type="text"
              value={userSkills.join(', ')}
              onChange={(e) => setUserSkills(e.target.value.split(',').map(s => s.trim()).filter(s => s))}
              placeholder="JavaScript, React, Python, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
            <input
              type="text"
              value={userInterests.join(', ')}
              onChange={(e) => setUserInterests(e.target.value.split(',').map(s => s.trim()).filter(s => s))}
              placeholder="Web Development, AI, Data Science, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <button
            onClick={generateProjectIdeas}
            disabled={userSkills.length === 0 || isGeneratingProjects}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            {isGeneratingProjects ? 'Generating...' : 'Generate Project Ideas'}
          </button>
        </div>

        {projectIdeas.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Recommended Projects</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projectIdeas.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="text-lg font-semibold text-gray-900">{project.title}</h5>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h6 className="font-medium text-gray-900 mb-1">Technologies:</h6>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h6 className="font-medium text-gray-900 mb-1">Key Features:</h6>
                      <ul className="text-sm text-gray-600">
                        {project.features.slice(0, 3).map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-600 pt-2 border-t border-gray-100">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {project.estimatedTime}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {project.category}
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-colors flex items-center justify-center">
                    <Code className="w-4 h-4 inline mr-2" />
                    Get Implementation Guide
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Student Preparation Tools</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools to optimize your resume, practice interviews, assess skills, and build an impressive portfolio.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex flex-wrap border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 lg:px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'resume' && renderResumeOptimizer()}
        {activeTab === 'interview' && renderMockInterview()}
        {activeTab === 'quiz' && renderSkillQuiz()}
        {activeTab === 'portfolio' && renderPortfolioBuilder()}
      </div>
    </div>
  );
}