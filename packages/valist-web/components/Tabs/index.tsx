interface TabsProps {
  setView: Function
  view: string,
  tabs: string[],
}

export default function Tabs(props: TabsProps): JSX.Element {
  return (
    <div className="flex flex-col sm:flex-row cursor-pointer ml-2">
      {props.tabs.map((tab:string) => (
          <div key={tab} onClick={() => { props.setView(tab); }}
          className={"tab text-gray-600 text-center py-4 px-6 block hover:text-indigo-500 focus:outline-none  "  + ((props.view === tab) ? "text-indigo-500 border-indigo-500 border-b-2 font-medium" : "")}
          data-content={tab}>
          {tab}
        </div>
      ))}
    </div>
  );
}
