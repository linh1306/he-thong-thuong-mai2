import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export async function fetcher<T>(
  config: AxiosRequestConfig & { baseUrl?: string }
): Promise<T> {
  const apiClient = axios.create({
    headers: {
      "Content-Type": "application/json",
    }
  })
  return new Promise<T>((resolve, reject) => {
    apiClient
    .request(config)
    .then((res) => {
      resolve(res.data);
    })
    .catch((error: Error) => {
      reject(error);
    });
  });
}