import { useGetItemsQuery } from "../services/Api";
import FilesItem from "./FilesItem";
import { getClasses } from "../utils/getClasses";
import styles from "../styles/modules/filesList.module.scss";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFilesCount } from "../store/reducers/files.slice";

const FilesList = () => {
  const dispatch = useDispatch();
  const { data, isError, isLoading, isUninitialized, refetch } = useGetItemsQuery();
  useEffect(() => {
    dispatch(setFilesCount(data?.length));
  }, [data]);

  return (
    <>
      <h1 className={getClasses([styles.title])}>Список файлов</h1>
      {data && !isLoading && (
        <div className={getClasses([styles.count])}>
          Вы можете загрузить {20 - data?.length} из 20 файлов
        </div>
      )}
      <div className={getClasses([styles.inner])}>
        {isError ? (
          <div className={getClasses([styles.error])}>
            <span>Ошибка при запросе</span>
            <button className={getClasses([styles.error])} onClick={refetch}>
              Повторить
            </button>
          </div>
        ) : isLoading || isUninitialized ? (
          <span className="loader"></span>
        ) : data && data?.length > 0 ? (
          data?.map((file) => <FilesItem key={file.id} file={file} />)
        ) : (
          <span>Файлов нет</span>
        )}
      </div>{" "}
    </>
  );
};

export default FilesList;
