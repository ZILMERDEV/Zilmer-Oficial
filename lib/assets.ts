export function cdnUrl(path: string): string {
  const base = 'https://zilmer-static-assets-494934331329-us-east-2-an.s3.us-east-2.amazonaws.com'
  if (!path) return path
  return base + path
}
