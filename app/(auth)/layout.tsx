import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: "Ready to explore Imaginify",
  description: "AI-powered image generator",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <main className='auth'>{children}</main>;
};

export default Layout;
