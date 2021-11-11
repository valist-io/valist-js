import { useState, useContext, useEffect } from 'react';
import FeaturedProjectList from '../../components/Browse/FeaturedProjectList';
import Layout from '../../components/Layouts/DashboardLayout';
import ValistContext from '../../components/Valist/ValistContext';

const featured = [
  {
    path: 'valist/sdk',
  },
  {
    path: 'valist/cli',
  },
  {
    path: 'area51/web3party',
  },
];

const loading = [
  {
    path: 'Loading/Loading',
  },
];

export default function Featured() {
  const [number, setNumber] = useState<number>(10);
  const [view, setView] = useState<any>('featured');
  const [list, setList] = useState(featured);
  const valist = useContext(ValistContext);

  const getRepos = async () => {
    const projects:any = [];
    setList(loading);
    try {
      console.log('Internal Page', number);
      const orgs = await valist.getOrganizationNames(1, number);
      // eslint-disable-next-line no-restricted-syntax
      for (const orgName of orgs) {
        let org = {
          repoNames: [],
        };
        try {
          // eslint-disable-next-line no-await-in-loop
          org = await valist.getOrganization(orgName);
        } catch (err) {
          console.log(err);
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const project of org.repoNames) {
          projects.push({
            path: `${orgName}/${project}`,
          });
        }
      }
      return projects;
    } catch (err) {
      console.log(err);
    }

    return [];
  };

  useEffect(() => {
    if (view === 'featured') {
      setList(featured);
    }

    if (view === 'all') {
      (async () => {
        const data = await getRepos();
        setList(data);
      })();
    }
  }, [view, number]);

  return (
    <Layout>
      <div className="grid grid-cols-1 gap-4">
          <section>
            <div className="rounded-lg bg-white overflow-hidden shadow py-4 mx-40">
              <div className="font-bold text-gray-900 text-center text-4xl p-5">
                <h1>Browse Projects</h1>
              </div>
              <div className="flex justify-center">
                <div onClick={() => setView('featured')}
                  className="px-5 text-xl text-indigo-500 cursor-pointer">
                  Featured
                </div>
                <div onClick={() => setView('all')} className="px-5 text-xl text-indigo-500 cursor-pointer">
                  All
                </div>
              </div>
            </div>
          </section>
          <FeaturedProjectList projects={list} />
          {(view !== 'featured')
            && <div className="cursor-pointer text-center"
                onClick={() => setNumber(number + 1)}>
                Load More
              </div>}
        </div>
    </Layout>
  );
}
