import { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosError, AxiosRequestConfig, GenericAbortSignal } from "axios";

export const axiosBaseQuery =
  ({
    baseUrl,
  }: {
    baseUrl: string;
    params?: AxiosRequestConfig["params"];
  }): BaseQueryFn<
    {
      data?: AxiosRequestConfig["data"];
      url: string;
      method?: AxiosRequestConfig["method"];
      headers?: AxiosRequestConfig["headers"];
      onUploadProgress?: AxiosRequestConfig["onUploadProgress"];
      signal?: GenericAbortSignal;
      responseType?: AxiosRequestConfig["responseType"];
    },
    unknown,
    unknown
  > =>
  async ({ data, url, method, responseType, signal, headers, onUploadProgress }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        headers,
        responseType,
        signal,
        onUploadProgress,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
