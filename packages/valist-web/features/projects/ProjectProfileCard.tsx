/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import Tabs, { Tab } from '../../components/Tabs';
import { SetUseState } from '../../utils/Account/types';
import AddressIdenticon from '../../components/Identicons/AddressIdenticon';
import ProjectProfileCardActions from './ProjectProfileCardActions';

interface ProjectProfileCardProps {
  teamName: string,
  projectName: string,
  projectImg: string,
  tabs: Tab[],
  view: string,
  setView: SetUseState<string>
}

export default function ProjectProfileCard(props: ProjectProfileCardProps): JSX.Element {
  return (
    <section aria-labelledby="profile-overview-title">
      <div className="rounded-lg bg-white pt-6 px-6 overflow-hidden shadow">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-5 px-6">
            {props.projectImg && props.projectImg !== '' ? 
              <div className="flex-shrink-0 mx-auto rounded-full overflow-hidden" style={{ height: 40, width: 40 }} >
                <img src={props.projectImg} alt="profile-image" />
              </div>            
              :
              <AddressIdenticon address={`${props.teamName}/${props.projectName}`} height={40} width={40} />
            }
            <div>
              <p className={`lg:text-3xl text-gray-900 sm:text-2xl font-medium`}>
                {props.projectName}
              </p>
            </div>
          </div>
          {/* <ProjectProfileCardActions accountName={props.teamName} projectName={props.projectName} /> */}
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
