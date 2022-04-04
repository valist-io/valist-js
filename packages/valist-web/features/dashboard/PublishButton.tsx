import Link from "next/link";

interface PublishButtonProps {
  disabled: boolean;
  account: string,
}

export default function PublishButton(props: PublishButtonProps) {
  const buttonStyle = props.disabled ?
  'bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700' :
  'bg-indigo-200 hover:bg-indigo-200 focus:outline-none focus:shadow-outline-grey cursor-not-allowed';
  
  return (
    <div className="flex content-end sm:mt-0">
      <Link href={props.disabled ? `/create/release?account=${props.account}` : "/"}>
        <a className={`flex justify-center py-2 px-4 border border-transparent rounded-md 
        shadow-sm text-sm font-medium text-white ${buttonStyle}`}>
          Publish Release
        </a>
      </Link>
  </div>
  );
}