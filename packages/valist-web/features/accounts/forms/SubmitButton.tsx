interface SubmitButtonProps {
  handleSubmit: () => void;
  formValid: boolean;
  submitText: string;
  navigation?: boolean;
}

export default function SubmitButton(props: SubmitButtonProps) {
  return (
    <span className="w-full inline-flex rounded-md shadow-sm">
    <button onClick={() => props.handleSubmit()} value="Submit" type="submit"
      className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent
      text-base leading-6 font-medium rounded-md text-white transition ease-in-out duration-150
      ${(props.formValid) || props.navigation ?
        'bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700' :
        'bg-indigo-200 hover:bg-indigo-200 focus:outline-none focus:shadow-outline-grey cursor-not-allowed'
      }`}>
      {props.submitText}
    </button>
  </span>
  );
};