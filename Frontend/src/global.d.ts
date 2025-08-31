declare module '*.css';
declare module '*.module.css';
declare module '*.svg' {
  const content: string;
  export default content;
}
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
declare module 'react/jsx-runtime'; // fine for React 18
declare module 'react'; // fine for React 18
declare module 'react-dom'; // fine for React 18
declare module 'react-router-dom'; // fine for React Router DOM 6
declare module 'react-dom/client'; // fine for React DOM Client 18

