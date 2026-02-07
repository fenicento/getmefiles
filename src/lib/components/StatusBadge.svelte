<script>
    /** @type {{ 
        status: 'pending' | 'downloading' | 'success' | 'error',
        error?: string 
    }} */
    let { status, error } = $props();
</script>

{#if status === 'success'}
    <span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        Downloaded
    </span>
{:else if status === 'downloading'}
    <span class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 animate-pulse">
        Downloading...
    </span>
{:else if status === 'error'}
    <span class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 cursor-help" title={error}>
        Error
    </span>
{:else}
    <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
        Pending
    </span>
{/if}
