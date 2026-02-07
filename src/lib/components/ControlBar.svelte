<script>
    /** @type {{ 
        total: number, 
        success: number, 
        proxyUrl: string, 
        processing: boolean,
        onReset: () => void,
        onDownloadZip: () => void,
        onProxyChange: (url: string) => void
    }} */
    let { total, success, proxyUrl, processing, onReset, onDownloadZip, onProxyChange } = $props();
</script>

<div class="mb-6 flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm md:flex-row md:items-end md:justify-between sticky top-4 z-10 border border-gray-100">
    
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div class="flex w-full flex-col items-start sm:w-auto">
            <label for="cors-proxy-url" class="text-xs text-gray-500 mb-1 font-medium">CORS Proxy URL</label>
            <input 
                id="cors-proxy-url"
                type="text" 
                value={proxyUrl}
                oninput={(e) => onProxyChange(e.currentTarget.value)}
                placeholder="https://corsproxy.io/?"
                class="h-9 w-full rounded border-gray-300 text-sm text-gray-700 focus:border-black focus:ring-black sm:w-64"
            />
        </div>
    </div>
    <div class="flex flex-wrap items-center justify-between gap-4 md:contents">
        <div class="mb-0 md:mb-2 text-sm">
            <span class="font-bold text-gray-900">{total}</span> files
            <span class="mx-1 text-gray-300">|</span>
            <span class="text-green-600 font-medium">{success}</span> done
        </div>
        <div class="flex items-center gap-2 sm:gap-4">
            <button 
                onclick={onReset}
                class="rounded-full border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
                aria-label="Reset all files"
            >
                Reset
            </button>
            <button 
                onclick={onDownloadZip}
                disabled={processing}
                class="whitespace-nowrap rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 transition-all flex items-center"
            >
                {#if processing}
                    <svg class="mr-2 -ml-1 h-4 w-4 animate-spin text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Zipping...
                {:else}
                    Download ZIP
                {/if}
            </button>
        </div>
    </div>
</div>
