export const SettingOptions = {
  onBoarding: 'ob',
} as const;
export const Sections = {
  movements: 'mov',
} as const;
export const Status = {
  saved: 1,
} as const;
type SettingOptionsType = (typeof SettingOptions)[keyof typeof SettingOptions];
type SectionsType = (typeof Sections)[keyof typeof Sections];
type StatusType = (typeof Status)[keyof typeof Status];
export type Settings = Record<
  string,
  Record<SettingOptionsType, Record<SectionsType, StatusType>>
>;
export const StorageSettings = 'settings';
