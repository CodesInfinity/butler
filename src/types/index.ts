export interface MobileFile {
  id: string;
  name: string;
  size_mb: number;
  type: "image" | "video";
  preview_url: string;
}

export interface DeviceStorage {
  total_space: number; // en GB
  used_space: number;  // en GB
  photos_count: number;
  videos_count: number;
}

export interface DeviceData {
  device_name: string;
  storage: DeviceStorage;
  files: MobileFile[];
}
