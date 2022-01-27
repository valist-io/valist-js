import React, { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layouts/Main";
import { NextPage } from "next";
import AddressProfileCard from "../../../components/Address/AddressProfileCard";

const AddressPage: NextPage = () => {
  const router = useRouter();
  const address = router.query.addr?.toString() || 'loading';
  const [view, setView] = useState("Projects");

  return (
    <Layout title="Valist | Address">
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
        {/* Left column */}
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <AddressProfileCard address={address} view={view} setView={setView} />
        </div>
        {/* Right column */}
        <div className="grid grid-cols-1 gap-4">
          {/* Recent Activity */}
        </div>
      </div>
    </Layout>
  );
};

export default AddressPage;