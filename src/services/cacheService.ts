import request from '@/utils/request'

export async function querySysParam (param: { paramFat: string; paramRoot: string }) {
  return await request('/api/sysparam/querySysParam', {
    params: param,
  })
}

export async function requestForDeleteCache(data: string) {
  // 接口待对接
  return await request('/api/xxx', {
    method: 'POST',
    data: {
      // param: data
    }
  })
}