import { Layout } from "@/components/Layout";
import { AppConfig, Library } from "@/components/Library";
import { NextPage } from "next";
import { useEffect, useState } from "react";

declare global {
  interface Window {
      valist: any;
  }
}

const LibraryPage: NextPage = () => {
  const [appNames, setAppNames] = useState<AppConfig[]>([]);
  
  useEffect(() => {
    (async () => {
      const appNames = await window?.valist?.getApps();
      console.log('List Installed Valist Apps:');
      console.log(appNames);
      setAppNames(appNames);
    })();
  }, []);
  
  return (
    <Layout hideNavbar={true} padding={0}>
      <Library appNames={appNames} />
    </Layout>
  );
};

export default LibraryPage;