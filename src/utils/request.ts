import type {Canceler, CancelToken, RequestResponse} from 'umi-request';
import Request, {extend} from 'umi-request';

/**
 * 验证ajax请求异常, 是否为网络请求超时异常
 * @param error ajax异常
 */
function validateExpIsTimeout(error: any) {
    const {message, name, request} = error;
    if (
        message.indexOf('timeout of') >= 0 &&
        message.indexOf('exceeded') >= 0 &&
        name === 'RequestError' &&
        request
    ) {
        return true;
    }
    return false;
}

/**
 * 判断ajax响应状态码是否为500
 * @param e ajax异常
 */
function validateExpIsServer500(e: any) {
    if (e.response?.status === 500) {
        console.error(
            `后端服务:[${e.response.url}] HTTP响应: status:[${
                e.response.status
            }] statusText:[${e.response.statusText}], 具体响应数据:${JSON.stringify(
                e.data,
            )}`,
        );
        return true;
    }
    return false;
}

/**
 * 统一异常处理
 * @param e
 */
function errorHandler(e: any) {
    if (Request.isCancel(e)) {
        console.warn(e.message);
    } else if (validateExpIsTimeout(e)) {
        console.error('ajax请求超时异常', e.timeout, e.name, e.message, e.request);
    } else if (validateExpIsServer500(e)) {
        console.log(e.response);
    } else {
        throw e;
    }
}

const request = extend({
    getResponse: true,
    errorHandler,
});

export default request;

/**
 * 丢弃旧请求
 */
export const DISCARD_OLD: AntiReplayModel = 'DiscardOld';
/**
 * 丢弃新请求
 */
export const DISCARD_NEW: AntiReplayModel = 'DiscardNew';
/**
 * ajax请求参数
 */
type AjaxRequestParams = {
    /**
     * 请求地址
     */
    url: string;
    /**
     * 提交的数据
     */
    data?: any;
    /**
     * 额外的请求头参数
     */
    headers?: HeadersInit;
    /**
     * 超时时间(单位:毫秒)
     */
    timeout?: number;
    /**
     * 自定义异常处理
     * @param error
     */
    errorHandler?: (error: any) => void;
};
/**
 * 防重模式: undefined: 不启用. DiscardOld: 丢弃旧的. DiscardNew:丢弃新的
 */
type AntiReplayModel = undefined | 'DiscardOld' | 'DiscardNew';
/**
 * 请求与传参方式: get: get请求. post-form: post请求表单传参. post-body: post请求, request body传参. delete:delete请求. put:put请求
 */
type RequestMethodAndTrans =
    | 'get'
    | 'post-form'
    | 'post-body'
    | 'delete'
    | 'put';
/**
 * ajax取消信息
 */
type AjaxCanceler = {
    clientId: number;
    cancel: Canceler;
    data: any;
};

type CancelTokenInfo = {
    /**
     * 是否还需要执行当前ajax请求
     */
    executingAjax: boolean;
    /**
     * 用于取消ajax请求的token
     */
    cancelToken?: CancelToken;
};
const ajaxExecutingMap = new Map<string, AjaxCanceler>();

/**
 * 构建ajax请求选项
 * @param requestParam
 * @param cancelToken
 * @param requestType
 */
function buildRequestOption(
    requestParam: AjaxRequestParams,
    cancelToken?: CancelToken,
    requestType?: 'form' | 'json',
) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const {data = {}, headers = {}, timeout, errorHandler} = requestParam;
    let params;
    let bodyData;
    if (requestType === 'form') {
        params = data;
    } else {
        bodyData = data;
    }
    if (errorHandler) {
        return {
            cancelToken,
            params,
            data: bodyData,
            headers,
            timeout,
            requestType,
            errorHandler,
        };
    }
    return {
        cancelToken,
        params,
        data: bodyData,
        headers,
        timeout,
        requestType,
    };
}

/**
 * 构建用于取消ajax请求的token
 * @param data 当此请求的请求数据
 * @param clientId 客户端唯一标识, 用于防止清除了其它请求的防重缓存
 * @param ajaxKey 当前ajax请求的标识(用于防重)
 * @param antiReplayModel 防重模式. 无值表示不启用, DiscardOld表示丢弃旧请求, DiscardNew表示丢弃新请求
 */
