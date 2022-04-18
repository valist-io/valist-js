import styles from './LoginButton.module.css';
import { useAppDispatch } from '../../app/hooks';
import {
  showLogin,
} from '../modal/modalSlice';

export default function LoginButton() {
  const dispatch = useAppDispatch();

  return (
    <button
      className={styles.button}
      aria-label="Login"
      onClick={() => dispatch(showLogin())}
      >
      Login
    </button>
  );
};