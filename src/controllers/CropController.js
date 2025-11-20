// // src/controllers/CropController.js
// import CropModel from '../models/CropModel';
// import * as cropService from '../api/cropService';

// class CropController {
//   getCrops() {
//     return CropModel.getAllCrops();
//   }
  
//   getLanguages() {
//     return CropModel.getAllLanguages();
//   }
  
//   getDiseases(cropName) {
//     return CropModel.getDiseasesByCrop(cropName);
//   }
  
//   getDiseaseDetails(cropName, diseaseId) {
//     return CropModel.getDiseaseById(cropName, diseaseId);
//   }
  
//   // Methods to handle user inputs and return appropriate data
//   getDiseaseDiagnosis(cropName, symptoms) {
//     const diseases = CropModel.getDiseasesByCrop(cropName);
    
//     // Simple matching algorithm (in a real app, this would be more sophisticated)
//     return diseases.filter(disease => 
//       disease.symptoms.toLowerCase().includes(symptoms.toLowerCase())
//     );
//   }

//   async getSymptomQuestions(cropName) {
//     return await cropService.fetchSymptomQuestions(cropName);
//   }

//   async submitSymptoms(cropName, symptoms) {
//     return await cropService.submitSymptoms(cropName, symptoms);
//   }
// }

// export default new CropController();