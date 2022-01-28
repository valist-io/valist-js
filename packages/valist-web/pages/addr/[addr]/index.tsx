import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layouts/Main";
import { NextPage } from "next";
import AddressProfileCard from "../../../components/Address/AddressProfileCard";
import HomepageActivity from "../../../components/Homepage/HomepageActivity";
import AccountContext from "../../../components/Accounts/AccountContext";
import ProjectList from "../../../components/Projects/ProjectList";

const AddressPage: NextPage = () => {
  const router = useRouter();
  const address = router.query.addr?.toString() || '0x0';
  const accountCtx = useContext(AccountContext);
  const [view, setView] = useState("Projects");

  return (
    <Layout title="Valist | Address">
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
        {/* Left column */}
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <AddressProfileCard address={address} view={view} setView={setView} />
          <ProjectList />
        </div>
        {/* Right column */}
        <div className="grid grid-cols-1 gap-4">
          {/* Recent Activity */}
          <HomepageActivity address={accountCtx.address} />
        </div>
      </div>
    </Layout>
  );
};

export default AddressPage;