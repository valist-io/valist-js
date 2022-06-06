import React from 'react' ;
import { NextPage } from "next";
import Layout from "../components/Layouts/Main";

const Discover: NextPage = () => {
  return (
    <Layout title="Valist | Discover">
      <div className="flex mt-20 lg:mt-32">
        <div className="m-auto">
          <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-indigo-500 sm:text-7xl">
            Coming Soon!
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
            Discover your favorite <b><i>software applications</i></b>, <b><i>libraries</i></b> and <b><i>games.</i></b> All on Web3!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Discover;
