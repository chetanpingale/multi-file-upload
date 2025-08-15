// Fake upload API
export function uploadFile(file: { size: any; }, { signal, onProgress }: { signal: AbortSignal; onProgress: (p: any) => void; }) {
  return new Promise<void>((resolve, reject) => {
    const total = file.size;
    let uploaded = 0;
    const speed = 200000 + Math.random() * 300000; 

    const interval = setInterval(() => {
      if (signal.aborted) {
        clearInterval(interval);
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      uploaded += speed;
      if (uploaded >= total) {
        clearInterval(interval);
        // Simulate random failure
        if (Math.random() < 0.2) {
          reject(new Error('Random upload error'));
        } else {
          resolve();
        }
      } else {
        onProgress(Math.min(uploaded / total, 1));
      }
    }, 300);
  });
}
