// Provide a minimal global JSX declaration so TypeScript recognizes JSX intrinsic elements.
// This avoids: "JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists." errors.
declare namespace JSX {
  interface IntrinsicElements {
    [key: string]: any;
  }
}
