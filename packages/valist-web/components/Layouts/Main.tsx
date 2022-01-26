import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from "../Navbar/Navbar";

interface LayoutProps {
  children?: ReactNode,
  title?: string,
  address: string
};

const Layout = (props: LayoutProps): JSX.Element => {
  return (
    <div>
      <Head>
        <title>Valist</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-100">
        <Navbar address={props.address} />
        <div className="pb-16">
          <br></br>
          <br></br>
        </div>
        <main className="-mt-24 pb-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {props.children}  
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;