import Upload from "../components/Upload";
import FilesList from "../components/FilesList";
import { getClasses } from "../utils/getClasses";
import styles from "../styles/modules/home.module.scss";

const Home = () => {
  return (
    <div className={getClasses([styles.inner])}>
      <Upload />
      <div className={getClasses([styles.right])}>
        <FilesList />
      </div>
    </div>
  );
};

export default Home;
