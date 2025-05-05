enum AppLanguage {
  default = "ar",
  en = "en",
  id = "id",
}

export type MultilanguageText = Partial<Record<AppLanguage, string>>;

export default AppLanguage;
