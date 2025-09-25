import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          StorySearch AI
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Test page - React is working!
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-green-600 font-semibold">
            ✅ Application is running successfully
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
