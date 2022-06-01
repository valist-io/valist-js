import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from "../Navbar/Navbar";
import { Paper, useMantineTheme } from '@mantine/core';

interface LayoutProps {
  children?: ReactNode,
  title?: string,
};

export default function Layout(props: LayoutProps): JSX.Element {
  const theme = useMantineTheme();
  const secondaryColor = theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[1];
  
  return (
    <div>
      <Head>
        <title>{props.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Paper style={{ background: secondaryColor }} className="min-h-screen">
        <Navbar />
        <main style={{ paddingTop: 120 }} className="pb-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {props.children}  
          </div>
        </main>
      </Paper>
    </div>
  );
};