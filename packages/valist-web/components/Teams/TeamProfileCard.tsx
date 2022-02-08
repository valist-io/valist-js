import { TeamMeta } from '../../utils/Valist/types';
import Tabs from '../Tabs';

interface TeamProfileCardProps {
  view: string,
  setView: Function
  teamName: string,
  teamImage: string,
  meta: TeamMeta,
}

export default function TeamProfileCard(props: TeamProfileCardProps): JSX.Element {
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
              src={props.teamImage}
              alt="profile-image" />
            </div>
            <div>
              <p className={`lg:text-3xl text-gray-900 sm:text-2xl font-medium`}>
                {props.teamName}
              </p>
              <p>
                {props.meta.description}
              </p>
            </div>
          </div>
        </div>
        <Tabs 
          setView={props.setView}
          view={props.view}
          tabs={['Projects', 'Logs']}
        />
      </div>
    </section>
  );
}
