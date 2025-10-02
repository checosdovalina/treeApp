declare module 'html-pdf-node' {
  export interface Options {
    format?: string;
    printBackground?: boolean;
    margin?: {
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    };
  }

  export interface File {
    content: string;
    url?: string;
  }

  export function generatePdf(file: File, options?: Options): Promise<Buffer>;
  
  export default {
    generatePdf
  };
}
