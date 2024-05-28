
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

interface WidgetResponse{
  id : string,
  name : string,
  project_id : string,
  title : string,
  type : number,
  content : TextWidgetContent
}

interface TextWidgetContent{
  text : string
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

export type {TokenResponse,ProjectResponse,LogsResponse,LogData,WidgetResponse}
export {return_data}
