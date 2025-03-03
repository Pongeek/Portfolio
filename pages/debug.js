import React from 'react';
import Head from 'next/head';

export default function DebugPage() {
  const [projectsData, setProjectsData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjectsData(data);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  return (
    <div className="container mx-auto p-6">
      <Head>
        <title>Debug Page</title>
      </Head>
      
      <h1 className="text-3xl font-bold mb-6">Debug Page</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Image Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ImageTest 
            name="Portfolio Image" 
            paths={[
              "/portfolio-preview.png",
              "/api/image?path=portfolio-preview.png"
            ]} 
          />
          <ImageTest 
            name="Coupon Image" 
            paths={[
              "/Coupon.png",
              "/coupon.png",
              "/api/image?path=Coupon.png"
            ]} 
          />
          <ImageTest 
            name="Billiard Image" 
            paths={[
              "/billiardTable.png",
              "/billiardtable.png",
              "/api/image?path=billiardTable.png"
            ]} 
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">CV Download Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border p-4 rounded">
            <h3 className="font-medium mb-2">Direct Link</h3>
            <a 
              href="/Max Mullokandov CV.pdf" 
              className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Test Direct Link
            </a>
          </div>
          
          <div className="border p-4 rounded">
            <h3 className="font-medium mb-2">With Download Attribute</h3>
            <a 
              href="/Max Mullokandov CV.pdf" 
              className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
              download
            >
              Test Download Attribute
            </a>
          </div>
          
          <div className="border p-4 rounded">
            <h3 className="font-medium mb-2">API Endpoint</h3>
            <a 
              href="/api/download-cv" 
              className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
            >
              Test API Endpoint
            </a>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Projects API Response</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p><strong>Error:</strong> {error}</p>
          </div>
        ) : (
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(projectsData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

function ImageTest({ name, paths }) {
  return (
    <div className="border p-4 rounded">
      <h3 className="font-medium mb-2">{name}</h3>
      
      {paths.map((path, index) => (
        <div key={index} className="mb-4">
          <p className="text-sm text-gray-600 mb-1">{path}</p>
          <div className="bg-gray-200 w-full h-40 relative">
            <img
              src={path}
              alt={`${name} - Option ${index + 1}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.opacity = 0.2;
                e.currentTarget.nextSibling.style.display = 'block';
              }}
            />
            <div 
              className="absolute inset-0 flex items-center justify-center text-red-500 hidden"
            >
              Failed to Load
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 