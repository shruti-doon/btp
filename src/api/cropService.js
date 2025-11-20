// src/api/cropService.js
// import axios from 'axios';
import CropController from '../controllers/CropController';
// import { mockDiseases } from './mockData';
import axios from './axiosInstance';
// This service would normally make API calls to a backend
// But for this example, we'll use the controller directly

export async function fetchCrops() {
  const response = await axios.get('/crops');
  return response.data;
}

export const fetchLanguages = async () => {
  try {
    return await new Promise(resolve => {
      setTimeout(() => {
        resolve(CropController.getLanguages());
      }, 300);
    });
  } catch (error) {
    console.error('Error fetching languages:', error);
    throw error;
  }
};

export async function fetchDiseases(cropId) {
  // const response = await axios.get(`/crops/${cropId}/diseases`, {
  //   headers: {
  //     'auth-token': 'your-auth-token',   // Optional, if you have the token
  //     'accept-language': 'en_IN'         // Optional, to specify language
  //   }  
  // });
  const response = await axios.get(`/crops/${cropId}/disease`);
  return response.data;
}

export const getDiagnosis = async (cropName, symptoms) => {
  try {
    // Simulate API call
    return await new Promise(resolve => {
      setTimeout(() => {
        resolve(CropController.getDiseaseDiagnosis(cropName, symptoms));
      }, 800);
    });
  } catch (error) {
    console.error('Error getting diagnosis:', error);
    throw error;
  }
};

export async function fetchSymptomsByLevel(cid, level) {
  const response = await axios.get(`/crops/${cid}/symptom/level/${level}`);
  return response.data;

}

export async function fetchChildrenSymptoms(cid, level, sid) {
  const response = await axios.get(`/crops/${cid}/symptom/${level}/children/${sid}`);
  console.log(response.data);
  return response.data;
}

export async function fetchNextSymptomsOrDisease(cid, selectedSymptoms) {
  const response = await axios.get('http://10.4.21.99:3000/algo', {
    params: {
      cid: 1,
      'sel[]': JSON.stringify([102]), // make sure it's a string
    },
    headers: {
      'auth-token': 'your-auth-token', // if needed
      'accept-language': 'en_IN'
    }
  });
  
  return response.data;
}