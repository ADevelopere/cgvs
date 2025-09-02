import StorageTranslations from "../components/Storage";

const arStorageTranslations: StorageTranslations = {
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
        successfullyMovedPartial: "تم نقل %{successCount} عنصر، فشل في نقل %{failureCount}. الأخطاء: %{errors}",
        successfullyCopied: "تم نسخ %{count} عنصر بنجاح",
        successfullyCopiedPartial: "تم نسخ %{successCount} عنصر، فشل في نسخ %{failureCount}. الأخطاء: %{errors}",
        
        // File operation error messages
        failedToRenameFile: "فشل في إعادة تسمية الملف",
        failedToCreateFolder: "فشل في إنشاء المجلد",
        failedToDeleteItems: "فشل في حذف العناصر",
        deletedPartial: "تم حذف %{successCount} عنصر، فشل في حذف %{failureCount}. الأخطاء: %{errors}",
        failedToMoveItems: "فشل في نقل العناصر",
        movedPartial: "تم نقل %{successCount} عنصر، فشل في نقل %{failureCount}. الأخطاء: %{errors}",
        failedToCopyItems: "فشل في نسخ العناصر",
        copiedPartial: "تم نسخ %{successCount} عنصر، فشل في نسخ %{failureCount}. الأخطاء: %{errors}",
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
        sortByName: "ترتيب حسب الاسم",
        sortBySize: "ترتيب حسب الحجم",
        sortByLastModified: "ترتيب حسب آخر تعديل",
        sortByCreated: "ترتيب حسب تاريخ الإنشاء",
        sortByType: "ترتيب حسب النوع",
        ascending: "تصاعدي",
        descending: "تنازلي",
        
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
        
        // Tree navigation
        expandFolder: "توسيع المجلد",
        collapseFolder: "طي المجلد",
        noFoldersFound: "لم يتم العثور على مجلدات",
        
        // Filter and view controls
        filterByType: "تصفية حسب النوع",
        filterByDate: "تصفية حسب التاريخ",
        clearFilters: "مسح المرشحات",
        showFilters: "إظهار المرشحات",
        hideFilters: "إخفاء المرشحات",
        
        // Accessibility
        focusedItem: "العنصر المحدد: %{itemName}",
        navigationInstructions: "استخدم مفاتيح الأسهم للتنقل، مسافة للتحديد، Enter للفتح",
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
        
        // Pagination
        itemsPerPage: "عناصر في الصفحة",
        page: "صفحة %{current} من %{total}",
        showingItems: "عرض %{start}-%{end} من %{total}",
        
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
};

export default arStorageTranslations;
