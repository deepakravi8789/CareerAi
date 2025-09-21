import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, ArrowRight, Filter, Search } from 'lucide-react';
import { GeminiService } from '../services/geminiApi';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const geminiService = new GeminiService();

interface CareerPath {
  title: string;
  description: string;
  requiredSkills: string[];
  averageSalary: string;
  demand: string;
  growth: string;
}

export default function CareerPaths() {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [filteredPaths, setFilteredPaths] = useState<CareerPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'data', label: 'Data & Analytics' },
    { value: 'design', label: 'Design' },
    { value: 'product', label: 'Product & Management' },
    { value: 'security', label: 'Security' },
    { value: 'ai', label: 'AI & Machine Learning' }
  ];

  const defaultCareerPaths: CareerPath[] = [
    {
      title: 'AI Engineer',
      description: 'Design and develop artificial intelligence systems, machine learning models, and automated solutions for complex problems.',
      requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'Deep Learning', 'Data Science'],
      averageSalary: '$120,000 - $180,000',
      demand: 'Very High',
      growth: '32% (Much faster than average)'
    },
    {
      title: 'Full Stack Developer',
      description: 'Build complete web applications handling both frontend user interfaces and backend server logic.',
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'API Development'],
      averageSalary: '$80,000 - $140,000',
      demand: 'High',
      growth: '25% (Much faster than average)'
    },
    {
      title: 'Data Scientist',
      description: 'Extract insights from complex data sets using statistical analysis, machine learning, and data visualization.',
      requiredSkills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization'],
      averageSalary: '$95,000 - $165,000',
      demand: 'High',
      growth: '35% (Much faster than average)'
    },
    {
      title: 'Cybersecurity Specialist',
      description: 'Protect organizations from digital threats by implementing security measures and responding to incidents.',
      requiredSkills: ['Network Security', 'Penetration Testing', 'Risk Assessment', 'Incident Response'],
      averageSalary: '$85,000 - $150,000',
      demand: 'Very High',
      growth: '33% (Much faster than average)'
    },
    {
      title: 'Cloud Solutions Architect',
      description: 'Design and oversee cloud computing strategies, ensuring scalable and secure cloud infrastructure.',
      requiredSkills: ['AWS', 'Azure', 'Cloud Architecture', 'DevOps', 'Kubernetes', 'Microservices'],
      averageSalary: '$110,000 - $170,000',
      demand: 'High',
      growth: '30% (Much faster than average)'
    },
    {
      title: 'UX/UI Designer',
      description: 'Create intuitive and engaging user experiences through research, design, and prototyping.',
      requiredSkills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'HTML/CSS'],
      averageSalary: '$70,000 - $120,000',
      demand: 'High',
      growth: '13% (Faster than average)'
    },
    {
      title: 'Product Manager',
      description: 'Guide product development from conception to launch, working with cross-functional teams.',
      requiredSkills: ['Product Strategy', 'Market Research', 'Agile', 'Analytics', 'Communication'],
      averageSalary: '$90,000 - $160,000',
      demand: 'High',
      growth: '20% (Much faster than average)'
    },
    {
      title: 'DevOps Engineer',
      description: 'Streamline software development and deployment through automation and infrastructure management.',
      requiredSkills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Infrastructure as Code', 'Monitoring'],
      averageSalary: '$95,000 - $155,000',
      demand: 'Very High',
      growth: '28% (Much faster than average)'
    }
  ];

  useEffect(() => {
    loadCareerPaths();
  }, []);

  useEffect(() => {
    filterCareerPaths();
  }, [searchTerm, selectedCategory, careerPaths]);

  const loadCareerPaths = async () => {
    setIsLoading(true);
    try {
      // Try to get AI-enhanced career paths
      try {
        const aiPaths = await geminiService.recommendCareerPaths(
          ['JavaScript', 'Python', 'React', 'Data Analysis'], 
          ['Technology', 'Innovation', 'Problem Solving']
        );
        if (aiPaths.careerPaths && aiPaths.careerPaths.length > 0) {
          setCareerPaths([...aiPaths.careerPaths, ...defaultCareerPaths]);
        } else {
          setCareerPaths(defaultCareerPaths);
        }
      } catch (aiError) {
        console.error('AI career paths failed, using defaults:', aiError);
        setCareerPaths(defaultCareerPaths);
      }
    } catch (error) {
      console.error('Failed to load career paths:', error);
      setCareerPaths(defaultCareerPaths);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCareerPaths = () => {
    let filtered = careerPaths;

    if (searchTerm) {
      filtered = filtered.filter(path => 
        path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        path.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(path => {
        const title = path.title.toLowerCase();
        switch (selectedCategory) {
          case 'engineering':
            return title.includes('engineer') || title.includes('developer');
          case 'data':
            return title.includes('data') || title.includes('analyst');
          case 'design':
            return title.includes('design') || title.includes('ux') || title.includes('ui');
          case 'product':
            return title.includes('product') || title.includes('manager');
          case 'security':
            return title.includes('security') || title.includes('cyber');
          case 'ai':
            return title.includes('ai') || title.includes('machine learning') || title.includes('ml');
          default:
            return true;
        }
      });
    }

    setFilteredPaths(filtered);
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Very High':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="lg" text="Loading career paths..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Career Paths</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover high-growth career opportunities in tech. Each path includes required skills, 
            salary ranges, and market demand insights.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search career paths or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="lg:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Career Paths Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredPaths.map((path, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{path.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDemandColor(path.demand)}`}>
                    {path.demand} Demand
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">{path.description}</p>

                {/* Metrics */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-600">Salary:</span>
                    <span className="font-semibold text-gray-900 ml-1">{path.averageSalary}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-gray-600">Growth:</span>
                    <span className="font-semibold text-gray-900 ml-1">{path.growth}</span>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Skills Required:</h4>
                  <div className="flex flex-wrap gap-2">
                    {path.requiredSkills.slice(0, 4).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {path.requiredSkills.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        +{path.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200">
                  Get Roadmap
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredPaths.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No career paths found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Need Personalized Recommendations?</h2>
          <p className="text-xl text-blue-100 mb-6">
            Take our skills assessment to get AI-powered career path recommendations tailored to you.
          </p>
          <button
            onClick={() => window.location.href = '/skills-assessment'}
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Start Assessment
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}