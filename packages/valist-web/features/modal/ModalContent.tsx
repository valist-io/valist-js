import LoginForm from '../accounts/LoginForm';

interface ModalProps {
  view: string,
}

export default function ModalContent(props: ModalProps): JSX.Element {
  const getModalView = (view: string) => {
    switch (view) {
      case "login": 
        return <LoginForm />
      default:
        return <div></div>;
    }
  };

  return (
    <section>
      {getModalView(props.view)}
    </section>
  );
}
