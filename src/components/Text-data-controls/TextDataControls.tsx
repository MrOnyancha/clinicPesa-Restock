import React, { useRef, useState } from 'react';
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronUp,
  LuChevronsLeft,
  LuChevronsRight,
} from 'react-icons/lu';
import { MdOutlineResetTv } from 'react-icons/md';
import { RiSkipDownLine, RiSkipUpLine } from 'react-icons/ri';

interface TextDataControlsProps {
  textData: string[];
  defaultText:string;
}

const TextDataControls: React.FC<TextDataControlsProps> = ({ textData, defaultText }) => {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectedTextData, setSelectedTextData] = useState<string[] >([defaultText]);
  const [remainingTextData, setRemainingTextData] = useState<string[]>(textData);

  const selectedTextRef = useRef<HTMLUListElement>(null);

  const selectText = (text: string) => {
    setSelectedText(text === selectedText ? null : text);
  };

  const moveAllTextData = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setSelectedTextData([]);
      setRemainingTextData([...remainingTextData, ...selectedTextData]);
    } else {
      setSelectedTextData([...remainingTextData, ...selectedTextData]);
      setRemainingTextData([]);
    }
  };

  const moveSingleText = (direction: 'left' | 'right') => {
    if (selectedText === null) return;

    if (direction === 'left') {
      if (!remainingTextData.includes(selectedText)) {
        setRemainingTextData([...remainingTextData, selectedText]);
      }
      setSelectedTextData(selectedTextData.filter((name) => name !== selectedText));
    } else {
      if (!selectedTextData.includes(selectedText)) {
        setSelectedTextData([...selectedTextData, selectedText]);
      }
      setRemainingTextData(remainingTextData.filter((name) => name !== selectedText));
    }
    setSelectedText(null);
  };

  const restTextData = () => {
    setSelectedTextData([defaultText]);
    setRemainingTextData(textData);
  };

  const scrollTo = (position: number) => {
    if (selectedTextRef.current) {
      selectedTextRef.current.scrollTo({
        top: position,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTop = () => {
    scrollTo(0);
  };

  const scrollToBottom = () => {
    if (selectedTextRef.current) {
      scrollTo(selectedTextRef.current.scrollHeight);
    }
  };

  const scrollOneItem = (direction: 'up' | 'down') => {
    if (selectedTextRef.current) {
      const increment =
        direction === 'up' ? -selectedTextRef.current.clientHeight : selectedTextRef.current.clientHeight;
      scrollTo(selectedTextRef.current.scrollTop + increment);
    }
  };

  return (
    <div className="w-full flex items-center justify-between">
      <ul className="border rounded h-[140px] w-[200px] overflow-scroll bg-slate-100">
        {remainingTextData.map((text, idx) => (
          <li
            className={`text-xs my-1 pl-2 py-1 transition-all duration-300 cursor-pointer hover:bg-slate-300 ${selectedText === text ? 'bg-slate-300' : ''}`}
            key={idx}
            onClick={() => selectText(text)}
          >
            {text}
          </li>
        ))}
      </ul>
      <div className="flex flex-col justify-between items-center h-[140px] w-7 ">
        <span
          className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
          onClick={restTextData}
        >
          <MdOutlineResetTv />
        </span>
        <span
          className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
          onClick={() => moveAllTextData('right')}
        >
          <LuChevronsRight />
        </span>
        <span
          className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
          onClick={() => moveSingleText('right')}
        >
          <LuChevronRight />
        </span>
        <span
          className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
          onClick={() => moveSingleText('left')}
        >
          <LuChevronLeft />
        </span>
        <span
          className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
          onClick={() => moveAllTextData('left')}
        >
          <LuChevronsLeft />
        </span>
      </div>
      <ul className="border rounded h-[140px] w-[200px] overflow-scroll bg-slate-100" ref={selectedTextRef}>
        {selectedTextData.map((text, idx) => (
          <li
            className={`text-xs my-1 pl-2 py-1 transition-all duration-300 cursor-pointer hover:bg-slate-300`}
            key={idx}
            onClick={() => selectText(text)}
          >
            {text}
          </li>
        ))}
      </ul>
      <div className="flex flex-col justify-between items-center h-[140px] w-7 ">
        <span
          className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
          onClick={scrollToTop}
        >
          <RiSkipUpLine />
        </span>
        <span
          className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
          onClick={() => scrollOneItem('up')}
        >
          <LuChevronUp />
        </span>
        <span
          className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
          onClick={() => scrollOneItem('down')}
        >
          <LuChevronDown />
        </span>
        <span
          className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
          onClick={scrollToBottom}
        >
          <RiSkipDownLine />
        </span>
      </div>
    </div>
  );
};

export default TextDataControls;

// import React, { useRef, useState } from 'react';
// import {
//   LuChevronDown,
//   LuChevronLeft,
//   LuChevronRight,
//   LuChevronUp,
//   LuChevronsLeft,
//   LuChevronsRight,
// } from 'react-icons/lu';
// import { MdOutlineResetTv } from 'react-icons/md';
// import { RiSkipDownLine, RiSkipUpLine } from 'react-icons/ri';

// interface TextDataControlsProps {
//   textData: string[];
// }

// const TextDataControls: React.FC<TextDataControlsProps> = ({ textData }) => {
//   const [selectedText, setSelectedText] = useState<string | null>('');
//   const [selectedTextData, setSelectedTextData] = useState<string[]>(['Businge']);
//   const [remainingTextData, setRemainingTextData] = useState<string[]>(textData);

//   const selectedTextRef = useRef<HTMLUListElement>(null);

//   const selectText = (text: string) => {
//     setSelectedText(text === selectedText ? null : text);
//   };

//   const moveAllTextData = (direction: 'left' | 'right') => {
//     if (direction === 'left') {
//       setSelectedTextData([]);
//       setRemainingTextData([...remainingTextData, ...selectedTextData]);
//     } else {
//       setSelectedTextData([...remainingTextData, ...selectedTextData]);
//       setRemainingTextData([]);
//     }
//   };

//   const moveSingleText = (direction: 'left' | 'right') => {
//     if (selectedText === null) return;

//     if (direction === 'left') {
//       if (!remainingTextData.includes(selectedText)) {
//         setRemainingTextData([...remainingTextData, selectedText]);
//       }
//       setSelectedTextData(selectedTextData.filter((name) => name !== selectedText));
//     } else {
//       if (!selectedTextData.includes(selectedText)) {
//         setSelectedTextData([...selectedTextData, selectedText]);
//       }
//       setRemainingTextData(remainingTextData.filter((name) => name !== selectedText));
//     }
//     setSelectedText(null);
//   };

//   const restTextData = () => {
//     setSelectedTextData(['Businge']);
//     setRemainingTextData(textData);
//   };
//   const scrollToTop = () => {
//     if (selectedTextRef.current) {
//       selectedTextRef.current.scrollTo({
//         top: 0,
//         behavior: 'smooth',
//       });
//     }
//   };

//   const scrollToBottom = () => {
//     if (selectedTextRef.current) {
//       selectedTextRef.current.scrollTo({
//         top: selectedTextRef.current.scrollHeight,
//         behavior: 'smooth',
//       });
//     }
//   };

//   const scrollUpOneItem = () => {
//     if (selectedTextRef.current) {
//       selectedTextRef.current.scrollTo({
//         top: selectedTextRef.current.scrollTop - selectedTextRef.current.clientHeight,
//         behavior: 'smooth',
//       });
//     }
//   };

//   const scrollDownOneItem = () => {
//     if (selectedTextRef.current) {
//       selectedTextRef.current.scrollTo({
//         top: selectedTextRef.current.scrollTop + selectedTextRef.current.clientHeight,
//         behavior: 'smooth',
//       });
//     }
//   };

//   return (
//     <div className="w-full flex items-center justify-between">
//       <ul className="border rounded h-[140px] w-[200px] overflow-scroll bg-slate-100">
//         {remainingTextData.map((text, idx) => (
//           <li
//             className={`text-xs my-1 pl-2 py-1 transition-all duration-300 cursor-pointer hover:bg-slate-300 ${selectedText === text ? 'bg-slate-300' : ''}`}
//             key={idx}
//             onClick={() => selectText(text)}
//           >
//             {text}
//           </li>
//         ))}
//       </ul>
//       <div className="flex flex-col justify-between items-center h-[140px] w-7 ">
//         <span
//           className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
//           onClick={restTextData}
//         >
//           <MdOutlineResetTv />
//         </span>
//         <span
//           className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
//           onClick={() => moveAllTextData('right')}
//         >
//           <LuChevronsRight />
//         </span>
//         <span
//           className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
//           onClick={() => moveSingleText('right')}
//         >
//           <LuChevronRight />
//         </span>
//         <span
//           className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
//           onClick={() => moveSingleText('left')}
//         >
//           <LuChevronLeft />
//         </span>
//         <span
//           className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
//           onClick={() => moveAllTextData('left')}
//         >
//           <LuChevronsLeft />
//         </span>
//       </div>
//       <ul className="border rounded h-[140px] w-[200px] overflow-scroll bg-slate-100" ref={selectedTextRef}>
//         {selectedTextData.map((text, idx) => (
//           <li
//             className={`text-xs my-1 pl-2 py-1 transition-all duration-300 cursor-pointer hover:bg-slate-300`}
//             key={idx}
//             onClick={() => selectText(text)}
//           >
//             {text}
//           </li>
//         ))}
//       </ul>
//       <div className="flex flex-col justify-between items-center h-[140px] w-7 ">
//         <span
//           className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
//           onClick={scrollToTop}
//         >
//           <RiSkipUpLine />
//         </span>
//         <span
//           className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
//           onClick={scrollUpOneItem}
//         >
//           <LuChevronUp />
//         </span>
//         <span
//           className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
//           onClick={scrollDownOneItem}
//         >
//           <LuChevronDown />
//         </span>
//         <span
//           className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
//           onClick={scrollToBottom}
//         >
//           <RiSkipDownLine />
//         </span>
//       </div>
//     </div>
//   );
// };

// export default TextDataControls;
