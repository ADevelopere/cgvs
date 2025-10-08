import { StorageTranslations } from "../components";

export const storage: StorageTranslations = {
    uploading: {
        cancelAllUploads: "إلغاء جميع التحميلات",
        cancelAllUploadsMessage:
            "هل أنت متأكد أنك تريد إلغاء جميع التحميلات؟ لا يمكن التراجع عن هذا الإجراء.",
        cancelFileUpload: "إلغاء تحميل الملف",
        cancelFileUploadMessage:
            'هل أنت متأكد أنك تريد إلغاء تحميل "%{fileName}"? لا يمكن التراجع عن هذا الإجراء.',
        keepUploading: "متابعة التحميل",
        cancelUpload: "إلغاء التحميل",
        cancelUploadOf: "إلغاء تحميل %{fileName}",
        noUploads: "لا توجد تحميلات",
        uploading1Item: "جاري تحميل عنصر واحد",
        uploadingNItems: "جاري تحميل %{count} عناصر",
        expandUploadDetails: "توسيع تفاصيل التحميل",
        collapseUploadDetails: "طي تفاصيل التحميل",
        closeUploadProgress: "إغلاق تقدم التحميل",
        secondsLeft: "%{seconds} ثانية متبقية...",
        minutesLeft: "%{minutes} دقيقة متبقية...",
        hoursLeft: "%{hours} ساعة",
        minutesLeftShort: "%{minutes} دقيقة متبقية...",
        cancel: "إلغاء",
        fileAlreadyExists: "الملف موجود بالفعل",
        failedGenerateSignedUrl: "فشل في إنشاء عنوان URL موقّع",
        uploadCancelled: "تم إلغاء التحميل",
        uploadFailedWithStatus: "فشل التحميل مع الحالة: %{status}",
        uploadFailed: "فشل التحميل",
        uploadCompleted: "اكتمل التحميل",
        uploadNotAllowed: "التحميل غير مسموح به",
        uploadSuccessCount: "نجح تحميل %{count} ملفات",
        uploadFailedCount: "فشل تحميل %{count} ملفات",
        noFailedUploads: "لا توجد تحميلات فاشلة",
        retryCompletedUploads: "إعادة محاولة التحميلات المكتملة",
        retryFailedUploads: "إعادة محاولة التحميلات الفاشلة",
        retryUploads: "إعادة محاولة التحميلات",
    },
    management: {
        // Data fetching error messages
        failedToFetchFileList: "فشل في جلب قائمة الملفات",
        failedToFetchDirectoryContents: "فشل في جلب محتويات المجلد",
        failedToFetchStorageStatistics: "فشل في جلب إحصائيات التخزين",

        // File operation success messages
        successfullyRenamedTo: 'تم إعادة تسمية الملف بنجاح إلى "%{newName}"',
        successfullyCreatedFolder: 'تم إنشاء المجلد "%{name}" بنجاح',
        successfullyDeleted: "تم حذف %{count} عنصر بنجاح",
        successfullyMoved: "تم نقل %{count} عنصر بنجاح",
        successfullyMovedPartial:
            "تم نقل %{successCount} عنصر، فشل في نقل %{failureCount}. الأخطاء: %{errors}",
        successfullyCopied: "تم نسخ %{count} عنصر بنجاح",
        successfullyCopiedPartial:
            "تم نسخ %{successCount} عنصر، فشل في نسخ %{failureCount}. الأخطاء: %{errors}",

        // File operation error messages
        failedToRenameFile: "فشل في إعادة تسمية الملف",
        failedToCreateFolder: "فشل في إنشاء المجلد",
        failedToDeleteItems: "فشل في حذف العناصر",
        deletedPartial:
            "تم حذف %{successCount} عنصر، فشل في حذف %{failureCount}. الأخطاء: %{errors}",
        failedToMoveItems: "فشل في نقل العناصر",
        movedPartial:
            "تم نقل %{successCount} عنصر، فشل في نقل %{failureCount}. الأخطاء: %{errors}",
        failedToCopyItems: "فشل في نسخ العناصر",
        copiedPartial:
            "تم نسخ %{successCount} عنصر، فشل في نسخ %{failureCount}. الأخطاء: %{errors}",
        failedToSearchFiles: "فشل في البحث عن الملفات",

        // Generic terms
        items: "عناصر",
        item: "عنصر",
        errors: "أخطاء",
    },
    ui: {
        // Navigation error messages
        failedToNavigateToDirectory: "فشل في التنقل إلى المجلد",
        failedToRefreshDirectory: "فشل في تحديث المجلد",
        searchFailed: "فشل البحث",

        // Loading states
        loadingFolderContents: "جاري تحميل محتويات المجلد",
        folderExpanded: "تم توسيع المجلد، %{count} عنصر",

        // View mode and sorting
        gridView: "عرض الشبكة",
        listView: "عرض القائمة",
        sortBy: "ترتيب حسب",
        sortByName: "ترتيب حسب الاسم",
        sortBySize: "ترتيب حسب الحجم",
        sortByLastModified: "ترتيب حسب آخر تعديل",
        sortByCreated: "ترتيب حسب تاريخ الإنشاء",
        sortByType: "ترتيب حسب النوع",
        ascending: "تصاعدي",
        descending: "تنازلي",
        name: "الاسم",
        size: "الحجم",
        lastModified: "آخر تعديل",
        createdAt: "تاريخ الإنشاء",

        // Empty states and messages
        emptyFolder: "هذا المجلد فارغ",
        tryDifferentSearch: "جرب مصطلح بحث مختلف",
        uploadOrCreate: "ارفع ملفات أو أنشئ مجلد جديد",
        searching: "جاري البحث...",

        // Selection and clipboard
        selectAll: "تحديد الكل",
        clearSelection: "إلغاء التحديد",
        selectedItems: "%{count} عنصر محدد",
        copyItems: "نسخ العناصر",
        cutItems: "قص العناصر",
        pasteItems: "لصق العناصر",
        noItemsInClipboard: "لا توجد عناصر في الحافظة",
        itemsCopied: "تم نسخ %{count} عنصر",
        itemsCut: "تم قص %{count} عنصر",

        // Search
        searchPlaceholder: "البحث في الملفات والمجلدات...",
        searchResults: "%{count} نتيجة بحث",
        noSearchResults: "لا توجد نتائج بحث",
        exitSearchMode: "إنهاء وضع البحث",
        searchInFolder: "البحث في %{folderName}",
        item: "عنصر",
        items: "عناصر",

        // Tree navigation
        expandFolder: "توسيع المجلد",
        collapseFolder: "طي المجلد",
        noFoldersFound: "لم يتم العثور على مجلدات",
        searchFolders: "البحث في المجلدات...",

        // Filter and view controls
        filters: "المرشحات",
        activeFilters: "المرشحات النشطة",
        allDates: "جميع التواريخ",
        today: "اليوم",
        last7Days: "آخر 7 أيام",
        last30Days: "آخر 30 يوم",
        thisYear: "هذا العام",
        lastYear: "العام الماضي",
        customDateRange: "نطاق تاريخ مخصص",
        searchTerm: "مصطلح البحث",
        filterByType: "تصفية حسب النوع",
        filterByDate: "تصفية حسب التاريخ",
        clearFilters: "مسح المرشحات",
        showFilters: "إظهار المرشحات",
        hideFilters: "إخفاء المرشحات",

        // Accessibility
        focusedItem: "العنصر المحدد: %{itemName}",
        navigationInstructions:
            "استخدم مفاتيح الأسهم للتنقل، مسافة للتحديد، Enter للفتح",
        keyboardShortcuts: "اختصارات لوحة المفاتيح",

        // Context menu actions
        open: "فتح",
        rename: "إعادة تسمية",
        delete: "حذف",
        copy: "نسخ",
        cut: "قص",
        paste: "لصق",
        download: "تحميل",
        getInfo: "معلومات",
        newFolder: "مجلد جديد",
        uploadFiles: "رفع ملفات",
        refresh: "تحديث",
        moveTo: "نقل إلى",

        // Dialog messages
        deleteConfirmation: 'حذف "%{fileName}"',
        deleteConfirmationMessage:
            'هل أنت متأكد أنك تريد حذف "%{fileName}"؟ لا يمكن التراجع عن هذا الإجراء.',

        // Rename dialog
        renameDialogTitle: "إعادة تسمية",
        renameDialogLabel: "الاسم الجديد",
        renameDialogOk: "موافق",
        renameDialogCancel: "إلغاء",
        renameDialogEmpty: "الاسم لا يمكن أن يكون فارغاً",
        renameDialogInvalid: "الاسم يحتوي على أحرف غير صالحة",
        renameDialogFailedToRename:
            "فشل في إعادة تسمية العنصر. يرجى المحاولة مرة أخرى.",
        renameDialogUnexpectedError:
            "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        //rename dialog end

        // Delete dialog
        deleteDialogFailedToDelete:
            "فشل في حذف العنصر. يرجى المحاولة مرة أخرى.",
        deleteDialogUnexpectedError:
            "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        // Delete dialog end

        // Move to dialog
        moveDialogTitle: "نقل العناصر",
        moveDialogSelectDestination: "اختر مجلد الوجهة",
        moveDialogRoot: "الجذر",
        moveDialogGoUp: "الصعود للأعلى",
        moveDialogRefresh: "تحديث",
        moveDialogNoFolders: "لم يتم العثور على مجلدات",
        moveDialogInvalid: "غير صالح",
        moveDialogCannotMoveHere: "لا يمكن نقل العناصر إلى هذا الموقع",
        moveDialogCancel: "إلغاء",
        moveDialogMove: "نقل هنا",
        moveDialogFailedToLoad: "فشل في تحميل المجلدات",
        moveDialogFailedToMove: "فشل في نقل العناصر",
        moveDialogInvalidDestination: "وجهة غير صالحة",
        moveDialogUnexpectedError: "حدث خطأ غير متوقع",
        moving: "جاري النقل...",
        // Move to dialog end

        // File picker dialog
        filePickerDialogTitle: "اختيار ملف",
        filePickerDialogSelectFile: "اختر ملف",
        filePickerDialogNoFiles: "لا توجد ملفات في هذا المجلد",
        filePickerDialogSelect: "اختيار",
        filePickerDialogCancel: "إلغاء",
        filePickerDialogFailedToLoad: "فشل في تحميل الملفات",
        filePickerDialogUnexpectedError: "حدث خطأ غير متوقع",
        selecting: "جاري الاختيار...",
        // File picker dialog end

        contentType: "نوع المحتوى",
        path: "المسار",
        md5Hash: "تشفير MD5",
        protected: "محمي",
        yes: "نعم",
        parentPath: "المسار الأصلي",
        protectChildren: "حماية العناصر الفرعية",
        permissions: "الصلاحيات",
        allowUploads: "السماح برفع الملفات",
        allowCreateFolders: "السماح بإنشاء مجلدات",
        allowDeleteFiles: "السماح بحذف الملفات",
        allowMoveFiles: "السماح بنقل الملفات",
        no: "لا",

        // File types for filtering
        allTypes: "جميع الأنواع",
        folders: "مجلدات",
        documents: "مستندات",
        spreadsheets: "جداول بيانات",
        presentations: "عروض تقديمية",
        videos: "فيديوهات",
        forms: "نماذج",
        photos: "صور وصور فوتوغرافية",
        pdfs: "ملفات PDF",
        archives: "أرشيف",
        audio: "صوتيات",
        drawings: "رسوم",
        sites: "مواقع",
        shortcuts: "اختصارات",
        otherTypes: "أخرى",

        // Pagination
        itemsPerPage: "عناصر في الصفحة",
        page: "صفحة %{current} من %{total}",
        showingItems: "عرض %{start}-%{end} من %{total}",

        // Navigation and breadcrumb
        myDrive: "مساحتي",
        breadcrumbNavigation: "شريط التنقل",

        // Generic UI terms
        loading: "جاري التحميل",
        error: "خطأ",
        retry: "إعادة المحاولة",
        cancel: "إلغاء",
        close: "إغلاق",
        save: "حفظ",
        apply: "تطبيق",
        reset: "إعادة تعيين",
    },
    dropzone: {
        // Drag and drop messages
        dragFilesHere: "اسحب الملفات هنا",
        dragToUpload: "اسحب لتحميل الملفات",
        dragOverToUpload: "أفلت هنا لتحميل الملفات",
        dragAndDropFiles: "اسحب وأفلت الملفات",
        orClickToSelect: "أو انقر لاختيار الملفات",
        clickToSelectFiles: "انقر لاختيار الملفات",
        uploading: "جاري التحميل",

        // File validation messages
        invalidFileType: 'نوع الملف غير صالح: "%{fileName}"',
        fileTooLarge: 'الملف "%{fileName}" كبير جداً. الحد الأقصى: %{maxSize}',
        tooManyFiles: "عدد كبير من الملفات: %{count}. الحد الأقصى: %{maxFiles}",

        // Upload feedback
        filesSelected: "تم اختيار %{count} ملف",
        startingUpload: "بدء التحميل...",
        uploadSuccess: "تم تحميل %{count} ملف بنجاح",
        uploadFailed: "فشل التحميل: %{error}",

        // Dropzone states
        dropzoneActive: "منطقة الإفلات نشطة",
        dropzoneInactive: "منطقة الإفلات غير نشطة",
        dropHereToUpload: "أفلت هنا للتحميل",
        releaseToUpload: "أفلت لبدء التحميل",
    },
};

export default storage;
