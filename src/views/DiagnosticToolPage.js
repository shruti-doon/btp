import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDiseases } from '../api/cropService';

const DiagnosticToolPage = () => {
  const { cid } = useParams(); // Extract crop ID from the route
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  // const [loading, setLoading] = useState(true); // eslint-disable-line no-unused-vars

  useEffect(() => {
    const loadDiseases = async () => {
      try {
        const data = await fetchDiseases(cid);
        setIssues(data);
      } catch (error) {
        console.error('Failed to fetch diseases:', error);
      }
    };

    if (cid) loadDiseases();
  }, [cid]);

  const handleCheckAdvice = (issue) => {
    navigate(`/advice/${encodeURIComponent(issue.disId)}`);
  };

  // if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <button onClick={() => navigate(-1)} className="text-blue-600 font-medium">&lt;&lt; Back</button>
        {/* Add filter tabs if needed */}
      </div>
      {issues.length === 0 ? (
        <p className="text-gray-600">No diseases found for this crop.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-lg overflow-hidden flex flex-row"
            >
              {/* Image on the left */}
              <div className="w-1/3 h-full">
                <img
                  src={issue.imageUrl[0]}
                  alt="Disease"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content on the right */}
              <div className="w-2/3 p-4 flex flex-col items-center text-center mt-6">
                <h2 className="text-lg mb-6">
                  {issue.chemical_name || issue.scientific_name}
                </h2>
                <button
                  onClick={() => handleCheckAdvice(issue)}
                  className="bg-leafGreen text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
                >
                  Check Advice
                </button>
              </div>
            </div>

            // <div
            //   key={idx}
            //   className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
            // >
            //   <div className="relative">
            //     <img src={issue.imageUrl} className="w-full h-40 object-cover" muted />
            //     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            //       {/* <svg
            //       xmlns="http://www.w3.org/2000/svg"
            //       className="h-10 w-10 text-white"
            //       fill="none"
            //       viewBox="0 0 24 24"
            //       stroke="currentColor"
            //     >
            //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-6.518-3.746A1 1 0 007 8.255v7.49a1 1 0 001.234.97l6.518-1.746a1 1 0 000-1.97z" />
            //     </svg> */}
            //     </div>
            //   </div>

            //   <div className="p-4 flex flex-col justify-between flex-1">
            //     <h2 className="text-md font-semibold mb-2">{issue.chemical_name}</h2>
            //     <button
            //       onClick={() => handleCheckAdvice(issue)}
            //       className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-auto"
            //     >
            //       Check Advice
            //     </button>
            //   </div>
            // </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiagnosticToolPage;
