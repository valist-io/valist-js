import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layouts/Main";
import { NextPage } from "next";
import AddressProfileCard from "../../../components/Address/AddressProfileCard";
import ActivityCard from "../../../components/Logs/ActivityCard";
import ProjectList from "../../../components/Projects/ProjectList";
import { useQuery } from "@apollo/client";
import { USER_PROJECTS } from "../../../utils/Apollo/queries";
import { Project } from "../../../utils/Apollo/types";

const AddressPage: NextPage = () => {
  const router = useRouter();
  const address = router.query.addr?.toString() || '0x0';
  const [view, setView] = useState("Projects");
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const { data, loading, error } = useQuery(USER_PROJECTS, {
    variables: { address: address.toLowerCase() },
  });

  useEffect(() => {
    if (data?.users[0]) {
      setUserProjects(data.users[0].projects);
    } else if (data) {
      setUserProjects([]);
    }
  }, [data, loading, error, setUserProjects]);

  return (
    <Layout title="Valist | Address">
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
        {/* Left column */}
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <AddressProfileCard address={address} view={view} setView={setView} />
          <ProjectList linksDisabled={false} projects={userProjects} />
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