/**
 * 日本時間（JST）での日付処理ユーティリティ
 */

// 日本のタイムゾーンオフセット（UTC+9）
const JST_OFFSET = 9 * 60 * 60 * 1000; // 9時間をミリ秒で表現

/**
 * 現在の日本時間を取得
 */
export function getNowJST(): Date {
  const now = new Date();
  return new Date(now.getTime() + JST_OFFSET);
}

/**
 * 日付を日本時間の日付（時刻は00:00:00）に正規化
 */
export function toJSTDate(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  const jstDate = new Date(d.getTime() + JST_OFFSET);
  jstDate.setUTCHours(0, 0, 0, 0); // JST時間で日付のみにする
  return jstDate;
}

/**
 * 2つの日付間の日数を計算（日本時間基準）
 */
export function calculateDaysJST(startDate: Date | string, endDate: Date | string): number {
  const start = toJSTDate(startDate);
  const end = toJSTDate(endDate);
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * 現在から指定日付までの残り日数を計算（日本時間基準）
 */
export function calculateDaysLeftJST(targetDate: Date | string): number {
  const now = getNowJST();
  const target = toJSTDate(targetDate);
  return Math.ceil((target.getTime() - toJSTDate(now).getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * 指定日付から現在までの経過日数を計算（日本時間基準）
 */
export function calculateDaysPassedJST(startDate: Date | string): number {
  const now = getNowJST();
  const start = toJSTDate(startDate);
  return Math.floor((toJSTDate(now).getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * 進捗率を計算（日本時間基準）
 */
export function calculateProgressJST(startDate: Date | string, goalDate: Date | string): number {
  const daysPassed = calculateDaysPassedJST(startDate);
  const totalDuration = calculateDaysJST(startDate, goalDate);
  if (totalDuration <= 0) return 0;
  return Math.min(100, Math.floor((daysPassed / totalDuration) * 100));
}

/**
 * 日本時間での経過時間を計算（ミリ秒）
 */
export function calculateElapsedTimeJST(startDate: Date | string): number {
  const now = getNowJST();
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  // 開始日時を日本時間に調整
  const jstStart = new Date(start.getTime() + JST_OFFSET);
  return now.getTime() - jstStart.getTime();
}

/**
 * 日付をYYYY-MM-DD形式の文字列に変換（日本時間基準）
 */
export function toDateStringJST(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const jstDate = new Date(d.getTime() + JST_OFFSET);
  return jstDate.toISOString().slice(0, 10);
}

/**
 * 日付をローカライズされた文字列に変換（日本時間基準）
 */
export function toLocaleDateStringJST(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const jstDate = new Date(d.getTime() + JST_OFFSET);
  return jstDate.toLocaleDateString('ja-JP');
}
