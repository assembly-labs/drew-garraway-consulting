// File Import Module
class FileImporter {
  constructor() {
    this.MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    this.SUPPORTED_TYPES = {
      'text/plain': 'txt',
      'application/pdf': 'pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
    };

    // Load external libraries when needed
    this.pdfJsLoaded = false;
    this.mammothLoaded = false;
  }

  // Validate file before processing
  validateFile(file) {
    if (!file) {
      throw new Error('No file selected');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${this.MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isSupported = ['txt', 'pdf', 'docx'].includes(fileExtension) ||
                       Object.keys(this.SUPPORTED_TYPES).includes(file.type);

    if (!isSupported) {
      throw new Error(`Unsupported file type. Please use .txt, .pdf, or .docx files.`);
    }

    return true;
  }

  // Main import function
  async importFile(file, progressCallback) {
    this.validateFile(file);

    const fileExtension = file.name.split('.').pop().toLowerCase();

    switch (fileExtension) {
      case 'txt':
        return await this.importTextFile(file);
      case 'pdf':
        return await this.importPDFFile(file, progressCallback);
      case 'docx':
        return await this.importDOCXFile(file, progressCallback);
      default:
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }
  }

  // Import plain text file
  async importTextFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target.result;
        resolve({
          text: text,
          filename: file.name,
          type: 'txt',
          success: true
        });
      };

      reader.onerror = (error) => {
        reject(new Error('Failed to read text file: ' + error.message));
      };

      reader.readAsText(file);
    });
  }

  // Load PDF.js library dynamically
  async loadPDFJS() {
    if (this.pdfJsLoaded) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        // Set worker source
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        this.pdfJsLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load PDF.js library'));
      document.head.appendChild(script);
    });
  }

  // Import PDF file
  async importPDFFile(file, progressCallback) {
    await this.loadPDFJS();

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

    try {
      const pdf = await loadingTask.promise;
      let fullText = '';
      const totalPages = pdf.numPages;

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        if (progressCallback) {
          progressCallback({
            current: pageNum,
            total: totalPages,
            percent: (pageNum / totalPages) * 100,
            message: `Processing page ${pageNum} of ${totalPages}...`
          });
        }

        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Extract text items and join them
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (pageText) {
          fullText += pageText + '\n\n';
        }
      }

      if (!fullText.trim()) {
        throw new Error('No text found in PDF. This might be a scanned document.');
      }

      return {
        text: fullText.trim(),
        filename: file.name,
        type: 'pdf',
        pages: totalPages,
        success: true
      };
    } catch (error) {
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  }

  // Load Mammoth.js library dynamically
  async loadMammoth() {
    if (this.mammothLoaded) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
      script.onload = () => {
        this.mammothLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Mammoth.js library'));
      document.head.appendChild(script);
    });
  }

  // Import DOCX file
  async importDOCXFile(file, progressCallback) {
    await this.loadMammoth();

    if (progressCallback) {
      progressCallback({
        percent: 50,
        message: 'Processing Word document...'
      });
    }

    const arrayBuffer = await file.arrayBuffer();

    try {
      const result = await mammoth.extractRawText({ arrayBuffer });

      if (result.messages && result.messages.length > 0) {
        console.warn('DOCX extraction warnings:', result.messages);
      }

      if (!result.value || !result.value.trim()) {
        throw new Error('No text found in the document');
      }

      if (progressCallback) {
        progressCallback({
          percent: 100,
          message: 'Document processed successfully'
        });
      }

      return {
        text: result.value.trim(),
        filename: file.name,
        type: 'docx',
        success: true,
        warnings: result.messages
      };
    } catch (error) {
      throw new Error(`Failed to extract text from Word document: ${error.message}`);
    }
  }

  // Handle multiple file imports
  async importMultipleFiles(files, progressCallback) {
    const results = [];
    const fileArray = Array.from(files);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      try {
        if (progressCallback) {
          progressCallback({
            fileIndex: i,
            totalFiles: fileArray.length,
            filename: file.name,
            message: `Importing ${file.name} (${i + 1}/${fileArray.length})...`
          });
        }

        const result = await this.importFile(file, (progress) => {
          if (progressCallback) {
            progressCallback({
              ...progress,
              fileIndex: i,
              totalFiles: fileArray.length,
              filename: file.name
            });
          }
        });

        results.push(result);
      } catch (error) {
        results.push({
          filename: file.name,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  // Extract filename without extension
  getFileTitle(filename) {
    return filename.replace(/\.[^/.]+$/, '');
  }

  // Format file size for display
  formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // Check if browser supports file import
  isSupported() {
    return window.File && window.FileReader && window.FileList && window.Blob;
  }
}

// Export for use in other modules
window.FileImporter = FileImporter;