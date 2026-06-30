import { useEffect } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';

interface Props {
  src: string | null;
  onClose: () => void;
}

export function ImageViewer({ src, onClose }: Props) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (src) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute end-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
        aria-label="Close"
      >
        <X size={24} />
      </button>
      <div className="absolute bottom-4 start-1/2 flex -translate-x-1/2 gap-2">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setScale((s) => Math.min(s + 0.2, 3)); }}
          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        >
          <ZoomIn size={20} />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setScale((s) => Math.max(s - 0.2, 0.5)); }}
          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        >
          <ZoomOut size={20} />
        </button>
      </div>
      <img
        src={src}
        alt="Zoomed"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: `scale(${scale})` }}
        className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain transition-transform duration-200"
      />
    </div>
  );
}
