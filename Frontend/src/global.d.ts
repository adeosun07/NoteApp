declare module '*.css';
declare module '*.module.css';
declare module '*.svg' {
  const content: string;
  export default content;
}
/// <reference types="react" />
/// <reference types="react-dom" />
declare module 'react/jsx-runtime';
declare module 'react-dom/client';
