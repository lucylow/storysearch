import React from 'react';
import AIReportGenerator from '../components/AIReports/AIReportGenerator';

const AIReportsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AIReportGenerator />
    </div>
  );
};

export default AIReportsPage;

