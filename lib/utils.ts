export function calculateSGPA(grades: { [key: string]: number }): number {
  const values = Object.values(grades);
  if (values.length === 0) return 0;
  
  const total = values.reduce((sum, grade) => sum + grade, 0);
  const sgpa = total / values.length / 10;
  return Math.round(sgpa * 100) / 100;
}

export function calculateAttendancePercentage(
  attended: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((attended / total) * 10000) / 100;
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function bufferToBase64(buffer: Buffer): string {
  return Buffer.from(buffer).toString('base64');
}

export function base64ToBuffer(base64: string): Buffer {
  return Buffer.from(base64, 'base64');
}