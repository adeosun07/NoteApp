// src/global.d.ts

// CSS Modules
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// SVG imports
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
