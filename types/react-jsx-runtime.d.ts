// Provide a module declaration for 'react/jsx-runtime' so TypeScript can resolve JSX runtime imports.
// Re-export everything from 'react' to preserve typings used by the automatic JSX runtime.
declare module 'react/jsx-runtime' {
  export * from 'react';
}
