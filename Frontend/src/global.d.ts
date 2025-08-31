/// <reference types="react" />
/// <reference types="react-dom" />

// CSS Modules
declare module '*.css';
declare module '*.module.css';

// SVG imports
declare module '*.svg' {
  const content: string;
  export default content;
}

// React JSX Runtime
declare module 'react/jsx-runtime' {
  export * from 'react/jsx-runtime';
}

// ReactDOM client
declare module 'react-dom/client' {
  export * from 'react-dom/client';
}

// Basic React types for Render compatibility
import * as React from 'react';
export type { FC, ReactNode, ChangeEvent } from 'react';

interface ImportMeta {
  readonly env: {
    [key: string]: string | undefined;
  };
}