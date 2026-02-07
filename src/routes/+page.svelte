<script>
	import { DownloaderState } from '$lib/downloader.svelte';
	import DropZone from '$lib/components/DropZone.svelte';
	import ControlBar from '$lib/components/ControlBar.svelte';
	import FileList from '$lib/components/FileList.svelte';

	const downloader = new DownloaderState();
</script>

<div class="min-h-screen bg-gray-50 p-4 sm:p-8 text-gray-800 font-sans">
	<div class="mx-auto max-w-5xl">
		<header class="mb-8 text-center">
			<h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Bulk File Downloader</h1>
			<p class="mt-2 text-gray-500  mx-auto">Download a list of files by uploading a CSV containing URLs and desired filenames.</p>
		</header>

		{#if downloader.files.length === 0}
            <DropZone onDrop={(file) => downloader.loadFile(file)} />
		{:else}
			<ControlBar
				total={downloader.files.length}
				success={downloader.files.filter(f => f.status === 'success').length}
				proxyUrl={downloader.proxyUrl}
				processing={downloader.processing}
				onReset={() => downloader.reset()}
				onDownloadZip={() => downloader.downloadZip()}
				onProxyChange={(url) => downloader.proxyUrl = url}
			/>

			<FileList 
				files={downloader.files} 
				onDownload={(item) => downloader.downloadFile(item)} 
			/>
		{/if}
	</div>
</div>