function buildCancelToken(
    data: any,
    clientId: number,
    ajaxKey: string,
    antiReplayModel?: AntiReplayModel,
): CancelTokenInfo {
    let cancelToken: CancelToken | undefined;
    if (antiReplayModel) {
        const oldAjaxCanceler = ajaxExecutingMap.get(ajaxKey);
        if (oldAjaxCanceler) {
            if (antiReplayModel === DISCARD_NEW) {
                // 当前防重模式为: 丢弃新的
                return {executingAjax: false};
            }
            if (antiReplayModel === DISCARD_OLD) {
                // 当前防重模式为: 丢弃旧的, 因此要将旧请求取消
                oldAjaxCanceler.cancel(
                    `旧的请求: ${ajaxKey} 被取消, 请求参数:${JSON.stringify(
                        oldAjaxCanceler.data,
                    )}`,
                );
                ajaxExecutingMap.delete(ajaxKey);
            }
        }
        const {token, cancel} = Request.CancelToken.source();
        cancelToken = token;
        ajaxExecutingMap.set(ajaxKey, {clientId, cancel, data});
    }
    return {executingAjax: true, cancelToken};
}

/**
 * 构建clientId和ajax缓存key
 * @param url 当前请求的url
 * @param requestMethod 请求方法以及数据传输方式
 */
function buildClientIdAndAjaxKey(
    url: string,
    requestMethod: RequestMethodAndTrans,
) {
    const clientId = new Date().getTime();
    let ajaxKey ;
    switch (requestMethod) {
        case 'post-form': {
            ajaxKey = `POST Form: ${url}`;
            break;
        }
        case 'post-body': {
            ajaxKey = `POST Body: ${url}`;
            break;
        }
        case 'delete': {
            ajaxKey = `DELETE: ${url}`;
            break;
        }
        case 'put': {
            ajaxKey = `PUT: ${url}`;
            break;
        }
        default: {
            ajaxKey = `GET: ${url}`;
        }
    }
    return {clientId, ajaxKey};
}

function finallyCall(
    clientId: number,
    ajaxKey: string,
    antiReplayModel?: AntiReplayModel,
) {
    if (antiReplayModel) {
        if (clientId === ajaxExecutingMap.get(ajaxKey)?.clientId) {
            ajaxExecutingMap.delete(ajaxKey);
        }
    }
}

/**
 * 执行post请求传统form方式传参
 * @param requestParam
 * @param antiReplayModel 反重放模式: 可选(默认:不启用). DiscardOld: 丢弃旧请求 DiscardNew: 丢弃新请求
 * @return 当去重模式为:DiscardNew时, 新请求返回的就是undefined, 当请求模式是:DiscardOld时, 旧请求返回的就是undefined, 当ajax客户端设置了超时时间, 且在超时时间内未返回的, 该ajax请求返回的值就是undefined, 当存在异常处理函数, 且将异常捕获后未返回任何值, 也未再次将抛出异常, 则请求返回的结果也是undefined
 */
function postForm<T>(
    requestParam: AjaxRequestParams,
    antiReplayModel?: AntiReplayModel,
): void | Promise<RequestResponse<T>> {
    const {url, data} = requestParam;
    const {clientId, ajaxKey} = buildClientIdAndAjaxKey(url, 'post-form');
    const {executingAjax, cancelToken} = buildCancelToken(
        data,
        clientId,
        ajaxKey,
        antiReplayModel,
    );
    console.log('ajaxExecutingMap', ajaxExecutingMap);
    if (!executingAjax) {
        return;
    }
    // eslint-disable-next-line consistent-return
    return request
        .post(url, buildRequestOption(requestParam, cancelToken, 'form'))
        .finally(() => {
            finallyCall(clientId, ajaxKey, antiReplayModel);
        });
}

/**
 * 执行post请求request body方式传参
 * @param requestParam 请求参数
 * @param antiReplayModel 防重模式
 */
