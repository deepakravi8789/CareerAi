import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import SkillsAssessment from './pages/SkillsAssessment';
import CareerPaths from './pages/CareerPaths';
import AIAdvisor from './pages/AIAdvisor';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import StudentTools from './pages/StudentTools';
import About from './pages/About';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header onMenuToggle={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/skills-assessment" element={<SkillsAssessment />} />
            <Route path="/career-paths" element={<CareerPaths />} />
            <Route path="/ai-advisor" element={<AIAdvisor />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/student-tools" element={<StudentTools />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;