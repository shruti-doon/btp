// // src/hooks/useCropData.js
// import { useState, useEffect } from 'react';
// import { fetchCrops, fetchLanguages, fetchDiseases } from '../api/cropService';

// export const useCropData = (initialCrop = 'Paddy') => {
//   const [crops, setCrops] = useState([]);
//   const [languages, setLanguages] = useState([]);
//   const [diseases, setDiseases] = useState([]);
//   const [selectedCrop, setSelectedCrop] = useState(initialCrop);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch crops and languages on initial load
//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         setLoading(true);
//         const [cropsData, languagesData] = await Promise.all([
//           fetchCrops(),
//           fetchLanguages()
//         ]);
        
//         setCrops(cropsData);
//         setLanguages(languagesData);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     loadInitialData();
//   }, []);

//   // Fetch diseases when selected crop changes
//   useEffect(() => {
//     const loadDiseases = async () => {
//       if (!selectedCrop) return;
      
//       try {
//         setLoading(true);
//         const diseasesData = await fetchDiseases(selectedCrop);
//         setDiseases(diseasesData);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     loadDiseases();
//   }, [selectedCrop]);

//   return {
//     crops,
//     languages,
//     diseases,
//     selectedCrop,
//     setSelectedCrop,
//     loading,
//     error
//   };
// };

// export default useCropData;