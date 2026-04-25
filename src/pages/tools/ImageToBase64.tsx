import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, Upload, Trash2, FileImage } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

export default function ImageToBase64() {
  const [base64, setBase64] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("File size too large. Max 5MB.", "error");
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(2) + " KB");

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setBase64(result);
      setPreview(result);
      showToast("Image converted successfully!", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    if (!base64) return;
    navigator.clipboard.writeText(base64);
    showToast("Base64 string copied to clipboard!", "success");
  };

  const handleClear = () => {
    setBase64("");
    setFileName("");
    setFileSize("");
    setPreview(null);
    showToast("Cleared.", "info");
  };

  return (
    <ToolLayout toolId="image-to-base64">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-[3px] border-black mb-6">
          {/* Upload Area */}
          <div className="p-8 border-r-[3px] border-black flex flex-col items-center justify-center bg-[#fafafa]">
            {preview ? (
              <div className="relative group w-full aspect-video border-[3px] border-black overflow-hidden bg-white">
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                <button
                  onClick={handleClear}
                  className="absolute top-2 right-2 bg-[#FF0004] text-white p-2 border-[3px] border-black opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <label className="w-full aspect-video border-[3px] border-dashed border-black/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F9FF00]/10 transition-colors group">
                <Upload size={48} className="text-black/20 group-hover:text-black transition-colors mb-4" />
                <span className="font-oswald text-sm font-bold uppercase">Click to upload image</span>
                <span className="font-inter text-[10px] text-black/40 mt-1">PNG, JPG, GIF up to 5MB</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}

            {fileName && (
              <div className="mt-4 w-full px-4 py-2 border-[3px] border-black bg-white flex items-center gap-3">
                <FileImage size={16} className="text-[#FF0004]" />
                <div className="flex-1 min-w-0">
                  <p className="font-oswald text-xs font-bold truncate">{fileName}</p>
                  <p className="font-inter text-[9px] text-black/40">{fileSize}</p>
                </div>
              </div>
            )}
          </div>

          {/* Base64 Output */}
          <div className="flex flex-col">
            <div className="bg-[#1a1a1a] text-white px-4 py-2 flex justify-between items-center">
              <span className="font-oswald text-xs font-bold uppercase tracking-wider">Base64 Output</span>
              {base64 && (
                <button onClick={handleCopy} className="text-[#F9FF00] hover:text-white transition-colors">
                  <Copy size={14} />
                </button>
              )}
            </div>
            <textarea
              className="flex-1 w-full min-h-[300px] p-4 font-mono text-[10px] bg-white outline-none resize-none break-all"
              value={base64}
              readOnly
              placeholder="Base64 string will appear here after upload..."
            />
            {base64 && (
              <div className="border-t-[3px] border-black p-3 bg-[#F9FF00]/10 flex justify-between items-center">
                <span className="font-inter text-[10px] text-black/60">{base64.length} characters</span>
                <button onClick={handleCopy} className="btn-brutal btn-brutal-yellow text-[10px] py-1 px-3">
                  COPY STRING
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border-[3px] border-black p-4">
          <h4 className="font-oswald text-xs font-bold uppercase tracking-widest mb-2">How it works</h4>
          <p className="font-inter text-xs text-black/60 leading-relaxed">
            This tool converts your image files into Data URL strings (Base64). You can use these strings directly in your HTML
            or CSS code without needing to host the image separately. Everything happens locally in your browser — your images
            are never uploaded to any server.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
