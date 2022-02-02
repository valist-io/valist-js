import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layouts/Main";
import { NextPage } from "next";
import AddressProfileCard from "../../../components/Address/AddressProfileCard";
import ActivityCard from "../../../components/Logs/ActivityCard";
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
          <ProjectList address={address} />
        </div>
        {/* Right column */}
        <div className="grid grid-cols-1 gap-4">
          {/* Recent Activity */}
          <ActivityCard logType="sender" address={address} />
        </div>
      </div>
    </Layout>
  );
};

export default AddressPage;