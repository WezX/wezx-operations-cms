import {ImageType} from '@/components/InputSurface'

export interface ListItem {
  key: number | '';
  title: string;
  status: number; // 0 , 1
  date: string;
  deadDate: string;
  updateDate: string;
  province: string;
  city: string;
  author: string;
  surface: ImageType;
  content: string;
}

export interface ListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface ListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface ListParams {
  sorter?: string;
  status?: string;
  title?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  article?: ListItem;
}
