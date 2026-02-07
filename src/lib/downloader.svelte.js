import JSZip from 'jszip';

/**
 * @typedef {Object} FileItem
 * @property {string} url
 * @property {string} filename
 * @property {'pending' | 'downloading' | 'success' | 'error'} status
 * @property {string} [error]
 * @property {Blob} [blob]
 */

export class DownloaderState {
    /** @type {FileItem[]} */
    files = $state([]);
    processing = $state(false);
    proxyUrl = $state('https://api.codetabs.com/v1/proxy?quest=');

    constructor() {}

    /**
     * @param {string} text
     */
    parseCSV(text) {
        const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
        if (lines.length === 0) return [];

        /** @type {FileItem[]} */
        const result = [];

        // Check for header
        const firstLine = lines[0].toLowerCase();
        let startIndex = 0;
        let urlIndex = 0;
        let nameIndex = 1;

        if (firstLine.includes('url') || firstLine.includes('link')) {
            startIndex = 1;
            const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
            urlIndex = headers.findIndex((h) => h.includes('url') || h.includes('link'));
            nameIndex = headers.findIndex(
                (h) => h.includes('name') || h.includes('file') || h.includes('title')
            );

            if (urlIndex === -1) urlIndex = 0;
            if (nameIndex === -1) nameIndex = 1;
        }

        for (let i = startIndex; i < lines.length; i++) {
            const parts = lines[i].split(',').map((p) => p.trim());
            if (parts.length < 1) continue;

            let url = parts[urlIndex];
            let filename = parts[nameIndex];

            if (!url) continue;

            if (!filename) {
                try {
                    filename = new URL(url).pathname.split('/').pop() || `file-${i}`;
                } catch {
                    filename = `file-${i}`;
                }
            }

            result.push({
                url,
                filename,
                status: 'pending'
            });
        }
        return result;
    }

    /**
     * @param {File} file
     */
    async loadFile(file) {
        try {
            const text = await file.text();
            this.files = this.parseCSV(text);
        } catch (e) {
            alert('Failed to read file');
            console.error(e);
        }
    }

    /**
     * @param {FileItem} item
     * @returns {Promise<Blob>}
     */
    async fetchFileBlob(item) {
        const targetUrl = `${this.proxyUrl}${encodeURIComponent(item.url)}`;
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const blob = await response.blob();
        if (blob.size === 0) throw new Error('File is empty (0 bytes)');

        if (blob.size < 1000) {
            const text = await blob.slice(0, 1000).text();
            if (text.startsWith('{') && text.includes('"Error"')) {
                try {
                    const json = JSON.parse(text);
                    if (json.Error) throw new Error(`Proxy Error: ${json.Error}`);
                } catch {}
            }
            if (text.toLowerCase().includes('not found') || text.toLowerCase().includes('404 error')) {
                throw new Error('File not found (detected in response body)');
            }
        }
        
        return blob;
    }

    /**
     * @param {Blob} blob
     * @param {string} filename
     */
    triggerDownload(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setTimeout(() => {
            document.body.removeChild(a);
        }, 100);
    }

    /**
     * @param {FileItem} item
     */
    async downloadFile(item) {
        if (item.status === 'downloading') return;
        item.status = 'downloading';
        item.error = undefined;

        try {
            const blob = await this.fetchFileBlob(item);
            this.triggerDownload(blob, item.filename);
            item.status = 'success';
        } catch (e) {
            console.error(e);
            item.status = 'error';
            item.error = e instanceof Error ? e.message : 'Unknown error';
        }
    }

    async downloadZip() {
        if (this.processing) return;
        this.processing = true;

        try {
            const zip = new JSZip();
            let successCount = 0;

            for (const file of this.files) {
                file.status = 'downloading';
                file.error = undefined;
                try {
                    const blob = await this.fetchFileBlob(file);
                    zip.file(file.filename, blob);
                    file.status = 'success';
                    successCount++;
                } catch (e) {
                    console.error(e);
                    file.status = 'error';
                    file.error = e instanceof Error ? e.message : 'Unknown error';
                }
            }

            if (successCount > 0) {
                const content = await zip.generateAsync({ type: 'blob' });
                this.triggerDownload(content, 'files.zip');
            } else {
                alert('No files could be downloaded to create the zip.');
            }

        } catch (e) {
            console.error(e);
            alert('Failed to create zip file');
        } finally {
            this.processing = false;
        }
    }

    reset() {
        this.files = [];
        this.processing = false;
    }
}
