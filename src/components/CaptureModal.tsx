import { useEffect, useRef } from "react";
import { IconCameraFill, IconX, IconDownload } from "justd-icons";
import { Button } from "./button/Button";

interface CaptureModalProps {
  dataUrl: string | null;
  onClose: () => void;
}

export function CaptureModal({ dataUrl, onClose }: CaptureModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (dataUrl) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [dataUrl]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `lenslab-capture-${Date.now()}.png`;
    link.click();
  };

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/70 bg-surface text-white rounded-xl border border-white/10 p-0 shadow-2xl max-w-2xl w-[90vw]"
      style={{ inset: 0, margin: "auto", position: "fixed" }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      {dataUrl && (
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <div className="flex items-center gap-3">
              <IconCameraFill className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Capture Result</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white/80 transition-colors"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pb-4">
            <img
              src={dataUrl}
              alt="Captured scene"
              className="w-full rounded-lg border border-white/5"
            />
          </div>

          <div className="flex items-center justify-end gap-3 px-6 pb-5 pt-2 border-t border-white/5">
            <Button variant="tab" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleDownload}>
              <IconDownload className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>
      )}
    </dialog>
  );
}
