import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up PDF.js worker for Vite - use dynamic import to avoid module resolution issues
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

export class ResumeParser {
  async parseFile(file: File): Promise<string> {
    const fileType = file.type;
    
    if (fileType === 'application/pdf') {
      return await this.parsePDF(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await this.parseDocx(file);
    } else if (fileType === 'application/msword') {
      return await this.parseDoc(file);
    } else if (fileType === 'text/plain') {
      return await this.parseText(file);
    } else {
      throw new Error('Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files.');
    }
  }

  private async parsePDF(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Enhanced PDF loading with better error handling
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/standard_fonts/',
        verbosity: 0 // Reduce console warnings
      });
      
      const pdf = await loadingTask.promise;
      let text = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Enhanced text extraction with better formatting
          const pageText = textContent.items
            .map((item: any) => {
              // Handle different text item types
              if (typeof item === 'object' && item.str) {
                return item.str;
              }
              return '';
            })
            .filter(str => str.trim().length > 0)
            .join(' ');
          
          if (pageText.trim()) {
            text += pageText + '\n\n';
          }
        } catch (pageError) {
          console.warn(`Error parsing page ${i}:`, pageError);
          // Continue with other pages even if one fails
          continue;
        }
      }

      // Clean up the extracted text
      const cleanedText = text
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n\s*\n/g, '\n') // Remove empty lines
        .trim();

      if (!cleanedText) {
        throw new Error('No text content found in PDF. The PDF might be image-based or corrupted.');
      }

      return cleanedText;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Invalid PDF')) {
          throw new Error('Invalid PDF file. Please ensure the file is not corrupted.');
        } else if (error.message.includes('Password')) {
          throw new Error('Password-protected PDFs are not supported. Please upload an unprotected PDF.');
        } else if (error.message.includes('No text content')) {
          throw new Error('This PDF appears to be image-based. Please upload a text-based PDF or convert it first.');
        }
      }
      
      throw new Error('Failed to parse PDF file. Please ensure it\'s a valid, text-based PDF document.');
    }
  }

  private async parseDocx(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error('Error parsing DOCX:', error);
      throw new Error('Failed to parse DOCX file. Please try a different format.');
    }
  }

  private async parseDoc(file: File): Promise<string> {
    // For .doc files, we'll use a basic text extraction
    // Note: This is limited and may not work perfectly with all .doc files
    try {
      const text = await file.text();
      return text;
    } catch (error) {
      console.error('Error parsing DOC:', error);
      throw new Error('Failed to parse DOC file. Please convert to DOCX or PDF format.');
    }
  }

  private async parseText(file: File): Promise<string> {
    try {
      return await file.text();
    } catch (error) {
      console.error('Error parsing text file:', error);
      throw new Error('Failed to parse text file.');
    }
  }

  validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 10MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Please upload PDF, DOC, DOCX, or TXT files only' };
    }

    return { isValid: true };
  }
}