import './globals.css';
import { Jua, Gowun_Dodum } from 'next/font/google';

const jua = Jua({ weight: '400', subsets: ['latin'], variable: '--font-title' });
const gowun = Gowun_Dodum({ weight: '400', subsets: ['latin'], variable: '--font-body' });

export const metadata = {
  title: '가정통신문 만들기',
  description: '디자인을 고르고 내용만 채우면 예쁜 가정통신문이 완성됩니다',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={`${jua.variable} ${gowun.variable}`}>{children}</body>
    </html>
  );
}
