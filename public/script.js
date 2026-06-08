document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    const loadingState = document.getElementById('loading-state');
    const resultSection = document.getElementById('result-section');
    const textArea = document.getElementById('extracted-text');
    const resetBtn = document.getElementById('reset-btn');
    const copyBtn = document.getElementById('copy-btn');
    const pageCount = document.getElementById('page-count');

    // Handle Drag & Drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('dragover');
        });
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });

    // Handle Click to Browse
    browseBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        if (files.length === 0) return;
        
        const file = files[0];
        
        if (file.type && file.type !== 'application/pdf' && file.type !== 'application/octet-stream') {
            alert('Please upload a valid PDF file.');
            return;
        }

        uploadFile(file);
    }

    async function uploadFile(file) {
        // UI transitions
        dropZone.classList.add('hidden');
        resultSection.classList.add('hidden');
        loadingState.classList.remove('hidden');

        const formData = new FormData();
        formData.append('invoice', file);

        try {
            const response = await fetch('/api/extract-text', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Network response was not ok');
            }

            if (data.success) {
                textArea.value = data.text.trim() || "No text could be extracted from this PDF.";
                pageCount.textContent = `Pages: ${data.numpages}`;
                
                loadingState.classList.add('hidden');
                resultSection.classList.remove('hidden');
            } else {
                throw new Error(data.error);
            }

        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
            
            // Reset UI
            loadingState.classList.add('hidden');
            dropZone.classList.remove('hidden');
            fileInput.value = '';
        }
    }

    // Reset Flow
    resetBtn.addEventListener('click', () => {
        resultSection.classList.add('hidden');
        dropZone.classList.remove('hidden');
        textArea.value = '';
        fileInput.value = '';
    });

    // Copy to Clipboard
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(textArea.value);
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
            alert('Failed to copy text to clipboard.');
        }
    });
});
