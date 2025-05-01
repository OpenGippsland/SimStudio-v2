import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navigation from './Navigation';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout = ({ 
  children, 
  title = 'SimStudio - Driver Training & Education'
}: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/assets/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png" />
      </Head>
      
      <Navigation />
      
      <main className="flex-grow bg-white">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
