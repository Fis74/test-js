import { GenericAbortSignal } from "axios";

export type LoginData = {
  name: string;
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type User = {
  token: string | null;
  name: string | null;
  email: string | null;
};

export type RegisterResult = {
  status: string;
};

export type DeleteResult = {
  status: string;
};

export type LoginResult = {
  status: string;
  token: string;
};

export type ItemsResult = {
  files: Files[];
  status: string;
};

export type Files = {
  id: string;
  name: string;
  fileName: string;
  mimeType: string;
  url: string;
  createdAt: Date;
  localUrl?: string;
};

export type UploadFile = {
  files: FileList;
  abortSignal?: GenericAbortSignal;
  progress: { onProgress?: (progress: number) => void };
};

export enum FileType {
  image = "image",
  document = "document",
}
