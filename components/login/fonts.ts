import { Playfair_Display } from 'next/font/google';

/** Display serif for the login title. Variable weight; the italic supplies the "&". */
export const display = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
});
