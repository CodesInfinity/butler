export interface DeviceResponse {
  connected: boolean;
  device_id: string | null;
  name: string | null;
  storage_total: number | null;
  storage_free: number | null;
  message: string;
}

export interface PhotoFile {
  name: string;
  size: number;
  type: string;
  date: number;
  id: number;
}

export interface GalleryResponse {
  success: boolean;
  files: PhotoFile[] | null;
  error: string | null;
}