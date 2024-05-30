import axios, { AxiosError, AxiosInstance } from "axios";
import {
  ProjectResponse,
  TokenResponse,
  LogsResponse,
  WidgetResponse,
} from "./base";
import toast from "react-hot-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";


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

class HttpClient {
  client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async http_login(username: string, password: string) {
    const response = await this.client.post<TokenResponse>(`/client/token`, {
      username: username,
      password: password,
    });
    return response.data;
  }

  async http_get_projects(search: string) {
    const response = await this.client.get<ProjectResponse[]>(`/client/projects`, {
      params: {
        search: search,
      },
    });
    return response.data;
  }

  async http_get_logs(
    page: number,
    size: number,
    levelFilter: string | Array<string>,
    projectFilter: string | Array<string>,
    search: string
  ) {
    const response = await this.client.post<LogsResponse>(`/client/logs`, {
      page: page,
      size: size,
      level: levelFilter,
      project: projectFilter,
      search: search,
    });
    return response.data;
  }

  async http_edit_project(
    id: string,
    title: string,
    description: string,
    change_secret: boolean
  ) {
    const response = await this.client.put<ProjectResponse>(
      `/client/project/${id}`,
      {
        title: title,
        description: description,
        change_secret: change_secret,
      }
    );
    return response.data;
  }

  async http_delete_log(id: string) {
    await this.client.delete(`/client/log/${id}`);
    return true;
  }

  async http_delete_project(id: string) {
    await this.client.delete(`/client/project/${id}`);
    return true;
  }

  async http_create_project(title: string, description: string) {
    const response = await this.client.post(`/client/project`, {
      title: title,
      description: description,
    });
    return response.data;
  }
  async http_clear_logs() {
    await this.client.delete(`/client/logs/clear`);
    return true;
  }
  async http_get_widgets() {
    const response = await this.client.get<WidgetResponse[]>(`/client/widgets`);
    return response.data;
  }
}

export { handle_error, HttpClient };
