import { Layout } from "@/components/Layout";
import { Library } from "@/components/Library";
import { AppConfig } from "@/utils/electron";
import { NextPage } from "next";
import { useEffect, useState } from "react";

declare global {
  interface Window {
      valist: any;
  }
}

const LibraryPage: NextPage = () => {
  const [apps, setApps] = useState<Record<string, AppConfig>>({});
  
  useEffect(() => {
    (async () => {
      const apps = await window?.valist?.getApps();
      console.log('List Installed Valist Apps:');
      console.log(apps);
      setApps(apps);
    })();
  }, []);
  
  return (
    <Layout hideNavbar={true} padding={0}>
      <Library apps={apps} />
    </Layout>
  );
};

export default LibraryPage;