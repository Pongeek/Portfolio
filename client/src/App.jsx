import React, { useEffect, useState } from 'react';

// Add fallback data
const FALLBACK_SKILLS = [
  { name: "JavaScript", level: 90, category: "Frontend" },
  { name: "TypeScript", level: 85, category: "Frontend" },
  { name: "React", level: 90, category: "Frontend" },
  { name: "Node.js", level: 85, category: "Backend" }
];

const FALLBACK_PROFILE = {
  name: "Max Developer",
  title: "Full Stack Developer",
  experience: []
};

const App = () => {
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const skillsResponse = await fetch('/api/skills');
        if (skillsResponse.ok) {
          const skillsData = await skillsResponse.json();
          setSkills(skillsData);
        } else {
          console.error('Failed to fetch skills');
          setSkills(FALLBACK_SKILLS); // Use fallback data
        }
        
        const profileResponse = await fetch('/api/profile');
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData);
        } else {
          console.error('Failed to fetch profile');
          setProfile(FALLBACK_PROFILE); // Use fallback data
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set fallback data on error
        setSkills(FALLBACK_SKILLS);
        setProfile(FALLBACK_PROFILE);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default App; 