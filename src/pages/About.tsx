import React from 'react';
import { MapPin, Mail, Linkedin, Code, Rocket, Users, Award, Target } from 'lucide-react';

export default function About() {
  const achievements = [
    {
      icon: Code,
      title: '2.5+ Years Experience',
      description: 'AI Product Development'
    },
    {
      icon: Rocket,
      title: 'Startup Vision',
      description: 'Building the future of career guidance'
    },
    {
      icon: Users,
      title: '50K+ Students',
      description: 'Helped with career decisions'
    },
    {
      icon: Award,
      title: 'AI Innovation',
      description: 'Cutting-edge career solutions'
    }
  ];

  const skills = [
    'AI Product Development',
    'Machine Learning',
    'Full-Stack Development',
    'Product Strategy',
    'Startup Leadership',
    'Career Counseling',
    'EdTech Innovation',
    'User Experience Design'
  ];

  const journey = [
    {
      year: '2022',
      title: 'Started AI Journey',
      description: 'Began exploring AI applications in career development'
    },
    {
      year: '2023',
      title: 'Product Development',
      description: 'Built first AI-powered career guidance prototypes'
    },
    {
      year: '2024',
      title: 'Founded CareerAI',
      description: 'Launched comprehensive AI career advisor platform'
    },
    {
      year: '2025',
      title: 'Scaling Impact',
      description: 'Helping thousands of students worldwide'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Meet <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Deepak</span>
              </h1>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Founder & AI Product Developer at CareerAI
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                With over 2.5 years of experience in AI product development, I'm passionate about 
                revolutionizing career guidance through artificial intelligence. My mission is to 
                democratize access to personalized career advice and help students worldwide make 
                informed decisions about their professional futures.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <a href="mailto:deepakravi8789@gmail.com" className="text-gray-700 hover:text-blue-600 transition-colors">
                    deepakravi8789@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">India</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Linkedin className="w-5 h-5 text-blue-700" />
                  <a 
                    href="https://www.linkedin.com/in/deepak-ravi-11a083286/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl transform rotate-3"></div>
                <img
                  src="https://i.postimg.cc/Fs50mFnt/Generated-Image-September-15-2025-11-38-AM.png"
                  alt="Deepak - Founder of CareerAI"
                  className="relative w-80 h-80 object-cover rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
            <Target className="w-12 h-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To create a world where every student has access to personalized, AI-powered career 
              guidance that helps them discover their true potential and navigate the evolving job 
              market with confidence.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
            <Rocket className="w-12 h-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Building innovative AI solutions that bridge the gap between education and employment, 
              empowering students with the tools, insights, and confidence they need to succeed in 
              their chosen careers.
            </p>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Key Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <achievement.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                <p className="text-gray-600 text-sm">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Expertise */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Skills & Expertise</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-blue-100 to-green-100 text-gray-800 rounded-full font-medium hover:from-blue-200 hover:to-green-200 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">My Journey</h2>
          <div className="space-y-8">
            {journey.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  {milestone.year}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Let's Build the Future Together</h2>
          <p className="text-xl text-blue-100 mb-6">
            Join me on this mission to transform career guidance through AI innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:deepakravi8789@gmail.com"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              Get in Touch
            </a>
            <a
              href="https://www.linkedin.com/in/deepak-ravi-11a083286/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              <Linkedin className="w-5 h-5 mr-2" />
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}