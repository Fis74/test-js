import { FC, useState } from "react";
import { formatRelative, subDays } from "date-fns";
import { ru } from "date-fns/locale";
import { Files } from "../types/types";
import styles from "../styles/modules/filesItem.module.scss";
import { getClasses } from "../utils/getClasses";
import { MdDelete } from "react-icons/md";
import { CgSoftwareDownload } from "react-icons/cg";
import { useDeleteItemMutation, useDownloadFileMutation, useLinkFileQuery } from "../services/Api";
import { IoMdDocument } from "react-icons/io";
interface FllesItem {
  file: Files;
}

const FilesItem: FC<FllesItem> = ({ file }) => {
  const [hoverItem, setHoverItem] = useState<boolean>(false);
  const [deleteItem, { isLoading }] = useDeleteItemMutation();
  const [downloadItem, { isLoading: isLoadingDownload }] = useDownloadFileMutation();
  const { data: linkData, isLoading: LinkLoading } = useLinkFileQuery(file.id);

  const handleRemove = (id: string) => {
    deleteItem(id);
  };
  const downloadFile = (file: Files) => {
    downloadItem(file);
  };

  return (
    <>
      <div
        onMouseEnter={() => setHoverItem(true)}
        onMouseLeave={() => setHoverItem(false)}
        className={getClasses([
          styles.inner,
          (hoverItem || isLoading || isLoadingDownload) && styles.overlay,
        ])}
      >
        <div className={getClasses([styles.top, file.mimeType.includes("image") && styles.border])}>
          {file.mimeType.includes("image") ? (
            LinkLoading ? (
              <div className={getClasses([styles.imgloaderbox])}>
                <span className={getClasses([styles.imgloader])}></span>
              </div>
            ) : (
              <img className={getClasses([styles.img])} src={linkData} alt={file.name} />
            )
          ) : (
            <IoMdDocument className={getClasses([styles.file])} />
          )}
        </div>
        {isLoading || isLoadingDownload ? (
          <div className={getClasses([styles.loaderbox])}>
            <span className={getClasses([styles.loader])}></span>
          </div>
        ) : (
          hoverItem && (
            <div className={getClasses([styles.actions])}>
              <CgSoftwareDownload
                onClick={() => downloadFile(file)}
                className={getClasses([styles.icon])}
              />
              <MdDelete
                onClick={() => handleRemove(file.id)}
                className={getClasses([styles.icon])}
              />
            </div>
          )
        )}
        <h2 className={getClasses([styles.title])}>{file.fileName}</h2>
        <span className={getClasses([styles.date])}>
          Загружен{" "}
          {formatRelative(subDays(new Date(file.createdAt), 0), new Date(), { locale: ru })}
        </span>
      </div>
    </>
  );
};

export default FilesItem;
