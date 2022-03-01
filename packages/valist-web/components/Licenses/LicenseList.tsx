import { License } from "../../utils/Valist/types";

// const mockLicenses:License[] = [
//   {
//     image: '/images/vCentered.png',
//     team: 'area51',
//     project: 'FPSGame',
//     name: 'SeasonPass',
//     description: 'An fps game where the goal of the game is to win the game!',
//   },
//   {
//     image: '/images/vCentered.png',
//     team: 'test1',
//     project: 'TheGame',
//     name: 'GoldPass',
//     description: "If you're reading this then you just lost the game.",
//   },
//   {
//     image: '/images/vCentered.png',
//     team: 'area51',
//     project: 'RPGGame',
//     name: 'SeasonPass',
//     description: 'An RPG game where you can do RPG stuff!',
//   },
//   {
//     image: '/images/vCentered.png',
//     team: 'test1',
//     project: 'TheGame',
//     name: 'GoldPass',
//     description: "If you're reading this then you just lost the game.",
//   },
//   {
//     image: '/images/vCentered.png',
//     team: 'area51',
//     project: 'RPGGame',
//     name: 'SeasonPass',
//     description: 'An RPG game where you can do RPG stuff!',
//   },
//   {
//     image: '/images/vCentered.png',
//     team: 'area51',
//     project: 'FPSGame',
//     name: 'SeasonPass',
//     description: 'An fps game where the goal of the game is to win the game!',
//   },
// ];

interface LicenseListProps {
  licenses: License[];
}

export default function LicenseList(props: LicenseListProps) {
  return (
    <div className="flex flex-col">
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Team
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Project
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Token ID
                </th>
              </tr>
            </thead>
            <tbody>
              {props.licenses?.map((license: License, index) => (
                <tr key={license.name + license.team} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {license.name}
                  </td>
            
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {license.team}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {license.project}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {license.id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
};