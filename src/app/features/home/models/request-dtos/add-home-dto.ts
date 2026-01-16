export interface AddHomeDto {
  homeName: string;
  homeInfo: string | null;
  latitude: number;
  longitude: number;
  ISO3166_2_lvl4: string;
  country: string;
  state: string;
  address: string;
}
