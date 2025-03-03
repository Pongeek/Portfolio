// This is the main API handler for Vercel serverless environment
export default async function handler(req, res) {
  // Handle different routes based on path
  const pathSegment = req.query.path || '';
  
  // Forward to the appropriate standalone API file
  if (pathSegment === 'projects') {
    // Import the projects API handler dynamically
    const { default: projectsHandler } = await import('./projects');
    return projectsHandler(req, res);
  }
  
  if (pathSegment === 'contact') {
    // Import the contact API handler dynamically
    const { default: contactHandler } = await import('./contact');
    return contactHandler(req, res);
  }

  if (pathSegment === 'profile') {
    // Import the profile API handler dynamically
    const { default: profileHandler } = await import('./profile');
    return profileHandler(req, res);
  }

  if (pathSegment === 'skills') {
    // Import the skills API handler dynamically
    const { default: skillsHandler } = await import('./skills');
    return skillsHandler(req, res);
  }

  // If no route matches
  return res.status(404).json({ error: 'API endpoint not found' });
} 