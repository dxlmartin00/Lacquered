import { useState, useCallback } from 'react';

export interface CompressionResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  reductionPercentage: number;
}

export function useImageCompressor() {
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const compressImage = useCallback(
    async (fileOrBlob: File | Blob, maxDimension: number = 1440, quality: number = 0.8): Promise<CompressionResult> => {
      setIsCompressing(true);
      setError(null);

      return new Promise<CompressionResult>((resolve, reject) => {
        const originalSizeBytes = fileOrBlob.size;
        const img = new Image();
        const objectUrl = URL.createObjectURL(fileOrBlob);

        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          try {
            let { width, height } = img;

            // Maintain aspect ratio while capping max dimension to 1440px
            if (width > maxDimension || height > maxDimension) {
              if (width >= height) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              } else {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d', { alpha: false });
            if (!ctx) {
              throw new Error('Canvas 2D context creation failed');
            }

            // High quality image smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // Export as WebP format
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  const fallbackDataUrl = canvas.toDataURL('image/jpeg', quality);
                  fetch(fallbackDataUrl)
                    .then((res) => res.blob())
                    .then((jpegBlob) => {
                      setIsCompressing(false);
                      resolve({
                        blob: jpegBlob,
                        dataUrl: fallbackDataUrl,
                        width,
                        height,
                        originalSizeBytes,
                        compressedSizeBytes: jpegBlob.size,
                        reductionPercentage: Math.max(0, Math.round(((originalSizeBytes - jpegBlob.size) / originalSizeBytes) * 100)),
                      });
                    })
                    .catch((err) => {
                      setIsCompressing(false);
                      reject(err);
                    });
                  return;
                }

                const dataUrl = canvas.toDataURL('image/webp', quality);
                const compressedSizeBytes = blob.size;
                const reductionPercentage = Math.max(
                  0,
                  Math.round(((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100)
                );

                setIsCompressing(false);
                resolve({
                  blob,
                  dataUrl,
                  width,
                  height,
                  originalSizeBytes,
                  compressedSizeBytes,
                  reductionPercentage,
                });
              },
              'image/webp',
              quality
            );
          } catch (err: unknown) {
            setIsCompressing(false);
            const errMsg = err instanceof Error ? err.message : 'Compression error';
            setError(errMsg);
            reject(new Error(errMsg));
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          setIsCompressing(false);
          const err = new Error('Failed to load image into canvas');
          setError(err.message);
          reject(err);
        };

        img.src = objectUrl;
      });
    },
    []
  );

  return {
    compressImage,
    isCompressing,
    error,
  };
}
