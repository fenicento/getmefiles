<script>
    /** @type {{ 
        onDrop: (file: File) => void 
    }} */
    let { onDrop } = $props();

    let dragOver = $state(false);

    /** @param {DragEvent} e */
    function handleDrop(e) {
        e.preventDefault();
        dragOver = false;
        if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
            onDrop(e.dataTransfer.files[0]);
        }
    }

    /** @param {Event} event */
    function handleFileUpload(event) {
        const input = /** @type {HTMLInputElement} */ (event.target);
        if (input.files && input.files[0]) {
            onDrop(input.files[0]);
        }
    }
</script>

<div
    class="rounded-lg border-2 border-dashed p-12 text-center bg-gray-100 transition-colors {dragOver ? 'border-black bg-gray-200' : 'border-gray-300 hover:border-gray-400'}"
    role="region"
    aria-label="File Upload Drop Zone"
    ondragover={(e) => { e.preventDefault(); dragOver = true; }}
    ondragleave={() => dragOver = false}
    ondrop={handleDrop}
>
    <div class="flex flex-col items-center justify-center">
        <svg class="mb-4 h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="mb-2 text-lg font-medium text-gray-700">Drag and drop your CSV file here</p>
        <p class="mb-4 text-sm text-gray-500">or</p>
        <label class="cursor-pointer rounded-full bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all">
            Browse Files
            <input type="file" accept=".csv" class="hidden" onchange={handleFileUpload} />
        </label>
    </div>
</div>
<div>
    <p class="font-semibold mb-2 mt-4">CSV Requirements:</p>
    <ul class="list-disc list-inside space-y-1 text-gray-600">
        <li>The file should be in <strong>.csv</strong> format</li>
        <li>It must include a column for the <strong>URL</strong> (header: "url" or "link")</li>
        <li>Optionally, include a column for the <strong>Filename</strong> (header: "name", "file", or "title")</li>
        <li>If no headers are present, the app assumes: <strong>Column 1 = URL</strong>, <strong>Column 2 = Filename</strong></li>
    </ul>
</div>
