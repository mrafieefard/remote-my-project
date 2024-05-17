import axios, { AxiosError, AxiosInstance } from "axios";
import { ProjectResponse, TokenResponse, LogsResponse } from "./base";
import toast from "react-hot-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const client = axios.create({
  withCredentials: true,
  baseURL : "/api"
});

function handle_error(
  error: any,
  toastContext: typeof toast,
  router: AppRouterInstance
) {
  if (error instanceof AxiosError) {
    if ([400, 401, 402, 403, 404].includes(error.response?.status!)) {
      toastContext.error(error.response?.data.detail);
    } else {
      toastContext.error("Failed to fetch data");
    }
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      router.push("/login", { scroll: false });
    }
  } else {
    toastContext.error("Failed to fetch data");
  }

  throw error;
}

async function http_login(username: string, password: string) {
  const response = await client.post<TokenResponse>(`/client/token`, {
    username: username,
    password: password,
  });
  return response.data;
}

async function http_get_projects() {
  const response = await client.get<ProjectResponse[]>(`/client/project`);
  return response.data;
}

async function http_get_logs(page: number, size: number) {
  const response = await client.get<LogsResponse>(`/client/logs`, {
    params: { page, size },
  });
  return response.data;
}

async function http_edit_project(
  id: string,
  title: string,
  description: string,
  change_secret: boolean
) {
  const response = await client.put<ProjectResponse>(`/client/project/${id}`, {
    title: title,
    description: description,
    change_secret: change_secret,
  });
  return response.data;
}

async function http_delete_log(id: string) {
  await client.delete(`/client/log/${id}`);
  return true;
}

async function http_delete_project(id: string) {
  await client.delete(`/client/project/${id}`);
  return true;
}

async function http_create_project(title: string, description: string) {
  const response = await client.post(`/client/project`, {
    title: title,
    description: description,
  });
  return response.data;
}

async function http_clear_logs() {
  await client.delete(`/client/logs/clear`);
  return true;
}

export {
  handle_error,
  http_login,
  http_get_projects,
  http_get_logs,
  http_edit_project,
  http_delete_log,
  http_delete_project,
  http_create_project,
  http_clear_logs,
};
