import Link from 'next/link';
import AddressIdenticon from '../Identicons/AddressIdenticon';
import Tabs from '../Tabs';

interface ProjectProfileCardProps {
  teamName: string,
  projectName: string,
  projectImg: string,
  view: string,
  setView: Function
}

export default function ProjectProfileCard(props: ProjectProfileCardProps): JSX.Element {
  return (
    <section aria-labelledby="profile-overview-title">
      <div className="rounded-lg bg-white overflow-hidden shadow">
        <div className="sm:flex sm:items-center pt-6 px-6">
          <div className="sm:flex sm:space-x-5">
            <div className="flex-shrink-0">
              <img 
                height={85} 
                width={85} 
                className='mx-auto rounded-full' 
                src={props.projectImg}
                alt="profile-image" />
            </div>
            <div>
              <p className={`lg:text-3xl text-gray-900 sm:text-2xl font-medium`}>
                {props.projectName}
              </p>
              <p className='pt-1 text-gray-600'>
                <Link href={`/${props.teamName}`}>
                  <a>Published by: 
                    <span className="ml-2 hover:text-indigo-500 cursor-pointer text-gray-900 rounded-lg border-2 px-2 shadow-sm py-1">
                      <span style={{marginBottom: "-4px"}} className='inline-block mr-1'><AddressIdenticon address={props.teamName} height={20} /></span>
                      {props.teamName}
                    </span>
                  </a>
                </Link>
              </p>
            </div>
          </div>
        </div>
        <Tabs 
          setView={props.setView}
          view={props.view}
          tabs={['Readme', 'Versions', 'Members', 'Logs']}
        />
      </div>
    </section>
  );
}
