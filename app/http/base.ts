
interface Response<T> {
  success: boolean;
  data?: T | undefined;
  error?: string | undefined;
}

interface TokenResponse{
    access_token : string
}

interface ProjectResponse{
    id : string
    title : string
    description : string
    functions : Object
    secret : string,
    create_at : number,
    active_time : number,
    up_time : number,
    is_ready : boolean
    is_active : boolean
}

interface LogsResponse{
  total_pages : number
  data : LogData[]
}

interface LogData{
  id : string,
  project_id : string,
  project_name : string,
  level : number
  create_at : number
  content : string
}


interface TextWidgetContent{
  text : string
}

interface ProgressWidgetContent{
  amont : number
}

interface TextWidgetContent {
  text: string;
}

interface ProgressWidgetContent {
  progress: number;
}

interface BaseWidgetResponse {
  id: string;
  name: string;
  project_id: string;
  title: string;
}

interface TextWidgetResponse extends BaseWidgetResponse {
  type: 0;
  content: TextWidgetContent;
}

interface ProgressWidgetResponse extends BaseWidgetResponse {
  type: 1;
  content: ProgressWidgetContent;
}

type WidgetResponse = TextWidgetResponse | ProgressWidgetResponse;

interface UserResponse{
  id : string
  username : string
  is_owner : boolean
  is_admin : boolean
}

function return_data<T>(success: boolean, data: T | undefined = undefined,error : string | undefined = undefined) {
  if (success) {
    
    const response: Response<T> = {
      success: success,
      data: data,
    };

    return response;
  } else {
    const response: Response<T> = {
      success: success,
      error: error,
    };

    return response;
  }
}

export type {TokenResponse,ProjectResponse,LogsResponse,LogData,WidgetResponse,UserResponse}
export {return_data}
