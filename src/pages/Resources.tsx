import React, { useState } from 'react';
import { BookOpen, Video, Award, ExternalLink, Search, Filter, Star, Clock, Users } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'Course' | 'Certification' | 'Book' | 'Video' | 'Article';
  provider: string;
  duration: string;
  rating: number;
  students?: string;
  description: string;
  skills: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: string;
  url: string;
}

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  
  const resourceTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'Course', label: 'Courses' },
    { value: 'Certification', label: 'Certifications' },
    { value: 'Book', label: 'Books' },
    { value: 'Video', label: 'Videos' },
    { value: 'Article', label: 'Articles' }
  ];

  const levels = [
    { value: 'all', label: 'All Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' }
  ];

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      type: 'Course',
      provider: 'TechEd',
      duration: '40 hours',
      rating: 4.8,
      students: '125K+',
      description: 'Master full-stack web development from HTML basics to advanced React and Node.js',
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
      level: 'Beginner',
      price: '$49.99',
      url: '#'
    },
    {
      id: '2',
      title: 'AWS Solutions Architect Certification',
      type: 'Certification',
      provider: 'Amazon Web Services',
      duration: '3-6 months prep',
      rating: 4.9,
      description: 'Official AWS certification for designing distributed systems on AWS',
      skills: ['AWS', 'Cloud Architecture', 'Security', 'Networking'],
      level: 'Intermediate',
      price: '$150',
      url: '#'
    },
    {
      id: '3',
      title: 'Machine Learning Yearning',
      type: 'Book',
      provider: 'Andrew Ng',
      duration: '8 hours read',
      rating: 4.7,
      description: 'Practical advice on how to structure machine learning projects',
      skills: ['Machine Learning', 'AI Strategy', 'Project Management'],
      level: 'Intermediate',
      price: 'Free',
      url: '#'
    },
    {
      id: '4',
      title: 'Python Data Science Crash Course',
      type: 'Video',
      provider: 'DataCamp',
      duration: '12 hours',
      rating: 4.6,
      students: '89K+',
      description: 'Learn Python for data analysis with pandas, numpy, and matplotlib',
      skills: ['Python', 'Data Analysis', 'Pandas', 'NumPy', 'Matplotlib'],
      level: 'Beginner',
      price: '$29.99',
      url: '#'
    },
    {
      id: '5',
      title: 'Advanced React Patterns',
      type: 'Course',
      provider: 'Frontend Masters',
      duration: '8 hours',
      rating: 4.8,
      students: '45K+',
      description: 'Deep dive into advanced React patterns and performance optimization',
      skills: ['React', 'JavaScript', 'Performance', 'Architecture'],
      level: 'Advanced',
      price: '$39/month',
      url: '#'
    },
    {
      id: '6',
      title: 'Cybersecurity Fundamentals',
      type: 'Certification',
      provider: 'CompTIA',
      duration: '4-6 months prep',
      rating: 4.5,
      description: 'Foundation certification in cybersecurity principles and practices',
      skills: ['Network Security', 'Risk Management', 'Compliance', 'Incident Response'],
      level: 'Beginner',
      price: '$370',
      url: '#'
    },
    {
      id: '7',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      type: 'Book',
      provider: 'Robert C. Martin',
      duration: '15 hours read',
      rating: 4.9,
      description: 'Essential guide to writing clean, maintainable code',
      skills: ['Software Engineering', 'Code Quality', 'Best Practices'],
      level: 'Intermediate',
      price: '$35.99',
      url: '#'
    },
    {
      id: '8',
      title: 'UX Design Process',
      type: 'Video',
      provider: 'Design Academy',
      duration: '6 hours',
      rating: 4.7,
      students: '67K+',
      description: 'Complete UX design process from research to prototyping',
      skills: ['UX Design', 'User Research', 'Prototyping', 'Design Thinking'],
      level: 'Beginner',
      price: '$24.99',
      url: '#'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesLevel = selectedLevel === 'all' || resource.level === selectedLevel;
    
    return matchesSearch && matchesType && matchesLevel;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Course':
        return BookOpen;
      case 'Video':
        return Video;
      case 'Certification':
        return Award;
      default:
        return BookOpen;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Learning Resources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Curated collection of courses, certifications, books, and videos to advance your career. 
            All resources are handpicked by our AI to match current industry demands.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {resourceTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            
            return (
              <div key={resource.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <TypeIcon className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">{resource.type}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(resource.level)}`}>
                      {resource.level}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{resource.provider}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{resource.description}</p>
                </div>

                {/* Metrics */}
                <div className="px-6 pb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{resource.rating}</span>
                      </div>
                      {resource.students && (
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{resource.students}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{resource.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="px-6 pb-4">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.skills.slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {resource.skills.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        +{resource.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-lg font-bold text-gray-900">{resource.price}</div>
                  <a
                    href={resource.url}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-green-700 transition-colors"
                  >
                    View Resource
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Get Personalized Learning Path</h2>
          <p className="text-xl text-blue-100 mb-6">
            Let our AI analyze your skills and create a customized learning roadmap just for you.
          </p>
          <button
            onClick={() => window.location.href = '/skills-assessment'}
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Create My Roadmap
          </button>
        </div>
      </div>
    </div>
  );
}