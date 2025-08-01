// import React, { useState } from 'react';

// interface RadioInputGroupProps {
//   labels: string[];
// }

// const RadioInputGroup: React.FC<RadioInputGroupProps> = ({ labels }) => {
//   const [checkedIndex, setCheckedIndex] = useState<number | null>(null);

//   const toggleRadioInput = (idx: number) => {
//     if (checkedIndex === idx) {
//       // Uncheck the radio input if it's already checked
//       setCheckedIndex(null);
//     } else {
//       // Otherwise, check the radio input
//       setCheckedIndex(idx);
//     }
//   };

//   return (
//     <div>
//       {labels.map((label, idx) => (
//         <div key={idx} className="flex items-center space-x-2 py-1">
//           <input
//             type="radio"
//             checked={checkedIndex === idx}
//             onChange={() => toggleRadioInput(idx)}
//             value={label}
//             id={`radio-${idx}`}
//             className="form-radio focus:ring-offset-0 focus:ring-0"
//           />
//           <label htmlFor={`radio-${idx}`} className="text-xs">
//             {label}
//           </label>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default RadioInputGroup;