function postBody<T>(
    requestParam: AjaxRequestParams,
    antiReplayModel?: AntiReplayModel,
): void | Promise<RequestResponse<T>> {
    const {url, data = {}} = requestParam;
    const {clientId, ajaxKey} = buildClientIdAndAjaxKey(url, 'post-body');
    const {executingAjax, cancelToken} = buildCancelToken(
        data,
        clientId,
        ajaxKey,
        antiReplayModel,
    );
    if (!executingAjax) {
        return;
    }
    // eslint-disable-next-line consistent-return
    return request
        .post(url, buildRequestOption(requestParam, cancelToken, 'json'))
        .finally(() => {
            finallyCall(clientId, ajaxKey, antiReplayModel);
        });
}

/**
 * 执行put请求request body方式传参
 * @param requestParam 请求参数
 * @param antiReplayModel 防重模式
 */
function put<T>(
    requestParam: AjaxRequestParams,
    antiReplayModel?: AntiReplayModel,
): void | Promise<RequestResponse<T>> {
    const {url, data = {}} = requestParam;
    const {clientId, ajaxKey} = buildClientIdAndAjaxKey(url, 'post-body');
    const {executingAjax, cancelToken} = buildCancelToken(
        data,
        clientId,
        ajaxKey,
        antiReplayModel,
    );
    if (!executingAjax) {
        return;
    }
    // eslint-disable-next-line consistent-return
    return request
        .put(url, buildRequestOption(requestParam, cancelToken, 'json'))
        .finally(() => {
            finallyCall(clientId, ajaxKey, antiReplayModel);
        });
}

/**
 * 执行get请求
 * @param requestParam 请求参数
 * @param antiReplayModel 防重模式
 */
function get<T>(
    requestParam: AjaxRequestParams,
    antiReplayModel?: AntiReplayModel,
): void | Promise<RequestResponse<T>> {
    const {url, data = {}} = requestParam;
    const {clientId, ajaxKey} = buildClientIdAndAjaxKey(url, 'post-body');
    const {executingAjax, cancelToken} = buildCancelToken(
        data,
        clientId,
        ajaxKey,
        antiReplayModel,
    );
    if (!executingAjax) {
        return;
    }
    // eslint-disable-next-line consistent-return
    return request.get(url, buildRequestOption(requestParam, cancelToken));
}

/**
 * 执行delete请求
 * @param requestParam 请求参数
 * @param antiReplayModel 防重模式
 */
function deleteReq<T>(
    requestParam: AjaxRequestParams,
    antiReplayModel?: AntiReplayModel,
): void | Promise<RequestResponse<T>> {
    const {url, data = {}} = requestParam;
    const {clientId, ajaxKey} = buildClientIdAndAjaxKey(url, 'post-body');
    const {executingAjax, cancelToken} = buildCancelToken(
        data,
        clientId,
        ajaxKey,
        antiReplayModel,
    );
    if (!executingAjax) {
        return;
    }
    // eslint-disable-next-line consistent-return
    return request.delete(url, buildRequestOption(requestParam, cancelToken));
}

/**
 * 获取api的实际响应数据
 * @param serverResponse web服务器返回的完整数据
 */
function getWebApiData<T>(serverResponse: RequestResponse<T>) {
    return serverResponse.data;
}

export const AjaxUtil = {
    /**
     * 发起post请求,使用表单传参
     */
    postForm,
    /**
     * 发起post请求,使用request body传参
     */
    postBody,
    /**
     * 发起put请求
     */
    put,
    /**
     * 发起get请求
     */
    get,
    /**
     * 发起delete请求
     */
    deleteReq,
    /**
     * 防重模式
     */
    AntiReplayModel: {DISCARD_OLD, DISCARD_NEW},
    /**
     * 判断ajax请求异常,是否为超时异常
     */
    validateExpIsTimeout,
    /**
     * 判断ajax请求异常,是否为服务端500异常
     */
    validateExpIsServer500,
    /**
     * 获取api的响应数据
     */
    getWebApiData
};

export interface WebApiData<T> {
    status: string;
    code: number;
    data: T;
}
