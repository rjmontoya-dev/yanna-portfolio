import { Inter, Sora, Instrument_Serif } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const sora = Sora({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sora', display: 'swap' });
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
});

export const metadata = {
  title: 'Yanaleen Peregrino · Virtual Assistant',
  description:
    'Highly organized, detail-oriented Virtual Assistant with 5+ years of experience supporting executives and entrepreneurs.',
  openGraph: {
    title: 'Yanaleen Peregrino · Virtual Assistant',
    description: 'Calendar, inbox, project, and CRM support for busy executives and entrepreneurs.',
    type: 'website',
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff8fa' },
    { media: '(prefers-color-scheme: dark)', color: '#170c12' },
  ],
};

// Runs before first paint: applies the saved/system theme (no flash) and
// marks the document as JS-enabled so scroll-reveal styles can apply.
const themeScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.dataset.theme=t}catch(e){d.dataset.theme='light'}d.classList.add('js')})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
