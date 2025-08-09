"use client";

import { AnalysisProvider } from '@/context/AnalysisContext';
import React from 'react';

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnalysisProvider>
      {children}
    </AnalysisProvider>
  );
}