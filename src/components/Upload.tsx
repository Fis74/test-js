import { useEffect, useId, useRef, useState } from "react";
import styles from "../styles/modules/upload.module.scss";
import { getClasses } from "../utils/getClasses";
import { MdCloudUpload } from "react-icons/md";
import { MdOutlineClose } from "react-icons/md";
import { useUploadItemMutation } from "../services/Api";
import { useAppSelector } from "../hooks/hooks";

export const Upload = () => {
  const { filesCount } = useAppSelector((state) => state.filesReducer);
  const [progress, setProgress] = useState<number>(0);
  const [drop, setDrop] = useState<boolean>(false);
  const [upload, { isSuccess, isLoading, isError }] = useUploadItemMutation();
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const id = useId();
  const abortControllerRef = useRef<AbortController | null>(null);
  const [fileSizeError, setFileSizeError] = useState<string>();
  useEffect(() => {
    setProgress(0);
    setFiles(null);
    if (input.current) {
      input.current.value = "";
    }
  }, [isError, isSuccess]);

  const abortUpload = () => {
    abortControllerRef.current?.abort();
  };

  useEffect(() => {
    if (files) {
      abortControllerRef.current = new AbortController();
      const abortSignal = abortControllerRef.current.signal;
      upload({
        files,
        progress: { onProgress: setProgress },
        abortSignal,
      });
    }
  }, [files]);

  const checkFile = (files: FileList) => {
    const reduce = [...files].reduce((sum, current) => sum + current.size, 0);
    setFileSizeError("");
    if (files.length > 0 && files.length <= 20 - filesCount && reduce < 1000000) {
      setFiles(files);
    } else {
      setFileSizeError("Количество или размер больше 1мб");
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDrop(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDrop(false);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files;
    console.log(droppedFile);
    setDrop(false);
    checkFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkFile(e.target.files!);
  };

  const handleUploadFile = () => {
    input.current?.click();
  };

  return (
    <>
      {fileSizeError ? (
        <p className={getClasses([styles.error])}>{fileSizeError}</p>
      ) : (
        isError && <p className={getClasses([styles.error])}>Ошибка при загрузке файла</p>
      )}
      <div
        onDrop={handleFileDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={handleUploadFile}
        className={getClasses([styles.inner])}
      >
        {!isLoading && (
          <span className={getClasses([styles.text])}>
            {filesCount >= 20
              ? "У вас лимит загрузки файлов"
              : "Перенесите или нажмите чтобы загрузить файлы"}
          </span>
        )}
        <div className={getClasses([styles.root])}>
          <label
            htmlFor={id}
            className={getClasses([styles.label, styles.visible, drop && styles.drop])}
          >
            <input
              multiple
              ref={input}
              disabled={isLoading || filesCount >= 20}
              type="file"
              className={getClasses([styles.input])}
              onChange={handleFileChange}
              id={id}
              accept="image/png,image/jpeg,image/gif,.pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />

            <MdCloudUpload className={getClasses([styles.icon])} />
          </label>
          {isLoading && (
            <div className={getClasses([styles.loading])}>
              <progress
                max="100"
                className={getClasses([styles.progress])}
                value={progress}
              ></progress>
              <MdOutlineClose onClick={abortUpload} className={getClasses([styles.abort])} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Upload;
