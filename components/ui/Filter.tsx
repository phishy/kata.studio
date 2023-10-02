'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

export default function Filter() {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDifficulties, setSelectedDifficulties] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.getAll('difficulty');
  });

  const handleFilterClick = (difficulty) => {
    let updatedDifficulties;
    if (selectedDifficulties.includes(difficulty)) {
      updatedDifficulties = selectedDifficulties.filter(d => d !== difficulty);
    } else {
      updatedDifficulties = [...selectedDifficulties, difficulty];
    }
    setSelectedDifficulties(updatedDifficulties);
    const params = new URLSearchParams();
    updatedDifficulties.forEach(diff => params.append('difficulty', diff));
    router.push(`/cards?${params.toString()}`);
  };

  const handleFilterOpen = () => {
    setIsOpen(!isOpen);
  }

  const handleClearFilter = () => {
    setSelectedDifficulties([]);
    router.push('/cards');
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button className="flex-none rounded-md bg-purple-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500" onClick={handleFilterOpen}>
        Filters
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-900 hover:bg-gray-900">
          {['easy', 'medium', 'hard'].map((difficulty) => (
            <label
              key={difficulty}
              for="difficulty"
              onClick={() => handleFilterClick(difficulty)}
              className={`cursor-pointer px-8 py-2 flex hover:bg-black`}
            >
              <input 
                className="flex mr-2" 
                type="checkbox" 
                checked={selectedDifficulties.includes(difficulty)}
                onChange={() => {}}
              />
              {difficulty}
            </label>
          ))}
          <div 
            onClick={handleClearFilter}
            className={`cursor-pointer px-8 py-2 hover:bg-gray-900 border-t border-gray-700`}
          >
            clear filters
          </div>
        </div>
      )}
    </div>
  );
}
