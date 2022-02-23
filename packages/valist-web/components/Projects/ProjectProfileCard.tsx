import Link from 'next/link';
import { SetUseState } from '../../utils/Account/types';
import AddressIdenticon from '../Identicons/AddressIdenticon';
import Tabs from '../Tabs';

interface ProjectProfileCardProps {
  teamName: string,
  projectName: string,
  projectImg: string,
  tabs: string[],
  view: string,
  setView: SetUseState<string>
}

export default function ProjectProfileCard(props: ProjectProfileCardProps): JSX.Element {
  console.log('projectImg', props.projectImg);
  return (
    <section aria-labelledby="profile-overview-title">
      <div className="rounded-lg bg-white overflow-hidden shadow">
        <div className="sm:flex sm:items-center pt-6 px-6">
          <div className="sm:flex sm:space-x-5">
            {props.projectImg && props.projectImg !== '' ? 
              <div className="flex-shrink-0 mx-auto rounded-full overflow-hidden" style={{height: 85, width: 85}} >
                <img src={props.projectImg} alt="profile-image" />
              </div>            
              :
              <AddressIdenticon address={`${props.teamName}/${props.projectName}`} height={80} width={80} />
            }
            <div>
              <p className={`lg:text-3xl text-gray-900 sm:text-2xl font-medium`}>
                {props.projectName}
              </p>
              <p className='pt-1 text-gray-600'>
                <Link href={`/${props.teamName}`}>
                  <a>Published by: 
                    <span className="ml-2 hover:text-indigo-500 cursor-pointer text-gray-900 rounded-lg border-2 px-2 shadow-sm py-1">
                      <span style={{marginBottom: "-4px"}} className='inline-block mr-1'><AddressIdenticon address={props.teamName} height={20} width={20} /></span>
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
          tabs={props.tabs}
        />
      </div>
    </section>
  );
}
