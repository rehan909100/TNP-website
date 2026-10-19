import { Fraunces } from 'next/font/google';

/** Display serif for the login title. Variable weight and optical size; the italic supplies the "&". */
export const display = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz', 'SOFT'],
  display: 'swap',
});
