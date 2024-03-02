import { getClasses } from "../utils/getClasses";
import styles from "../styles/modules/navbar.module.scss";
import { IoIosLogOut } from "react-icons/io";
import { Link } from "react-router-dom";
import { useLogoutMutation } from "../services/Api";
import { useAppSelector } from "../hooks/hooks";

const Navbar = () => {
  const { user } = useAppSelector((state) => state.userReducer);
  const [logout] = useLogoutMutation();

  const handleLogout = () => {
    logout();
  };
  return (
    <header className={getClasses([styles.header])}>
      <div className={getClasses([styles.container])}>
        <div className={getClasses([styles.inner])}>
          <Link className={getClasses([styles.logo])} to="/login">
            Сервис хранения файлов
          </Link>
          {user && <IoIosLogOut onClick={handleLogout} className={getClasses([styles.logout])} />}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
