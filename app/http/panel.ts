"use client";

import axios, { AxiosError } from "axios";
import { LogsResponse, ProjectResponse, base_url, return_data } from "./base";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

class PanelHttp {
  router: AppRouterInstance;
  token: string;

  constructor(router: AppRouterInstance,token : string) {
    this.router = router;
    this.token = token
  }

  unauthorized_token() {
    localStorage.removeItem("token");
    setTimeout(() => {
      this.router.push("/login");
    }, 1000);
  }
  async get_projects() {
    console.log(this.token);
    try {
      const projectRequest = await axios.get<ProjectResponse[]>(
        `${base_url}/client/project`,
        {
          headers: {
            Authorization: this.token,
          },
        }
      );

      return return_data<ProjectResponse[]>(true, projectRequest.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status == 401) {
          this.unauthorized_token();
        }
      }

      return return_data(false, undefined, "Faild to fetch data");
    }
  }

  async get_logs(page: number, size: number) {
    console.log(this.token);
    try {
      const logsRequest = await axios.get<LogsResponse>(
        `${base_url}/client/logs`,
        {
          params: {
            page: page,
            size: size,
          },
          headers: {
            Authorization: this.token,
          },
        }
      );

      return return_data<LogsResponse>(true, logsRequest.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status == 401) {
          this.unauthorized_token();
        }
      }

      return return_data(false, undefined, "Faild to fetch data");
    }
  }

  async edit_project(
    id: string,
    title: string,
    description: string,
    change_secret: boolean
  ) {
    try {
      await axios.put(
        `${base_url}/client/project/${id}`,
        {
          title: title,
          description: description,
          change_secret: change_secret,
        },
        {
          headers: {
            Authorization: this.token,
          },
        }
      );

      return return_data(true, "Project edited", undefined);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status == 401) {
          this.unauthorized_token();
        } else if (error.response?.status == 400) {
          return return_data(false, undefined, error.response.data.detail);
        }
      }

      return return_data(false, undefined, "Faild to fetch data");
    }
  }

  async delete_log(id: string) {
    try {
      await axios.delete(
        `${base_url}/client/log/${id}`,

        {
          headers: {
            Authorization: this.token,
          },
        }
      );

      return return_data(true, "Log deleted", undefined);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status == 401) {
          this.unauthorized_token();
        } else if (error.response?.status == 400) {
          return return_data(false, undefined, error.response.data.detail);
        }
      }

      return return_data(false, undefined, "Faild to fetch data");
    }
  }

  async delete_project(id: string) {
    try {
      await axios.delete(
        `${base_url}/client/project/${id}`,

        {
          headers: {
            Authorization: this.token,
          },
        }
      );

      return return_data(true, "Project deleted", undefined);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status == 401) {
          this.unauthorized_token();
        }
      }

      return return_data(false, undefined, "Faild to fetch data");
    }
  }

  async create_project(title: string, description: string) {
    try {
      await axios.post(
        `${base_url}/client/project`,
        {
          title: title,
          description: description,
        },
        {
          headers: {
            Authorization: this.token,
          },
        }
      );

      return return_data(true, "Project created", undefined);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status == 401) {
          this.unauthorized_token();
        }
      }

      return return_data(false, undefined, "Faild to fetch data");
    }
  }

  async clear_logs() {
    try {
      await axios.delete(
        `${base_url}/client/logs/clear`,

        {
          headers: {
            Authorization: this.token,
          },
        }
      );

      return return_data(true, "Logs cleared", undefined);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status == 401) {
          this.unauthorized_token();
        }
      }

      return return_data(false, undefined, "Faild to fetch data");
    }
  }
}

export default PanelHttp;
