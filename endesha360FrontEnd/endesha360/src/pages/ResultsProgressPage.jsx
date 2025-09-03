import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchComprehensiveProgress, fetchTestResults } from '../api/studentProgress';
import { useAuth } from '../context/AuthContext';

const ResultsProgressPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [comprehensiveProgress, setComprehensiveProgress] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    
    Promise.all([
      fetchComprehensiveProgress(user.id, token).catch(() => []),
      fetchTestResults(user.id, token).catch(() => [])
    ])
    .then(([comprehensive, tests]) => {
      setComprehensiveProgress(comprehensive);
      setTestResults(tests);
    })
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
  }, [user, token]);

  if (!user) return <div className="p-4 text-center">Please log in to view your progress.</div>;
  if (loading) return <div className="p-4 text-center">Loading progress...</div>;
  if (error) return <div className="p-4 text-center text-red-600">Error: {error}</div>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'submitted':
        return 'text-green-600 bg-green-100';
      case 'failed':
      case 'expired':
        return 'text-red-600 bg-red-100';
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#00712D] mb-6">Results & Progress</h1>
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 items-center">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-[#FF9100] text-[#FF9100]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Progress Overview
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tests'
                  ? 'border-[#FF9100] text-[#FF9100]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Test History
            </button>
            <button
              onClick={() => navigate(-1)}
              className="ml-4 flex items-center py-2 px-3 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-[#FF9100] hover:border-[#FF9100] transition-all"
              style={{ marginLeft: 'auto' }}
            >
              <ArrowLeft className="mr-1 w-4 h-4" />
              Go Back
            </button>
          </nav>
        </div>
      </div>

      {/* Progress Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {comprehensiveProgress.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No progress records found. Take some tests to see your progress here!
            </div>
          ) : (
            <div className="grid gap-6">
              {comprehensiveProgress.map((progress) => (
                <div key={progress.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[#00712D]">{progress.moduleName}</h3>
                      <p className="text-gray-600">Course ID: {progress.courseId}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(progress.status)}`}>
                        {progress.status}
                      </span>
                      {progress.score && (
                        <p className="text-lg font-bold text-[#FF9100] mt-2">
                          Score: {progress.score}%
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {progress.updatedAt && (
                    <p className="text-sm text-gray-500 mb-4">
                      Last updated: {formatDate(progress.updatedAt)}
                    </p>
                  )}

                  {/* Test Results for this module */}
                  {progress.testResults && progress.testResults.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Recent Test Results:</h4>
                      <div className="space-y-2">
                        {progress.testResults.slice(0, 3).map((result, index) => (
                          <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                            <span>{formatDate(result.startedAt)}</span>
                            <span>{result.score}/{result.totalQuestions} ({result.percentage?.toFixed(1)}%)</span>
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(result.status)}`}>
                              {result.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Test History Tab */}
      {activeTab === 'tests' && (
        <div>
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No test results found. Take some tests to see your results here!
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Integrity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {testResults.map((result) => (
                      <tr key={result.attemptId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(result.startedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="font-medium">{result.score}</span>
                          <span className="text-gray-500">/{result.totalQuestions}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`font-medium ${
                            result.percentage >= 70 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {result.percentage?.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                            {result.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Math.floor(result.durationSeconds / 60)}m {result.durationSeconds % 60}s
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            {result.tabSwitches > 0 && (
                              <span className="text-red-500" title="Tab switches">
                                ↹{result.tabSwitches}
                              </span>
                            )}
                            {result.focusLosses > 0 && (
                              <span className="text-red-500" title="Focus losses">
                                👁{result.focusLosses}
                              </span>
                            )}
                            {result.fullscreenExits > 0 && (
                              <span className="text-red-500" title="Fullscreen exits">
                                ⛶{result.fullscreenExits}
                              </span>
                            )}
                            {result.tabSwitches === 0 && result.focusLosses === 0 && result.fullscreenExits === 0 && (
                              <span className="text-green-500">✓ Clean</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsProgressPage;
