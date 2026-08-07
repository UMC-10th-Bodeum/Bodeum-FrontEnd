// YYYY-MM-DD 또는 ISO 날짜 문자열 → YYYY.MM.DD
export function formatDateWithDots(dateString: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString.replaceAll("-", ".");
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "날짜 정보 없음";
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join(".");
}

// 0시간 전
export function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "날짜 정보 없음";
  }

  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "방금 전";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}주 전`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}개월 전`;

  const years = Math.floor(days / 365);
  return `${years}년 전`;
}
