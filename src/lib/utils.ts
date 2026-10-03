import { CASE_TYPE_LABELS } from './types';
export { CASE_TYPE_LABELS };

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getQualityLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

export function getConfidenceLabel(score: number): string {
  if (score >= 80) return "Very High";
  if (score >= 60) return "High";
  if (score >= 40) return "Moderate";
  return "Low";
}

export function getConfidenceColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-blue-500";
  if (score >= 40) return "text-yellow-500";
  return "text-red-500";
}

export function truncateFilename(name: string, maxLength: number): string {
  if (name.length <= maxLength) return name;
  const extIndex = name.lastIndexOf(".");
  if (extIndex !== -1 && extIndex > maxLength - 5) {
    const ext = name.substring(extIndex);
    const basename = name.substring(0, extIndex);
    const charsToShow = maxLength - ext.length - 3;
    return basename.substring(0, charsToShow) + "..." + ext;
  }
  return name.substring(0, maxLength - 3) + "...";
}

export function generateHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
