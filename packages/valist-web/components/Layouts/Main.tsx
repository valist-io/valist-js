import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from "../Navbar/Navbar";

interface LayoutProps {
  children?: ReactNode,
  title?: string,
};

export default function Layout(props: LayoutProps): JSX.Element {
  return (
    <div>
      <Head>
        <title>{props.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="pt-4 pb-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {props.children}  
          </div>
        </main>
      </div>
    </div>
  );
};