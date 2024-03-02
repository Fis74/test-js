import { Link } from "react-router-dom";
import styles from "../styles/modules/error.module.scss";
import { getClasses } from "../utils/getClasses";

export const ErrorPage = () => {
  return (
    <div className={getClasses([styles.inner])}>
      <h1>404</h1>
      <p>Такой страницы нету</p>
      <Link to={"/"}>На главную</Link>
    </div>
  );
};
