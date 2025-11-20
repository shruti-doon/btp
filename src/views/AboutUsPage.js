import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const AboutUsPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          About Us
        </h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-blue-800 mb-3">Our Team</h2>
            <p className="text-gray-700">
              Crop Darpan is a collaborative effort between IIIT Hyderabad and Professor Jayashankar 
              Telangana State Agricultural University. Our team consists of agricultural experts, 
              computer scientists, and plant pathologists dedicated to helping farmers diagnose and 
              manage crop diseases effectively.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-800 mb-3">Our Mission</h2>
            <p className="text-gray-700">
              Our mission is to empower farmers with accessible, accurate, and timely information 
              about crop diseases and their management. We aim to reduce crop losses, increase 
              agricultural productivity, and promote sustainable farming practices through 
              technology-enabled solutions.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-800 mb-3">Research and Development</h2>
            <p className="text-gray-700">
              Crop Darpan is backed by extensive research in plant pathology, agricultural science, 
              and artificial intelligence. Our disease diagnosis algorithms are continuously improved 
              based on field data and expert knowledge. We work closely with agricultural extension 
              services to validate our recommendations and ensure they are practical for farmers.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-blue-800 mb-3">Contact Information</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Address:</strong> IIIT Hyderabad, Gachibowli, Hyderabad, Telangana 500032</p>
              <p><strong>Email:</strong> contact@cropdarpan.com</p>
              <p><strong>Phone:</strong> +91-40-6653-1000</p>
            </div>
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

export default AboutUsPage;