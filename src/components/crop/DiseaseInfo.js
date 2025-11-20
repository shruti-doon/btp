import React from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';

const DiseaseInfo = ({ disease, crop, onGetAdvice }) => {
  if (!disease) {
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{disease.name}</h2>
      
      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Symptoms</h3>
        <p className="text-gray-600">{disease.symptoms}</p>
      </div>
      
      {disease.cause && (
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Cause</h3>
          <p className="text-gray-600">{disease.cause}</p>
        </div>
      )}
      
      {disease.environments && (
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Favorable Conditions
          </h3>
          <p className="text-gray-600">{disease.environments}</p>
        </div>
      )}
      
      <div className="flex justify-end mt-4">
        <Button
          onClick={() => onGetAdvice(disease, crop)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Get Management Advice
        </Button>
      </div>
    </div>
  );
};

DiseaseInfo.propTypes = {
  disease: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    symptoms: PropTypes.string.isRequired,
    cause: PropTypes.string,
    environments: PropTypes.string,
  }),
  crop: PropTypes.string.isRequired,
  onGetAdvice: PropTypes.func.isRequired,
};

export default DiseaseInfo;