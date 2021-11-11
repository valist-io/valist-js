import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import SetLoading from '../../utils/loading';
import AddressIdenticon from '../../components/Identicons/AddressIdenticon';
import ValistContext from '../../components/Valist/ValistContext';

interface ProjectListIemProps {
  project: any,
}

export default function ProjectListItem(props: ProjectListIemProps) {
  const valist = useContext(ValistContext);
  const [repo, setRepo] = useState<any>('Loading');

  const getRepo = async () => {
    let repoData;
    try {
      const [orgName, repoName] = props.project.path.split('/');
      console.log('Org & Repo', props.project);
      repoData = await valist.getRepository(orgName, repoName);
      return repoData.meta.description;
    } catch (err) {
      console.log(err);
    }

    return null;
  };

  useEffect(() => {
    (async () => {
      const meta = await getRepo();
      setRepo(meta);
    })();
  }, [props.project]);

  return (
    <Link href={`/${props.project.path}`}>
      <div key={props.project.path}
        className="bg-white hover:bg-gray-100 p-4 m-4 border hover:border-2 shadow
       rounded-lg grid grid-cols-12 cursor-pointer">
        <div className="col-span-2">
          <AddressIdenticon height={80} address={props.project.path}/>
        </div>
        <div className="col-span-10">
          <div className={`font-bold text-xl curosor-pointer ${SetLoading(props.project.path)}`}>
            {props.project.path}
          </div>
          <div className={SetLoading(repo)}>
            {repo}
          </div>
        </div>
      </div>
    </Link>
  );
}
