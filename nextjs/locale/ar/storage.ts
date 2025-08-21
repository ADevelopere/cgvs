import StorageTranslations from "../components/Storage";

const arStorageTranslations: StorageTranslations = {
	failedListFiles: "فشل في جلب قائمة الملفات",
	failedFetchStorageStats: "فشل في جلب إحصائيات التخزين",
	uploadNotAllowed: "لا يسمح بالرفع في هذا الموقع. الرجاء التوجه إلى موقع آخر.",
	uploadCancelled: "تم إلغاء الرفع",
	uploadFailed: "فشل الرفع",
	failedRename: "فشل إعادة التسمية",
	failedDelete: "فشل الحذف",
	noFailedUploads: "لا توجد تحميلات فاشلة لإعادة المحاولة",
	fileAlreadyExists: "ملف بنفس الاسم موجود بالفعل",
	failedGenerateSignedUrl: "فشل في إنشاء رابط التحميل الموقَّع",
	uploadStarted: "بدأ الرفع",
	uploadCompleted: "اكتمل الرفع",
	uploadProgress: "تقدّم الرفع: %{progress}%",

	// Additional keys used by the context
	renameSuccess: "تمت إعادة التسمية بنجاح",
	deleteSuccess: "تم الحذف بنجاح",
	uploadBlockedByCors: "تم حظر الرفع بسبب سياسات CORS. تحقق من إعدادات cors/README.md.",
	retryCompleted: "اكتملت إعادة المحاولة",
	retryFailed: "فشلّت إعادة المحاولة",
	uploadSuccessCount: "%{count} ملف(ملفات) تم رفعها بنجاح",
	uploadFailedCount: "%{count} ملف(ملفات) فشل رفعها",
    uploadFailedWithStatus: "فشل الرفع مع الحالة %{status}",
    networkErrorDuringUpload: "خطأ في الشبكة أثناء الرفع",
// `Upload failed for ${file.name}. Status: ${status} ${statusText}. Response: ${resp || "No response text."}`;
	uploadFailedForFile: "فشل الرفع لملف %{fileName}. الحالة: %{status} %{statusText}. الاستجابة: %{resp}.",
    noResponseText: "لا توجد نصوص استجابة.",
    internalUploadError: "خطأ داخلي أثناء الرفع.",
};

export default arStorageTranslations;