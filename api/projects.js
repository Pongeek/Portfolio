// Simple projects API endpoint
module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Return project data
  res.status(200).json([
    {
      id: 1,
      title: "Portfolio Website",
      description: "Personal portfolio website built with React, Tailwind CSS, and Next.js",
      imageUrl: "/portfolio-preview.png",
      technologies: ["React", "Next.js", "Tailwind CSS", "SendGrid"],
      githubUrl: "https://github.com/yourusername/portfolio",
      liveUrl: ""
    },
    {
      id: 2,
      title: "CoupCoupon",
      description: "A coupon management system that helps users find and manage the best deals",
      imageUrl: "/Coupon.png",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      githubUrl: "https://github.com/yourusername/coupcoupon",
      liveUrl: ""
    },
    {
      id: 3,
      title: "Billiard Project",
      description: "Interactive billiards simulation developed with JavaScript and Canvas",
      imageUrl: "/billiardTable.png",
      technologies: ["JavaScript", "Canvas", "HTML5", "CSS3"],
      githubUrl: "https://github.com/yourusername/billiard-project",
      liveUrl: ""
    }
  ]);
};
