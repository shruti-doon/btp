import React, { useState } from 'react';
// import { PlusIcon } from 'lucide-react';

const CropDarpanUI = () => {
  const [activeSidebar, setActiveSidebar] = useState('Add Crop');

  // For "Add Crop" form fields
  const [cropName, setCropName] = useState('');
  const [cropDescription, setCropDescription] = useState('');
  const [l1SymptomName, setL1SymptomName] = useState('');
  const [l1SymptomDescription, setL1SymptomDescription] = useState('');
  const [question, setQuestion] = useState('');
  const [cropImage, setCropImage] = useState(null);

  // Sidebar items
  const sidebarItems = [
    { group: 'Crop', items: ['View Crop', 'Add Crop', 'Edit Crop', 'Delete Crop'] },
    { group: 'Problem', items: ['View Problem', 'Add Problem', 'Edit Problem', 'Delete Problem'] },
    { group: 'Hierarchy', items: ['View Hierarchy', 'Enter/Update Hierarchy', 'Delete Hierarchy'] }
  ];

  // -----------------------------------------
  // RENDER FOR "VIEW CROP"
  // -----------------------------------------
  const renderViewCrop = () => {
    // Example: Hard-coded or fetched data
    const existingCrops = [
      {
        name: 'Cotton',
        description: 'Cotton is a soft, fluffy staple fiber ...',
        // Add more fields if needed
      },
      {
        name: 'Wheat',
        description: 'Wheat is a grass widely cultivated ...',
      },
      // ...and so on
    ];

    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">View Crop</h2>

        {/* Example: Listing all crops */}
        <div className="space-y-4">
          {existingCrops.map((crop, idx) => (
            <div key={idx} className="border rounded p-4">
              <div className="font-bold mb-2">{crop.name}</div>
              <div className="text-gray-700">{crop.description}</div>
              {/* If you want more details, you can show them here */}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // -----------------------------------------
  // RENDER FOR "ADD CROP"
  // -----------------------------------------
  const renderAddCrop = () => {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Add Crop</h2>
        
        {/* Crop Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Crop Name In English</label>
          <input 
            type="text" 
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-blue-500" 
            placeholder="CropName_Eng"
          />
        </div>

        {/* Crop Description */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Crop Description</label>
          <textarea 
            value={cropDescription}
            onChange={(e) => setCropDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-blue-500 h-24" 
            placeholder="CropDescription"
          />
        </div>

        {/* Crop Image */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Crop Image</label>
          <div className="border rounded-md py-2 px-3 text-gray-500">
            Choose File {cropImage ? `(${cropImage.name})` : 'No file chosen'}
            <input 
              type="file" 
              className="hidden"
              onChange={(e) => setCropImage(e.target.files[0])}
            />
          </div>
        </div>

        {/* Add L1 Symptoms Section */}
        <h3 className="text-xl font-semibold my-6">Add L1 Symptoms</h3>
        
        {/* L1 Symptom Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">L1 Symptom Name In English</label>
          <input 
            type="text" 
            value={l1SymptomName}
            onChange={(e) => setL1SymptomName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-blue-500" 
            placeholder="L1 Symptom Name In English"
          />
        </div>

        {/* L1 Symptom Description */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">L1 Symptom Description</label>
          <textarea 
            value={l1SymptomDescription}
            onChange={(e) => setL1SymptomDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-blue-500 h-24" 
            placeholder="L1 Symptom Description"
          />
        </div>

        {/* Question */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Question In English</label>
          <input 
            type="text" 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-blue-500" 
            placeholder="Question in English"
          />
        </div>

        {/* Existing Crops (Optional display) */}
        <div className="border-t pt-4 mt-6">
          <h3 className="text-xl font-semibold mb-4">Existing Crops</h3>
          <div className="bg-gray-100 p-2 rounded">Cotton</div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <button 
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>
      </div>
    );
  };

  // -----------------------------------------
  // MAIN RETURN
  // -----------------------------------------
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4 text-xl font-bold border-b">Crop Darpan</div>
        {sidebarItems.map((section, index) => (
          <div key={index} className="mb-4">
            <div className="px-4 py-2 text-gray-500 uppercase text-xs">{section.group}</div>
            {section.items.map((item) => (
              <div 
                key={item}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 
                  ${activeSidebar === item ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
                onClick={() => setActiveSidebar(item)}
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Conditionally render based on activeSidebar */}
        {activeSidebar === 'View Crop' && renderViewCrop()}
        {activeSidebar === 'Add Crop' && renderAddCrop()}

        {activeSidebar === 'Edit Crop' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold">Edit Crop</h2>
            {/* Implement your "Edit Crop" form here */}
          </div>
        )}

        {activeSidebar === 'Delete Crop' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold">Delete Crop</h2>
            {/* Implement your "Delete Crop" functionality here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropDarpanUI;
