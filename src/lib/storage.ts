// Builds a public URL from a storage key.
//
// The database stores only the key (e.g. "PRODUCTS/<id>/COVER/foto.jpg"), never a
// full URL. That way moving from local MinIO to R2/S3 is just an env var change --
// no rows to migrate.
//
// NEXT_PUBLIC_STORAGE_BASE_URL already includes the bucket segment, so:
//   MinIO  -> http://localhost:9000/midtrans
//   R2     -> https://images.domainanda.com
const BASE_URL = process.env.NEXT_PUBLIC_STORAGE_BASE_URL ?? "";

export function storageUrl(key: string): string {
  // older rows saved the full URL before we switched to keys -- leave them alone
  if (key.startsWith("http://") || key.startsWith("https://")) {
    return key;
  }

  // filenames may contain spaces or non-ascii, so encode each segment
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");

  return `${BASE_URL}/${encodedKey}`;
}
