// // src\hooks\useSymptomFlow.js
// import { useState, useEffect } from 'react';
// import { fetchSymptomChildren, fetchSymptomDetail, fetchSymptomLevels } from '../api/cropService';
// import { useAuth } from '../context/AuthContext';

// /**
//  * Hook to manage multi-level symptom Q&A flow
//  * @param {number|string} cid Crop ID
//  */
// export default function useSymptomFlow(cid) {
//   const { token } = useAuth();
//   const [level, setLevel] = useState(1);
//   const [symptoms, setSymptoms] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [finished, setFinished] = useState(false);

//   useEffect(() => {
//     // Load initial level-1 symptoms
//     fetchSymptomLevels(cid, 1, token)
//       .then(data => setSymptoms(data))
//       .catch(err => console.error(err));
//   }, [cid, token]);

//   /**
//    * Handle an answer and progress the flow
//    * @param {number} sid Symptom ID
//    * @param {boolean} yes True if answered Yes
//    */
//   function answer(sid, yes) {
//     setHistory(prev => [...prev, { level, sid, yes }]);

//     if (!yes) {
//       // Filter out 'no' responses
//       setSymptoms(curr => curr.filter(s => s.sid !== sid));
//       return;
//     }

//     // On 'yes', fetch children of this symptom
//     fetchSymptomChildren(cid, level, sid, token)
//       .then(children => {
//         if (!children || children.length === 0) {
//           setFinished(true);
//         } else {
//           setLevel(prevLevel => prevLevel + 1);
//           setSymptoms(children);
//         }
//       })
//       .catch(err => console.error(err));
//   }

//   return { level, symptoms, history, finished, answer };
// }
