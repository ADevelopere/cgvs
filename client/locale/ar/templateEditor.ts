import {
  TemplateEditorTranslations,
  MiscellaneousPanelTranslations,
  TemplateEditorPaneTranslations,
  AddNodePanelTranslations
} from "../components";

const miscellaneousPanel: MiscellaneousPanelTranslations = {
  // tabs
  configTab: "الإعدادات",
  elementsTab: "المكونات",
  currentElementTab: "المحدد",
};

const templateEditorPane: TemplateEditorPaneTranslations = {
  miscellaneousPane: "الإعدات",
  addNodePane: "إضافة مكون",
};

export const templateEditor: TemplateEditorTranslations = {
  templateEditorPane,
  miscellaneousPanel,
  addNodePanel: {
    items: {
      student: "الطالب",
      certificate: "الشهادة",
      variable: "المتغير",
      image: "الصورة",
    },
    studentOptions: {
      title: "حقول الطالب",
      name: "اسم الطالب",
      email: "بريد الطالب",
      dateOfBirth: "تاريخ الميلاد",
      age: "العمر",
      gender: "الجنس",
      nationality: "الجنسية",
      country: "الدولة",
    },
    certificateOptions: {
      title: "حقول الشهادة",
      verificationCode: "رمز التحقق",
      qrCode: "رمز QR",
    },
    variableOptions: {
      title: "المتغيرات",
      text: "متغير نصي",
      date: "متغير تاريخ",
      number: "متغير رقمي",
    },
  } as AddNodePanelTranslations,
};
