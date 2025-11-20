// // src/models/CropModel.js
// import * as cropService from '../api/cropService';

// class CropModel {
//   constructor() {
//     this.crops = [];
//     this.diseases = {};
//     this.languages = [];
//   }

//   async initialize() {
//     try {
//       // Load initial data
//       this.crops = await cropService.fetchCrops();
//       this.languages = await cropService.fetchLanguages();
//     } catch (error) {
//       console.error('Failed to initialize CropModel:', error);
//       throw error;
//     }
//   }

//   async getAllCrops() {
//     if (this.crops.length === 0) {
//       this.crops = await cropService.fetchCrops();
//     }
//     return this.crops;
//   }

//   async getAllLanguages() {
//     if (this.languages.length === 0) {
//       this.languages = await cropService.fetchLanguages();
//     }
//     return this.languages;
//   }

//   async getDiseasesByCrop(cropName) {
//     if (!this.diseases[cropName]) {
//       this.diseases[cropName] = await cropService.fetchDiseases(cropName);
//     }
//     return this.diseases[cropName];
//   }

//   async getDiseaseById(cropName, diseaseId) {
//     const diseases = await this.getDiseasesByCrop(cropName);
//     return diseases.find(disease => disease.id === diseaseId);
//   }
// }

// export default new CropModel();