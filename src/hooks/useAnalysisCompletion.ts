import { useState, useEffect, useCallback } from 'react';

const ANALYSIS_SECTIONS = ['Bentuk Wajah', 'Bentuk Tubuh', 'Warna Kulit'];
const VIEWED_SECTIONS_STORAGE_KEY = 'viewedAnalysisSections';

export function useAnalysisCompletion(onCompletion: () => void) {
  const [viewedSections, setViewedSections] = useState<Set<string>>(() => {
    try {
      const storedSections = localStorage.getItem(VIEWED_SECTIONS_STORAGE_KEY);
      return storedSections ? new Set(JSON.parse(storedSections)) : new Set();
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return new Set();
    }
  });

  const markSectionAsViewed = useCallback((section: string) => {
    setViewedSections(prevSections => {
      const newSections = new Set(prevSections);
      newSections.add(section);
      try {
        localStorage.setItem(VIEWED_SECTIONS_STORAGE_KEY, JSON.stringify(Array.from(newSections)));
      } catch (error) {
        console.error('Error writing to localStorage', error);
      }
      return newSections;
    });
  }, []);

  useEffect(() => {
    if (ANALYSIS_SECTIONS.every(section => viewedSections.has(section))) {
      onCompletion();
    }
  }, [viewedSections, onCompletion]);

  return { markSectionAsViewed, viewedSections };
}