Here is a new, complete plan that reproduces the implementation we've discussed, including all the corrections to ensure we respect your existing architecture (using repositories, decoupling from the DB, and matching the `local.ts` logic where appropriate).

This plan creates a hybrid upload system where the client asks the server *how* to upload, and the server "directs" the client to one of two flows.

### **Plan: Vercel Blob Adapter with Hybrid Upload**

**Goal:** Integrate Vercel Blob as a new storage adapter, supporting large client-side uploads via the Vercel SDK, while maintaining the existing `SIGNED_URL` flow for other providers.


### **Step 2: Update Core Storage Interface**

We'll modify the `StorageService` interface  to return our new "upload instructions" object.

* **File:** `server/storage/disk/storage.service.interface.ts`
* **Action:** Update the file to include:
    2.  `UploadPreparationResult`: The new object (`{ id, url, uploadType }`) that `getSignedUrlForUpload` will return.
    3.  Update the `getSignedUrlForUpload` method signature to return `Promise<UploadPreparationResult>`.

---

### **Step 3: Update `local.ts` Adapter**

We'll update the `local` adapter to conform to the new interface changes.

* **File:** `server/storage/disk/local.ts`
* **Action:**
    2.  Update `getSignedUrlForUpload` to return the new `UploadPreparationResult` object, specifying `uploadType: 'SIGNED_URL'`.

---

### **Step 4: Create New `vercel.ts` Adapter**

This is the new adapter. It will follow your `local.ts` pattern strictly but will have Vercel-specific logic

* **File:** `server/storage/disk/vercel.ts`
* **Action:** Create the file with the same logic as local.ts (but with vercel specific api)

---

### **Step 5: Create Vercel's Required API Route**

This is the dedicated endpoint that the `@vercel/blob/client` SDK will call to get its token and to report completion. This is where all the Vercel-specific DB updates will happen.

* **File:** `app/api/storage/vercel-upload/route.ts`
* **Action:** Create the new API route.

---

### **Step 6: Update Server-Side GraphQL (Pothos)**

We'll update the `getSignedUrlForUpload` mutation to return our new `UploadPreparation` object.

* **File:** `server/graphql/pothos/storage.pothos.ts`
* **Action:**
    1.  Define the `UploadPreparationObject`.
    2.  Change the `getSignedUrlForUpload` mutation's `type` to `UploadPreparationObject`.
    3.  Update the `resolve` function to return the object from the service.

---

### **Step 7: Update Client-Side Upload Hook**

Finally, we update the client hook to handle the two different upload flows.

* **File:** `client/views/storage/hooks/useStorageUploadOperations.ts`
* **Action:**
    1.  Import `@vercel/blob/client`.
    2.  Create a new `performVercelUpload` function.
    3.  Update `uploadFile` to check `prep.uploadType` and call the correct upload function.
    4.  Ensure the `completeUpload` mutation is **only** called for the `SIGNED_URL` flow (since the Vercel webhook handles its own completion).