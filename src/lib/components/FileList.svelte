<script>
    import StatusBadge from './StatusBadge.svelte';

    /** @type {{ 
        files: import('$lib/downloader.svelte').FileItem[],
        onDownload: (item: import('$lib/downloader.svelte').FileItem) => void 
    }} */
    let { files, onDownload } = $props();
</script>

<!-- Desktop Table View -->
<div class="hidden overflow-hidden rounded-lg bg-white shadow md:block border border-gray-100">
    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
            <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Filename</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">URL</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
            {#each files as file, i}
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        <input 
                            type="text" 
                            bind:value={file.filename}
                            class="w-full rounded border-gray-300 text-sm focus:border-black focus:ring-black"
                        >
                    </td>
                    <td class="max-w-xs truncate px-6 py-4 text-sm text-gray-500" title={file.url}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" class="hover:underline hover:text-black">
                            {file.url}
                        </a>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm ">
                        <StatusBadge status={file.status} error={file.error} />
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <button 
                            onclick={() => onDownload(file)}
                            disabled={file.status === 'downloading'}
                            class="rounded-full bg-black px-3 py-1 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all"
                        >
                            {file.status === 'success' ? 'Download Again' : 'Download'}
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<!-- Mobile Card View -->
<div class="grid gap-4 md:hidden">
    {#each files as file}
        <div class="min-w-0 rounded-lg bg-white p-4 shadow border border-gray-100">
            <div class="mb-3">
                <label for="filename2" class="mb-1 block text-xs font-medium text-gray-500">Filename</label>
                <input 
                    type="text" 
                    bind:value={file.filename}
                    class="w-full rounded border-gray-300 text-sm focus:border-black focus:ring-black"
                >
            </div>
            <div class="mb-3">
                <p class="mb-1 block text-xs font-medium text-gray-500">URL</p>
                <div class="truncate text-sm text-gray-500" title={file.url}>
                    <a href={file.url} target="_blank" rel="noopener noreferrer" class="hover:underline hover:text-black">
                        {file.url}
                    </a>
                </div>
            </div>
            <div class="flex items-center justify-between mt-4">
                <div>
                   <StatusBadge status={file.status} error={file.error} />
                </div>
                <button 
                    onclick={() => onDownload(file)}
                    disabled={file.status === 'downloading'}
                    class="rounded-full bg-black px-3 py-1 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all"
                >
                    {file.status === 'success' ? 'Again' : 'Download'}
                </button>
            </div>
        </div>
    {/each}
</div>
