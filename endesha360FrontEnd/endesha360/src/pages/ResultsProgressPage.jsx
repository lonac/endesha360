import React, { useEffect, useState } from 'react';
import { fetchStudentProgress } from '../api/studentProgress';
import { useAuth } from '../context/AuthContext';

const ResultsProgressPage = () => {
  const { user, token } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchStudentProgress(user.id, token)
      .then(setProgress)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, token]);

  if (!user) return <div>Please log in to view your progress.</div>;
  if (loading) return <div>Loading progress...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Results & Progress</h2>
      {progress.length === 0 ? (
        <div>No progress records found.</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Module</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Score</th>
            </tr>
          </thead>
          <tbody>
            {progress.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border-b">{item.moduleName}</td>
                <td className="py-2 px-4 border-b">{item.status}</td>
                <td className="py-2 px-4 border-b">{item.score ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResultsProgressPage;
