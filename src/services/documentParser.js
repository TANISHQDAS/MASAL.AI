/**
 * Document Parser for Inbound Real Estate Documents
 * Supports .txt, .pdf, .docx, .csv, .md, and raw transcripts.
 */

export async function parseDocumentFile(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  
  if (['txt', 'csv', 'md', 'json'].includes(extension)) {
    return await file.text();
  }

  if (extension === 'pdf') {
    return await extractTextFromPDF(file);
  }

  // Fallback for other files
  try {
    const text = await file.text();
    return text;
  } catch (err) {
    throw new Error(`Unsupported file format .${extension}. Please upload a .txt, .pdf, .csv, or .md file.`);
  }
}

/**
 * Basic client-side PDF text extraction from stream without heavy external binaries
 */
async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const decoder = new TextDecoder('utf-8');
  const rawString = decoder.decode(bytes);

  // Extract text strings between parenthesis inside BT (begin text) and ET (end text) blocks
  // or literal stream strings
  const textMatches = [];
  const regex = /\((.*?)\)|\[(.*?)\]/g;
  let match;
  
  while ((match = regex.exec(rawString)) !== null) {
    const found = match[1] || match[2];
    if (found && found.length > 2 && /[a-zA-Z0-9]/.test(found)) {
      textMatches.push(found.replace(/\\([()\\])/g, '$1'));
    }
  }

  if (textMatches.length > 5) {
    return textMatches.join(' ');
  }

  // Fallback: search for readable chunks
  const cleaned = rawString.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned.slice(0, 3000) || `Uploaded PDF Document: ${file.name}`;
}
