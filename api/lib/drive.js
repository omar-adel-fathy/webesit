const DRIVE_FILE_ID_PATTERN = /(?:file\/d\/|uc\?|open\?|folderview\?|id=)([a-zA-Z0-9_-]{20,})/;

export function extractDriveFileId(url) {
  const match = String(url ?? "").match(DRIVE_FILE_ID_PATTERN);
  return match ? match[1] : null;
}

function cleanUrl(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeResourceUrls(input) {
  const googleDriveFileId = cleanUrl(input.googleDriveFileId);
  const resourceViewUrl = cleanUrl(input.resourceViewUrl);
  const resourceDownloadUrl = cleanUrl(input.resourceDownloadUrl);

  const fileId =
    googleDriveFileId ||
    extractDriveFileId(resourceViewUrl ?? "") ||
    extractDriveFileId(resourceDownloadUrl ?? "") ||
    null;

  const isDrive = (url) => Boolean(url && /drive\.google\.com/.test(url));

  let viewUrl;
  if (isDrive(resourceViewUrl)) {
    viewUrl = fileId ? `https://drive.google.com/file/d/${fileId}/view` : resourceViewUrl;
  } else {
    viewUrl = resourceViewUrl ?? (fileId ? `https://drive.google.com/file/d/${fileId}/view` : null);
  }

  let downloadUrl;
  if (isDrive(resourceDownloadUrl)) {
    downloadUrl = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : resourceDownloadUrl;
  } else {
    downloadUrl = resourceDownloadUrl ?? (fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : null);
  }

  return { fileId, viewUrl, downloadUrl };
}