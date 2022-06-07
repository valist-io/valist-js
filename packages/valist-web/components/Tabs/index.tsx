export type Tab = {
  text: string;
  disabled: boolean;
}

interface TabsProps {
  setView: Function
  view: string,
  tabs: Tab[],
}

export default function Tabs(props: TabsProps): JSX.Element {
  const handleTabClick = (tab: Tab) => {
    if (!tab.disabled) {
      props.setView(tab.text);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row ml-2">
      {props.tabs.map((tab: Tab) => (
        <div key={tab.text} onClick={() => handleTabClick(tab)}
          className={`${tab.disabled ? 'cursor-not-allowed ' : 'cursor-pointer '}tab text-center py-4 px-6 block hover:text-indigo-500 focus:outline-none  `  + ((props.view === tab.text) ? "text-white-500 border-indigo-500 border-b-4 font-medium" : "")}
          data-content={tab.text}>
          {tab.text}
        </div>
      ))}
    </div>
  );
}
