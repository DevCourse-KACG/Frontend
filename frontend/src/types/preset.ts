export interface PresetItem {
  id: number;
  content: string;
  category: Category;
  sequence: number;
}

export interface Preset {
  id: number;
  name: string;
  presetItems: PresetItem[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PresetListResponse {
  code: number;
  message: string;
  data: Preset[];
}

export interface ApiErrorResponse {
  code: number;
  message: string;
  data: null;
}

export type Category = 'PREPARATION' | 'RESERVATION' | 'PRE_WORK' | 'ETC';

// 자바 DTO에 맞는 요청 타입
export interface PresetWriteReqDto {
  name: string;
  presetItems: PresetItemWriteReqDto[];
}

export interface PresetItemWriteReqDto {
  content: string;
  category: Category;
  sequence: number;
} 