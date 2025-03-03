const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Disable caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Check if files exist
    const publicDir = path.join(process.cwd(), 'public');
    
    // List of files to check
    const imageFiles = [
      'portfolio-preview.png',
      'Coupon.png',
      'coupon.png',
      'billiardTable.png',
      'billiardtable.png'
    ];
    
    // Check which files exist
    const fileResults = {};
    imageFiles.forEach(file => {
      const filePath = path.join(publicDir, file);
      try {
        fileResults[file] = fs.existsSync(filePath);
      } catch (error) {
        fileResults[file] = false;
      }
    });
    
    // Get base URL for absolute paths
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : '';
    
    // Projects data
    const projects = [
      {
        id: 1,
        title: "Portfolio Website",
        description: "Personal portfolio website built with React, Tailwind CSS, and Next.js",
        imageUrl: "/portfolio-preview.png",
        imageUrls: [
          "/portfolio-preview.png",
          `${baseUrl}/portfolio-preview.png`,
          "/api/serve?type=image&path=portfolio-preview.png"
        ],
        exists: fileResults['portfolio-preview.png'],
        tech: ["React", "Next.js", "Tailwind CSS", "SendGrid"],
        github: "https://github.com/yourusername/portfolio",
        demo: "",
        slug: "portfolio-website"
      },
      {
        id: 2,
        title: "CoupCoupon",
        description: "A coupon management system that helps users find and manage the best deals",
        imageUrl: "/Coupon.png",
        imageUrls: [
          "/Coupon.png",
          "/coupon.png",
          `${baseUrl}/Coupon.png`,
          `${baseUrl}/coupon.png`,
          "/api/serve?type=image&path=Coupon.png",
          "/api/serve?type=image&path=coupon.png"
        ],
        exists: fileResults['Coupon.png'] || fileResults['coupon.png'],
        tech: ["React", "Node.js", "MongoDB", "Express"],
        github: "https://github.com/yourusername/coupcoupon",
        demo: "",
        slug: "coupcoupon"
      },
      {
        id: 3,
        title: "Billiard Project",
        description: "Interactive billiards simulation developed with JavaScript and Canvas",
        imageUrl: "/billiardTable.png",
        imageUrls: [
          "/billiardTable.png",
          "/billiardtable.png",
          `${baseUrl}/billiardTable.png`,
          `${baseUrl}/billiardtable.png`,
          "/api/serve?type=image&path=billiardTable.png",
          "/api/serve?type=image&path=billiardtable.png"
        ],
        exists: fileResults['billiardTable.png'] || fileResults['billiardtable.png'],
        tech: ["JavaScript", "Canvas", "HTML5", "CSS3"],
        github: "https://github.com/yourusername/billiard-project",
        demo: "",
        slug: "billiard-project"
      }
    ];

    // Return the projects with debug info
    return res.status(200).json({
      projects,
      debug: {
        baseUrl,
        fileResults,
        publicDir,
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        vercelUrl: process.env.VERCEL_URL
      }
    });
  } catch (error) {
    console.error('Error in projects API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 