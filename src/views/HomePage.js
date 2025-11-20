import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import cropdarpanLogo from '../assets/images/cropdarpan_logo.png';
import { fetchCrops } from '../api/cropService'; 

const crop = [[
  { cid: 1, name: 'Cotton', imageUrl: [] },
  { cid: 2, name: 'Paddy', imageUrl: [] }
]];

const HomePage = () => {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('Paddy');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch crops when component mounts
    const loadCrops = async () => {
      try {
        const cropList = await fetchCrops();
        setCrops(cropList);
        if (cropList.length > 0) {
          setSelectedCrop(cropList[0].name); // Set first crop as default
        }
      } catch (err) {
        console.error('Error fetching crops:', err);
      }
    };

    loadCrops();
  }, []);

  const handleFindDisease = () => {
    const selected = crops.find(c => c.name === selectedCrop);
    if (selected) {
      // Default to level 1 when starting the flow
      navigate(`/crops/${selected.cid}/symptom/level/1`);
    } else {
      alert("Selected crop not found!");
    }
  };

  // const handleFindDisease = () => {
  //   navigate('/symptoms', { state: { crop: selectedCrop, language: selectedLanguage } });
  // };


  const handleFindAdvice = () => {
    const selected = crops.find(c => c.name === selectedCrop);
    if (selected) {
      navigate(`/crops/${selected.cid}/disease`);
    } else {
      alert("Selected crop not found!");
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content - Centered Column */}
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col items-center">
          {/* Logo */}
          <div className="w-40 mb-4">
            <img src={cropdarpanLogo} alt="Crop Darpan Logo" className="w-full" />
          </div>
          
          {/* Title and Description */}
          <h1 className="text-xl font-bold text-blue-800 mb-1">A Crop Diagnostic Tool</h1>
          <div className="text-center mb-8 text-blue-600 text-sm">
            <p>IIIT Hyderabad and Professor</p>
            <p>Jayashankar Telangana State</p>
            <p>Agricultural University</p>
          </div>

          {/* Form Container */}
          <div className="w-full max-w-md border rounded-lg bg-gray-50 p-6">
            {/* Selectors */}
            <div className="mb-6">
              <div className="flex mb-4">
                <label className="w-1/3 text-right pr-4 py-2 font-medium">Crop</label>
                <div className="w-2/3">
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="Paddy">Paddy</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Chilli">Chilli</option>
                  </select>
                </div>
              </div>
              
              <div className="flex mb-6">
                <label className="w-1/3 text-right pr-4 py-2 font-medium">Language</label>
                <div className="w-2/3">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Telugu">Telugu</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Disease Tools */}
            <div className="border-t pt-4">
              <p className="text-green-500 text-center mb-2">If you do not know the disease name,</p>
              <button
                onClick={handleFindDisease}
                className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded text-center mb-6"
              >
                Click here to find the disease name
              </button>

              <p className="text-blue-500 text-center mb-2">If you know the disease name,</p>
              <button
                onClick={handleFindAdvice}
                className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded text-center mb-6"
              >
                Click here to find advice
              </button>
            </div>

            {/* About Buttons */}
            <div className="flex justify-between gap-4 pt-4 border-t">
              <button
                onClick={() => navigate('/about')}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded flex-1 text-center"
              >
                About CropDarpan
              </button>
              <button
                onClick={() => navigate('/about-us')}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded flex-1 text-center"
              >
                About us
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-gray-600 mt-6">
            Number of times website visited: 19366
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;