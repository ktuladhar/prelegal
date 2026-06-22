import { Font } from '@react-pdf/renderer';

export const PDF_SERIF_FAMILY = 'Source Serif 4';

let registered = false;

export function registerPdfFonts() {
  if (registered) return;
  registered = true;

  Font.register({
    family: PDF_SERIF_FAMILY,
    fonts: [
      {
        src: '/fonts/source-serif-4/source-serif-4-latin-400-normal.woff2',
        fontWeight: 400,
      },
      {
        src: '/fonts/source-serif-4/source-serif-4-latin-700-normal.woff2',
        fontWeight: 700,
      },
      {
        src: '/fonts/source-serif-4/source-serif-4-latin-400-italic.woff2',
        fontWeight: 400,
        fontStyle: 'italic',
      },
    ],
  });
}

registerPdfFonts();
