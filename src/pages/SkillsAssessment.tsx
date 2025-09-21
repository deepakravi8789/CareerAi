import React, { useState } from 'react';
import { Upload, Plus, X, Brain, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { GeminiService } from '../services/geminiApi';
import { ResumeParser } from '../services/resumeParser';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const geminiService = new GeminiService();
const resumeParser = new ResumeParser();

export default function SkillsAssessment() {
  const [currentStep, setCurrentStep] = useState(1);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [experience, setExperience] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner (0-2 years)' },
    { value: 'intermediate', label: 'Intermediate (2-5 years)' },
    { value: 'experienced', label: 'Experienced (5+ years)' },
  ];

  const popularSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git',
    'Data Analysis', 'Machine Learning', 'Cloud Computing', 'Cybersecurity',
    'Project Management', 'Communication', 'Leadership', 'Problem Solving'
  ];

  const popularInterests = [
    'Artificial Intelligence', 'Web Development', 'Data Science', 'Cybersecurity',
    'Mobile Development', 'Cloud Computing', 'DevOps', 'UI/UX Design',
    'Product Management', 'Digital Marketing', 'Blockchain', 'IoT'
  ];

  const addSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      setSkills([...skills, skill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addInterest = (interest: string) => {
    if (interest.trim() && !interests.includes(interest.trim())) {
      setInterests([...interests, interest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setIsUploadingResume(true);

    try {
      // Validate file
      const validation = resumeParser.validateFile(file);
      if (!validation.isValid) {
        setUploadError(validation.error || 'Invalid file');
        return;
      }

      // Parse resume
      const resumeText = await resumeParser.parseFile(file);
      
      // Extract skills using AI
      const extractedSkills = await geminiService.extractSkillsFromResume(resumeText);
      
      // Add extracted skills to current skills (avoiding duplicates)
      const newSkills = extractedSkills.filter(skill => !skills.includes(skill));
      setSkills(prev => [...prev, ...newSkills]);
      
      setUploadedFileName(file.name);
      
      // Clear the input
      event.target.value = '';
      
    } catch (error) {
      console.error('Resume upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to process resume');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleAnalyze = async () => {
    if (skills.length === 0 || !experience) {
      setUploadError('Please add skills and select experience level');
      return;
    }

    setIsAnalyzing(true);
    setUploadError('');
    try {
      const result = await geminiService.analyzeSkills(skills, experience, interests);
      setAnalysisResult(result);
      setCurrentStep(4);
    } catch (error) {
      console.error('Analysis failed:', error);
      setUploadError(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Your Skills</h3>
        
        {/* Manual skill input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Enter a skill..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && addSkill(newSkill)}
          />
          <button
            onClick={() => addSkill(newSkill)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Popular skills */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">Or select from popular skills:</p>
          <div className="flex flex-wrap gap-2">
            {popularSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => addSkill(skill)}
                disabled={skills.includes(skill)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  skills.includes(skill)
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {skills.includes(skill) && <CheckCircle className="w-3 h-3 inline mr-1" />}
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Selected skills */}
        {skills.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Selected Skills:</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Resume upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          id="resume-upload"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleResumeUpload}
          className="hidden"
          disabled={isUploadingResume}
        />
        <label htmlFor="resume-upload" className="cursor-pointer">
          {isUploadingResume ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-blue-600 font-medium">Processing resume...</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2 font-medium">Upload your resume for automatic skill extraction</p>
              <p className="text-sm text-gray-500">TXT(Supported) or PDF, DOC, DOCX,(Coming Soon)</p>
            </>
          )}
        </label>
        
        {uploadedFileName && (
          <div className="mt-4 flex items-center justify-center text-green-600">
            <FileText className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Processed: {uploadedFileName}</span>
          </div>
        )}
        
        {uploadError && (
          <div className="mt-4 flex items-center justify-center text-red-600">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">{uploadError}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Experience Level</h3>
        <div className="space-y-3">
          {experienceLevels.map((level) => (
            <label key={level.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="experience"
                value={level.value}
                checked={experience === level.value}
                onChange={(e) => setExperience(e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700">{level.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Career Interests</h3>
        
        {/* Manual interest input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Enter an interest..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && addInterest(newInterest)}
          />
          <button
            onClick={() => addInterest(newInterest)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Popular interests */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">Popular career interests:</p>
          <div className="flex flex-wrap gap-2">
            {popularInterests.map((interest) => (
              <button
                key={interest}
                onClick={() => addInterest(interest)}
                disabled={interests.includes(interest)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  interests.includes(interest)
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {interests.includes(interest) && <CheckCircle className="w-3 h-3 inline mr-1" />}
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Selected interests */}
        {interests.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Selected Interests:</p>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  {interest}
                  <button
                    onClick={() => removeInterest(interest)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-8">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete!</h3>
        <p className="text-gray-600">Here's your personalized career assessment</p>
      </div>

      {analysisResult && (
        <div className="space-y-6">
          {/* Readiness Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Overall Readiness</h4>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {analysisResult.readinessScore || 85}%
              </div>
              <p className="text-sm text-blue-700">Career ready score</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
              <h4 className="text-lg font-semibold text-green-900 mb-3">Technical Skills</h4>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {analysisResult.skillProficiency?.technical || 80}%
              </div>
              <p className="text-sm text-green-700">Technical proficiency</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
              <h4 className="text-lg font-semibold text-purple-900 mb-3">Soft Skills</h4>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {analysisResult.skillProficiency?.soft || 85}%
              </div>
              <p className="text-sm text-purple-700">Soft skills rating</p>
            </div>
          </div>

          {/* Top Career Matches */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Recommended Career Paths</h4>
            <div className="space-y-4">
              {(analysisResult.careerPaths || []).slice(0, 3).map((career: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                      {index + 1}
                    </span>
                    <div>
                      <h5 className="font-semibold text-gray-900">{career.title || career}</h5>
                      {career.description && (
                        <p className="text-sm text-gray-600 mt-1">{career.description}</p>
                      )}
                    </div>
                  </div>
                  {career.match && (
                    <span className="text-sm font-medium text-green-600">
                      {career.match}% match
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {analysisResult.recommendations && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h4>
              <ul className="space-y-2">
                {analysisResult.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          {analysisResult.nextSteps && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.nextSteps.map((step: string, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-white rounded-lg">
                    <span className="w-6 h-6 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                    {index + 1}
                  </span>
                    <span className="text-gray-700 text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => {
            setCurrentStep(1);
            setAnalysisResult(null);
          }}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Retake Assessment
        </button>
        <button
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-colors"
          onClick={() => window.location.href = '/career-paths'}
        >
          Explore Career Paths
        </button>
      </div>
    </div>
  );

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <LoadingSpinner size="lg" text="Analyzing your skills and generating personalized recommendations..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Skills Assessment</h1>
          <p className="text-xl text-gray-600">
            Let AI analyze your skills and recommend perfect career paths
          </p>
        </div>

        {/* Progress bar */}
        {currentStep < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-0.5 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">
              Step {currentStep} of 3
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderResults()}

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={
                    (currentStep === 1 && skills.length === 0) ||
                    (currentStep === 2 && !experience)
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleAnalyze}
                  disabled={skills.length === 0 || !experience}
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                </button>
              )}
            </div>
          )}
          
          {/* Error display */}
          {uploadError && currentStep < 4 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-700">{uploadError}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}