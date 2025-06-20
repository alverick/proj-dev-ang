export const SettingOptions = {
  onBoarding: 'ob',
  commissions: 'commissions',
} as const;
export const Sections = {
  movements: 'mov',
} as const;
export const Status = {
  saved: 1,
} as const;
export type SettingOptionsType =
  (typeof SettingOptions)[keyof typeof SettingOptions];
export type SectionsType = (typeof Sections)[keyof typeof Sections];
type StatusType = (typeof Status)[keyof typeof Status];
export type Settings = Record<
  string,
  Record<string, Record<SectionsType, StatusType>>
>;
export const StorageSettings = 'settings';
