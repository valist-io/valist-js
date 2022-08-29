import { getApps } from "@/components/Electron";
import { Layout } from "@/components/Layout";
import { Library } from "@/components/Library";
import { AppConfig } from "@/utils/electron";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const LibraryPage: NextPage = () => {
  const [apps, setApps] = useState<Record<string, AppConfig>>({});
  
  useEffect(() => {
    getApps().then((_apps) => setApps(_apps));
  }, []);
  
  return (
    <Layout hideNavbar={true} padding={0}>
      <Library apps={apps} />
    </Layout>
  );
};

export default LibraryPage;