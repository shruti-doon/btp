import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchSymptomsByLevel,
  fetchChildrenSymptoms,
  fetchNextSymptomsOrDisease,
} from '../api/cropService';

const SymptomsPage = () => {
  const { cid } = useParams();
  const cropId = parseInt(cid, 10);
  const navigate = useNavigate();

  const [symptoms, setSymptoms] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [history, setHistory] = useState([]);       // confirmed symptoms so far
  const [popupSymptom, setPopupSymptom] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load level-1 symptoms on mount
  useEffect(() => {
    const loadInitialSymptoms = async () => {
      try {
        setLoading(true);
        const data = await fetchSymptomsByLevel(cropId, 1);
        setSymptoms(data);
        setCurrentLevel(1);
      } catch (err) {
        console.error("Error loading initial symptoms:", err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialSymptoms();
  }, [cropId]);

  // When user clicks YES on a symptom, open popup
  const handleYesClick = (sym) => {
    setPopupSymptom(sym);
  };

  const handlePopupBack = () => {
    setPopupSymptom(null);
  };
  const handlePopupConfirm = async () => {
    setLoading(true);
    try {
      // Add current symptom to history
      const updatedHistory = [...history, popupSymptom];
      setHistory(updatedHistory);
      
      // Get all symptom IDs for algo request
      const selectedSymptomIds = updatedHistory.map(s => s.sid);
      console.log("Selected Symptom IDs:", selectedSymptomIds);
      console.log("Current Level:", currentLevel);
      // If we're still in L1 or L2, try to get children symptoms first
      if (currentLevel < 3) {
        const nextLevel = currentLevel + 1;
        const childrenSymptoms = await fetchChildrenSymptoms(cropId, nextLevel, popupSymptom.sid);
      
        if (childrenSymptoms && childrenSymptoms.length > 0) {
          setSymptoms(childrenSymptoms);
          setCurrentLevel(nextLevel);
          setLoading(false);
          setPopupSymptom(null);
          return;
        }
      }
      
      
      // If no children or we're already at L3, use algo to check for disease or next symptoms
      const result = await fetchNextSymptomsOrDisease(cropId, selectedSymptomIds);
      
      if (result.diseaseFound) {
        // Disease was identified
        setDiagnosisResult(result);
        setSymptoms([]);
      } else if (result.symptoms && result.symptoms.length > 0) {
        // More symptoms to choose from
        setSymptoms(result.symptoms);
        // Keep current level since these are alternatives, not necessarily next level
      } else {
        // No disease found but also no more symptoms - handle edge case
        console.log("No disease found and no more symptoms available.");
        setSymptoms([]);
      }
    } catch (err) {
      console.error("Error during symptom confirmation:", err);
    } finally {
      setLoading(false);
      setPopupSymptom(null);
    }
  };

  const handleBack = () => navigate(-1);
  
  const handleReset = () => {
    // Reset to initial state
    setHistory([]);
    setDiagnosisResult(null);
    setPopupSymptom(null);
    setCurrentLevel(1);
    
    const loadInitialSymptoms = async () => {
      try {
        setLoading(true);
        const data = await fetchSymptomsByLevel(cropId, 1);
        setSymptoms(data);
      } catch (err) {
        console.error("Error reloading initial symptoms:", err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialSymptoms();
  };

  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      {/* Left panel */}
      <div className="w-full md:w-2/3">
        <div className="flex justify-between mb-3">
          <button onClick={handleBack} className="text-blue-600 hover:underline">
            &lt;&lt; Back
          </button>
          <button onClick={handleReset} className="text-red-600 hover:underline">
            Start Fresh
          </button>
        </div>

        <h2 className="text-xl font-bold mb-2">Paddy Crop Symptoms</h2>
        <p className="text-sm text-gray-600 mb-4">(click 'YES' corresponding to the symptom you observed in the crop)</p>

        {loading && (
          <div className="text-center p-4">
            <p>Loading...</p>
          </div>
        )}

        {diagnosisResult ? (
          <div className="bg-green-100 p-6 rounded shadow">
            <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Disease Identified!</h3>
            <p className="text-gray-800 mb-3">Disease: {diagnosisResult.disease?.name || 'Unknown'}</p>
            {diagnosisResult.disease?.description && (
              <p className="text-gray-700 mb-3">{diagnosisResult.disease.description}</p>
            )}
            <button 
              onClick={() => navigate(`/crops/${cropId}/disease/${diagnosisResult.disease?.id}/advice`)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Advice
            </button>
          </div>
        ) : !loading && (
          <div className="space-y-2">
            {symptoms.length > 0 ? (
              symptoms.map((sym, idx) => (
                <div
                  key={sym.sid}
                  className={`flex items-center justify-between p-3 rounded border ${
                    idx % 2 === 0 ? 'bg-gray-50' : 'bg-blue-50'
                  }`}
                >
                  <span className="font-medium">{idx + 1}. {sym.qn}</span>
                  <button
                    onClick={() => handleYesClick(sym)}
                    disabled={loading}
                    className="px-4 py-1 bg-green-600 text-white rounded font-semibold hover:bg-green-700 disabled:opacity-50"
                  >
                    YES
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center p-4 text-gray-500">No symptoms available. Please try again.</p>
            )}
          </div>
        )}
      </div>

      {/* Right panel */}
      <div className="w-full md:w-1/3 bg-gray-50 p-4 border rounded shadow-md h-fit sticky top-4">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Confirmed Symptoms</h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">+ None</p>
        ) : (
          <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
            {history.map(s => <li key={s.sid}>{s.qn}</li>)}
          </ul>
        )}
      </div>

      {/* Popup Overlay */}
      {popupSymptom && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={handlePopupBack}
          />
          <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 z-50 w-80 shadow-lg">
            <h4 className="text-lg font-medium mb-4 text-center">{popupSymptom.qn}</h4>
            <p className="text-center text-gray-600 mb-6">
              You said "<span className="font-semibold">YES</span>" to the above question
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handlePopupBack}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Back
              </button>
              <button
                onClick={handlePopupConfirm}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SymptomsPage;