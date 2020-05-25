import { request } from 'umi';
import { ListParams, ListItem } from '@/pages/article/data.d';

export async function queryRule(params?: ListParams) {
  return request('/api/article', {
    params,
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/article', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: ListItem) {
  return request('/api/article', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: ListParams) {
  return request('/api/article', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
