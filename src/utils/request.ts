import axios from "axios";
import qs from "qs";

export interface VictoryResult {
  CODE: string;
  MSG: string;
  DATA?: any;
  // 老接口的数据
  data?: any;
  message?: string;
  result?: number;
  resultCode?: string;
  msg?: string;
}
export interface VictoryResultOld {
  data?: any;
  message: string;
  result: number;
}

export function isResponseOK(result: VictoryResult) {
  return result && result.CODE === "00";
}
export function isResponseOKOld(result: VictoryResult) {
  return result && result.result === 1;
}

export function isBusinessError(result: any = {}) {
  return (
    result &&
    (Object.keys(result).some(n => n === "CODE") || // 新接口
      Object.keys(result).some(n => n === "result")) // 老接口
  );
}

//请求方式
export enum RequestMethod {
  post = "post",
  get = "get"
}

export enum ContentType {
  JSON = "application/json;charset=UTF-8",
  XWWWFORMURLENCODED = "application/x-www-form-urlencoded"
}

/**
 * loading: 是否loading，默认true
 * requestConfig: 请求配置，设置http头之类的
 */
export type optionsType = {
  loading?: boolean; // default true
  requestConfig?: any;
  displayErrorToast?: boolean; // default true
  requestMethod?: string; // default RequestMethod.post
  handleResponseOk?: Function; // 处理responseOK 默认是responseOK
  "content-type"?: ContentType;
};

function handleResponse(
  res: any,
  displayErrorToast: boolean,
  handleResponseOK: Function
) {
  const { data } = res;
  if (handleResponseOK(data)) {
    return data as VictoryResult;
  } else {
    if (displayErrorToast) {
      alert(data.MSG || "服务异常");
    }
    throw data as VictoryResult;
  }
}

function handleError(error: any, displayErrorToast: boolean) {
  console.warn(error);
  if (displayErrorToast && !isBusinessError(error)) {
    alert("网络异常");
  }
}

export default function fetchData(
  urlConfig: string,
  requestData?: Record<string, any>,
  options?: optionsType,
  isMock = false
): Promise<VictoryResult> | never {
  const defaultOptions = {
    loading: true,
    requestConfig: { timeout: 20000 },
    displayErrorToast: true
  };
  options = { ...defaultOptions, ...options };
  const displayErrorToast = options.displayErrorToast || false;
  const loading = options.loading;

  const contentType = options["content-type"]
    ? options["content-type"]
    : ContentType.XWWWFORMURLENCODED;
  const realRequestData =
    contentType === ContentType.JSON
      ? requestData
      : qs.stringify(requestData || {});

  // 构造请求 header
  const requestConfig = options.requestConfig || {};
  const defaultHeaders = {
    "content-type": contentType
  };
  const realRequestConfig = {
    ...requestConfig,
    ...{ headers: { ...defaultHeaders, ...requestConfig.headers } }
  };
  const requestMethod = options.requestMethod || RequestMethod.post;
  const handleResponseOK = options.handleResponseOk || isResponseOK;
  if (requestMethod === RequestMethod.get) {
    return axios
      .get(urlConfig, {
        headers: { ...defaultHeaders, ...requestConfig.headers },
        params: requestData,
        timeout: 20000
      })
      .then((res: any) => {
        return handleResponse(res, displayErrorToast, handleResponseOK);
      })
      .catch((error: any) => {
        handleError(error, displayErrorToast);
        throw error;
      });
  } else {
    return axios
      .post(urlConfig, realRequestData, realRequestConfig)
      .then((res: any) => {
        return handleResponse(res, displayErrorToast, handleResponseOK);
      })
      .catch((error: any) => {
        handleError(error, displayErrorToast);
        throw error;
      });
  }
}