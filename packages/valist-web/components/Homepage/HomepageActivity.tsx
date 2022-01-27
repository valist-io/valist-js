import React, { useEffect, useState } from 'react';
import { useQuery } from "@apollo/client";
import { ACT_QUERY } from '../../utils/Apollo/queries';

interface HomepageActivityProps {
  address: string,
}

type Activity = {
  id: string,
  text: string,
  description: string,
}

const HomepageActivity = (props:HomepageActivityProps) => {
  const [ activities, setActivities ] = useState<Activity[]>([]);
  const { data, loading, error } = useQuery(ACT_QUERY);

  useEffect(() => {
    if (data && data.activities) {
      setActivities(data.activities);
    }
  }, [data, loading, error]);

  return (
    <section aria-labelledby="announcements-title">
      <div className="rounded-lg bg-white overflow-hidden shadow">
        <div className="p-6">
          <h2 className="text-base font-medium text-gray-900" id="announcements-title">
            Recent Activity
          </h2>
          <div className="flow-root mt-6">
            <ul role="list" className="-my-5 divide-y divide-gray-200">
              {activities.map((activity) => (
                <li key={activity.id} className="py-5">
                  <div className="relative focus-within:ring-2 focus-within:ring-cyan-500">
                    <h3 className="text-sm font-semibold text-gray-800">
                      <span className="absolute inset-0" aria-hidden="true" />
                        {activity.text}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {activity.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageActivity;
