/**
 * Converts MongoDB Binary/Buffer data to base64 data URL
 * Handles multiple buffer formats from MongoDB
 */
export function bufferToDataUrl(buffer: any, fileType: string): string {
  try {
    if (!buffer) {
      console.error('No buffer provided');
      return '';
    }

    let base64: string;

    // Method 1: Direct base64 conversion if buffer is already a base64 string
    if (typeof buffer === 'string') {
      base64 = buffer;
    }
    // Method 2: MongoDB Binary with Buffer type
    else if (buffer.type === 'Buffer' && Array.isArray(buffer.data)) {
      const bytes = new Uint8Array(buffer.data);
      base64 = uint8ArrayToBase64(bytes);
    }
    // Method 3: Buffer object with data property
    else if (buffer.data && Array.isArray(buffer.data)) {
      const bytes = new Uint8Array(buffer.data);
      base64 = uint8ArrayToBase64(bytes);
    }
    // Method 4: Direct Uint8Array or similar
    else if (ArrayBuffer.isView(buffer)) {
      base64 = uint8ArrayToBase64(new Uint8Array(buffer.buffer || buffer));
    }
    // Method 5: Plain array of numbers
    else if (Array.isArray(buffer)) {
      const bytes = new Uint8Array(buffer);
      base64 = uint8ArrayToBase64(bytes);
    }
    // Method 6: Node.js Buffer object (has toString method)
    else if (typeof buffer === 'object' && buffer.toString) {
      base64 = buffer.toString('base64');
    }
    else {
      console.error('Unknown buffer format:', {
        type: typeof buffer,
        constructor: buffer?.constructor?.name,
        keys: Object.keys(buffer || {}),
      });
      return '';
    }

    // Validate base64 string
    if (!base64 || base64.length === 0) {
      console.error('Empty base64 string generated');
      return '';
    }

    // Return data URL with appropriate MIME type
    const mimeType = getMimeType(fileType);
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Error in bufferToDataUrl:', error);
    return '';
  }
}

/**
 * Convert Uint8Array to base64 string
 */
function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.length;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Get MIME type from file type string
 */
function getMimeType(fileType: string): string {
  const type = fileType?.toUpperCase();
  
  if (type === 'PDF') {
    return 'application/pdf';
  } else if (type === 'PHOTO' || type === 'IMAGE') {
    return 'image/jpeg';
  } else if (type === 'PNG') {
    return 'image/png';
  } else if (type === 'JPG' || type === 'JPEG') {
    return 'image/jpeg';
  } else {
    // Default to jpeg for unknown image types
    return 'image/jpeg';
  }
}

/**
 * Download file from data URL
 */
export function downloadFile(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}