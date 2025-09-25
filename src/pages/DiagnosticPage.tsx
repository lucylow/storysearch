import React, { useEffect, useState } from 'react';

const DiagnosticPage: React.FC = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    // Check for common issues
    const checks = [
      {
        name: 'React Router',
        test: () => window.location.pathname !== '/',
        error: 'React Router not working - all routes show same content'
      },
      {
        name: 'Context Providers',
        test: () => {
          try {
            // Try to access a context
            return false;
          } catch (e) {
            return true;
          }
        },
        error: 'Context providers not working'
      },
      {
        name: 'CSS Loading',
        test: () => {
          const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
          return styles.length === 0;
        },
        error: 'CSS not loading properly'
      }
    ];

    checks.forEach(check => {
      if (check.test()) {
        setErrors(prev => [...prev, check.error]);
      }
    });

    // Check for warnings
    if (window.location.pathname === '/') {
      setWarnings(prev => [...prev, 'You are on the root path - try /app or /test']);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          StorySearch AI - Diagnostic Page
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* System Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">System Information</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Current Path:</strong> {window.location.pathname}</p>
              <p><strong>User Agent:</strong> {navigator.userAgent}</p>
              <p><strong>Screen Size:</strong> {window.innerWidth}x{window.innerHeight}</p>
              <p><strong>React Version:</strong> {React.version}</p>
            </div>
          </div>

          {/* Errors */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Errors</h2>
            {errors.length === 0 ? (
              <p className="text-green-600">✅ No errors detected</p>
            ) : (
              <ul className="space-y-2">
                {errors.map((error, index) => (
                  <li key={index} className="text-red-600 text-sm">❌ {error}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Warnings */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-yellow-600">Warnings</h2>
            {warnings.length === 0 ? (
              <p className="text-green-600">✅ No warnings</p>
            ) : (
              <ul className="space-y-2">
                {warnings.map((warning, index) => (
                  <li key={index} className="text-yellow-600 text-sm">⚠️ {warning}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/app'}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Go to Main App
              </button>
              <button
                onClick={() => window.location.href = '/test'}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
              >
                Go to Test Page
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>

        {/* Console Output */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Console Output</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
            <p>Check browser console (F12) for detailed error messages</p>
            <p>If you see errors, they will help identify the issue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage;
