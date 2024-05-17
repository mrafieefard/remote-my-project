import axios, { AxiosError, AxiosInstance } from "axios";
import { ProjectResponse, TokenResponse, LogsResponse } from "./base";
import toast from "react-hot-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

class HttpClient {
  client: AxiosInstance;
  toast: typeof toast;
  router: AppRouterInstance;
  token: string;

  constructor(
    token: string,
    toastContext: typeof toast,
    router: AppRouterInstance
  ) {
    this.client = axios.create({
      baseURL: "http://127.0.0.1:8000",
      headers: {
        Authorization: token,
      },
    });
    this.toast = toastContext;
    this.router = router;
    this.token = token;
  }

  handle_error(error: any) {
    if (error instanceof AxiosError) {
      if ([400, 401, 402, 403, 404].includes(error.response?.status!)) {
        this.toast.error(error.response?.data.detail);
      } else {
        this.toast.error("Failed to fetch data");
      }
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        this.router.push("/login", { scroll: false });
      }
    } else {
      this.toast.error("Failed to fetch data");
    }

    throw error;
  }

  async login(username: string, password: string) {
    try {
      const response = await this.client.post<TokenResponse>(`/client/token`, {
        username: username,
        password: password,
      });
      return response.data;
    } catch (error) {
      this.handle_error(error);
    }
  }

  async get_projects() {
    try {
      const response = await this.client.get<ProjectResponse[]>(
        `/client/project`
      );
      return response.data;
    } catch (error) {
      this.handle_error(error);
    }
  }

  async get_logs(page: number, size: number) {
    try {
      const response = await this.client.get<LogsResponse>(`/client/logs`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      this.handle_error(error);
    }
  }

  async edit_project(
    id: string,
    title: string,
    description: string,
    change_secret: boolean
  ) {
    try {
      const response = await this.client.put<ProjectResponse>(
        `/client/project/${id}`,
        {
          title: title,
          description: description,
          change_secret: change_secret,
        }
      );
      return response.data;
    } catch (error) {
      this.handle_error(error);
    }
  }

  async delete_log(id: string) {
    try {
      await this.client.delete(`/client/log/${id}`);
      return true;
    } catch (error) {
      this.handle_error(error);
    }
  }

  async delete_project(id: string) {
    try {
      await this.client.delete(`/client/project/${id}`);
      return true;
    } catch (error) {
      this.handle_error(error);
    }
  }

  async create_project(title: string, description: string) {
    try {
      const response = await this.client.post(`/client/project`, {
        title: title,
        description: description,
      });
      return response.data;
    } catch (error) {
      this.handle_error(error);
    }
  }

  async clear_logs() {
    try {
      await this.client.delete(`/client/logs/clear`);
      return true;
    } catch (error) {
      this.handle_error(error);
    }
  }
}

export default HttpClient;
