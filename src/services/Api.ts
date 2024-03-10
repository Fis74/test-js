import { FetchBaseQueryError, createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBase";
import {
  DeleteResult,
  Files,
  ItemsResult,
  LoginData,
  LoginResult,
  RegisterData,
  RegisterResult,
  UploadFile,
} from "../types/types";
import { logout, setUser } from "../store/reducers/users.slice";
import { AxiosProgressEvent } from "axios";
import { RootState } from "../store/store";

export const Api = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  tagTypes: ["Files"],
  endpoints: (build) => ({
    login: build.mutation<LoginResult, LoginData>({
      async queryFn({ email, password }, _queryApi, _extraOptions, fetch) {
        const result = await fetch({
          url: "/login",
          method: "POST",
          data: {
            email,
            password,
          },
          headers: {
            "Content-Type": "appapplication/json",
          },
        });

        if (result.error) {
          return { error: result.error as FetchBaseQueryError };
        }
        const typed = result.data as LoginResult;
        localStorage.setItem("token", typed.token);
        _queryApi.dispatch(setUser({ token: typed.token, name, email }));
        return { data: typed };
      },
    }),
    register: build.mutation<RegisterResult, RegisterData>({
      async queryFn({ name, email, password }, _queryApi, _extraOptions, fetch) {
        const result = await fetch({
          url: "/register",
          method: "POST",
          headers: {
            "Content-Type": "appapplication/json",
          },
          data: {
            name,
            email,
            password,
          },
        });
        if (result.error) {
          return { error: result.error as FetchBaseQueryError };
        }
        const typed = result.data as RegisterResult;
        return { data: typed };
      },
    }),
    logout: build.mutation<RegisterResult, void>({
      async queryFn(_, _queryApi, _extraOptions, fetch) {
        const { user } = (_queryApi.getState() as RootState).userReducer;
        const result = await fetch({
          url: "/logout",
          method: "POST",
          headers: {
            "Content-Type": "appapplication/json",
            Authorization: "Bearer " + user?.token,
          },
        });
        _queryApi.dispatch(logout());
        if (result.error) {
          return { error: result.error as FetchBaseQueryError };
        }
        const typed = result.data as RegisterResult;
        return { data: typed };
      },
    }),
    getItems: build.query<Files[], void>({
      async queryFn(_, _queryApi, _extraOptions, fetch) {
        const { user } = (_queryApi.getState() as RootState).userReducer;
        const result = await fetch({
          url: "/media",
          method: "GET",
          headers: {
            "Content-Type": "appapplication/json",
            Authorization: "Bearer " + user?.token,
          },
        });
        if (result.error) {
          const err = result.error as FetchBaseQueryError;
          return { error: err };
        }
        const typed = result.data as ItemsResult;
        return { data: typed.files };
      },
      providesTags: ["Files"],
    }),
    uploadItem: build.mutation<RegisterResult, UploadFile>({
      async queryFn({ files, progress, abortSignal }, _queryApi, _extraOptions, fetch) {
        const { user } = (_queryApi.getState() as RootState).userReducer;

        const progressUpload = progress?.onProgress;
        const result = await fetch({
          url: "/media/upload",
          method: "POST",
          headers: {
            Authorization: "Bearer " + user?.token,
          },
          data: files,
          onUploadProgress: (event: AxiosProgressEvent) => {
            progressUpload?.(event.progress! * 100);
          },
          signal: abortSignal,
        });
        if (result.error) {
          const err = result.error as FetchBaseQueryError;
          if (err.status === 401) {
            _queryApi.dispatch(logout());
          }
          return { error: err };
        }
        const typed = result.data as RegisterResult;
        return { data: typed };
      },
      invalidatesTags: ["Files"],
    }),
    deleteItem: build.mutation<string, string>({
      async queryFn(id, _queryApi, _extraOptions, fetch) {
        const { user } = (_queryApi.getState() as RootState).userReducer;
        const result = await fetch({
          url: `/media/${id}`,
          method: "DELETE",
          headers: {
            "Content-Type": "appapplication/json",
            Authorization: "Bearer " + user?.token,
          },
        });
        if (result.error) {
          const err = result.error as FetchBaseQueryError;
          if (err.status === 401) {
            _queryApi.dispatch(logout());
          }
          return { error: err };
        }

        const typed = result.data as DeleteResult;
        return { data: typed.status };
      },
      invalidatesTags: ["Files"],
    }),
    downloadFile: build.mutation<Blob, Files>({
      async queryFn(file, _queryApi, _extraOptions, fetch) {
        const { user } = (_queryApi.getState() as RootState).userReducer;
        const result = await fetch({
          url: `/media/${file.id}`,
          method: "GET",
          responseType: "blob",
          headers: {
            Authorization: "Bearer " + user?.token,
          },
        });
        if (result.error) {
          const err = result.error as FetchBaseQueryError;
          if (err.status === 401) {
            _queryApi.dispatch(logout());
          }
          return { error: err };
        }
        const typed = result.data as Blob;
        const url = window.URL.createObjectURL(typed);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        return { data: typed };
      },
    }),
    linkFile: build.query<string, string>({
      async queryFn(id, _queryApi, _extraOptions, fetch) {
        const { user } = (_queryApi.getState() as RootState).userReducer;
        const result = await fetch({
          url: `/media/${id}`,
          method: "GET",
          responseType: "blob",
          headers: {
            Authorization: "Bearer " + user?.token,
          },
        });
        if (result.error) {
          const err = result.error as FetchBaseQueryError;
          if (err.status === 401) {
            _queryApi.dispatch(logout());
          }
          return { error: err };
        }
        const typed = result.data as Blob;
        const url = window.URL.createObjectURL(typed);
        return { data: url };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetItemsQuery,
  useLogoutMutation,
  useUploadItemMutation,
  useDeleteItemMutation,
  useDownloadFileMutation,
  useLinkFileQuery,
} = Api;
