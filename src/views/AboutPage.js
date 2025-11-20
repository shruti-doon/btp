import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const AboutPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          About Crop Darpan
        </h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-blue-800 mb-3">What is Crop Darpan?</h2>
            <p className="text-gray-700">
              Crop Darpan is a digital diagnostic tool designed to help farmers and agricultural 
              practitioners identify and manage crop diseases effectively. The name "Darpan" means 
              "mirror" in Hindi, symbolizing our aim to reflect accurate information about crop 
              health issues.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-800 mb-3">How It Works</h2>
            <p className="text-gray-700">
              Crop Darpan uses a knowledge-based approach to disease diagnosis. Users can either:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
              <li>Search for disease management advice if they already know the disease name</li>
              <li>Describe symptoms to identify potential diseases affecting their crops</li>
            </ul>
            <p className="mt-2 text-gray-700">
              Our system contains extensive information about common diseases affecting major crops 
              in India, along with their symptoms, causative agents, favorable conditions, and 
              management practices.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-800 mb-3">Development History</h2>
            <p className="text-gray-700">
              Crop Darpan was developed through a collaborative project between IIIT Hyderabad and 
              Professor Jayashankar Telangana State Agricultural University. The project began in 
              2018 with the goal of leveraging technology to address challenges in crop disease 
              management, especially for smallholder farmers.
            </p>
            <p className="mt-2 text-gray-700">
              The database behind Crop Darpan has been vetted by agricultural scientists and experts 
              in plant pathology to ensure accuracy and relevance of the information provided.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-800 mb-3">Future Developments</h2>
            <p className="text-gray-700">
              We are continuously working to improve Crop Darpan by:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
              <li>Adding more crops and diseases to our database</li>
              <li>Implementing image-based disease recognition</li>
              <li>Developing mobile applications for offline use</li>
              <li>Incorporating localized weather data for disease forecasting</li>
            </ul>
          </section>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;