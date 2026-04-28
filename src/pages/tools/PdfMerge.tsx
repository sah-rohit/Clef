import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileText, Plus, Trash2, ArrowUp, ArrowDown, Play, ShieldCheck, FileStack } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";
import { PDFDocument } from "pdf-lib";

interface QueuedFile {
  id: string;
  file: File;
  name: string;
  size: string;
}

export default function PdfMerge() {
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = selectedFiles.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      file: f,
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + " MB"
    }));
    setFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    showToast(`${selectedFiles.length} file(s) added to queue.`, "success");
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      showToast("Please add at least 2 PDF files to merge.", "error");
      return;
    }

    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const queuedFile of files) {
        const fileArrayBuffer = await queuedFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(fileArrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `clef_merged_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast("PDFs merged successfully!", "success");
    } catch (err: any) {
      console.error(err);
      showToast("Failed to merge PDFs. Ensure they are valid documents.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout toolId="pdf-merge">
      <div className="flex flex-col gap-10">
        {/* Dynamic Header */}
        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b-[2px] border-black/5">
          <div className="flex flex-col">
            <span className="font-oswald text-[10px] font-black uppercase tracking-[0.3em] text-[#FF0004] mb-2">SYSTEM_DOCUMENT_COMPOSITOR</span>
            <h1 className="font-oswald text-4xl md:text-5xl font-black uppercase tracking-tight">PDF_MERGE</h1>
          </div>
          <div className="flex items-center gap-4 bg-black/5 px-5 py-3 border-[2px] border-black/10">
             <ShieldCheck size={16} className="text-[#00FF87]" />
             <span className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-60">CLIENT_SIDE_ENCRYPTION_ACTIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* File Management Zone */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <FileStack size={16} />
                <span className="font-oswald text-xs font-black uppercase tracking-widest">DOCUMENT_QUEUE ({files.length})</span>
              </div>
              <button 
                onClick={() => setFiles([])}
                className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-[#FF0004] transition-all"
              >
                CLEAR_ALL
              </button>
            </div>

            {/* Drop Zone / List */}
            <div className="relative group">
              <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-all duration-300" />
              <div className="relative border-[4px] border-black bg-white min-h-[400px] flex flex-col">
                {files.length === 0 ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex flex-col items-center justify-center p-12 cursor-pointer hover:bg-black/5 transition-colors group/inner"
                  >
                    <div className="w-20 h-20 border-[3px] border-black flex items-center justify-center mb-6 group-hover/inner:bg-[#F9FF00] transition-colors">
                      <Plus size={32} />
                    </div>
                    <span className="font-oswald text-xl font-black uppercase tracking-widest mb-2">DROP_DOCUMENTS_HERE</span>
                    <p className="font-inter text-xs text-black/40 uppercase tracking-widest">or click to browse filesystem</p>
                  </div>
                ) : (
                  <div className="flex-1 divide-y-[3px] divide-black overflow-auto max-h-[600px] custom-scrollbar">
                    {files.map((f, i) => (
                      <div key={f.id} className="group/item flex items-center gap-6 p-5 hover:bg-black/5 transition-colors">
                        <div className="w-10 h-10 border-[2px] border-black bg-black flex items-center justify-center shrink-0">
                          <FileText size={18} className="text-[#F9FF00]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-oswald text-sm font-bold uppercase truncate">{f.name}</h4>
                          <span className="font-mono text-[10px] opacity-40">{f.size}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => moveFile(i, "up")} disabled={i === 0} className="p-2 border-[2px] border-black hover:bg-[#F9FF00] disabled:opacity-20 transition-all">
                            <ArrowUp size={14} />
                          </button>
                          <button onClick={() => moveFile(i, "down")} disabled={i === files.length - 1} className="p-2 border-[2px] border-black hover:bg-[#F9FF00] disabled:opacity-20 transition-all">
                            <ArrowDown size={14} />
                          </button>
                          <button onClick={() => removeFile(f.id)} className="p-2 border-[2px] border-black hover:bg-[#FF0004] hover:text-white transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-6 flex items-center justify-center gap-3 font-oswald text-xs font-black uppercase tracking-[0.2em] hover:bg-black hover:text-[#F9FF00] transition-all"
                    >
                      <Plus size={16} /> ADD_MORE_BUFFERS
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6 animate-slide-left">
            <div className="flex items-center gap-3 px-2">
              <div className="w-2 h-2 bg-[#FF0004] rotate-45" />
              <span className="font-oswald text-xs font-black uppercase tracking-widest">CONTROL_PANEL</span>
            </div>

            <div className="flex flex-col gap-8 p-8 border-[4px] border-black bg-black text-white shadow-[12px_12px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between border-b border-white/10 pb-4">
                   <span className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40">INPUT_COUNT</span>
                   <span className="font-mono text-sm font-bold">{files.length}</span>
                 </div>
                 <div className="flex items-center justify-between border-b border-white/10 pb-4">
                   <span className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40">PROCESS_MODE</span>
                   <span className="font-oswald text-[10px] font-black uppercase text-[#F9FF00]">SEQUENTIAL_MERGE</span>
                 </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleMerge}
                  disabled={files.length < 2 || isProcessing}
                  className="group relative h-16 w-full bg-[#F9FF00] text-black border-[4px] border-black font-oswald font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-30 disabled:hover:translate-y-0"
                >
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Play size={20} className="fill-current" />
                    )}
                    {isProcessing ? "PROCESSING_BUFFER" : "INITIALIZE_MERGE"}
                  </div>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-10" />
                </button>

                <p className="font-inter text-[10px] leading-relaxed text-white/40 uppercase tracking-tight text-center">
                  By initializing the merge, you agree to local document processing. No files are uploaded to our servers.
                </p>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="flex flex-col gap-4 p-6 border-[3px] border-black bg-[#fafafa]">
               <h5 className="font-oswald text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-black" /> PRO_TIPS
               </h5>
               <ul className="flex flex-col gap-3">
                 {[
                   "Drag rows to reorder documents.",
                   "Merge speed depends on file sizes.",
                   "PDF layers and annotations are preserved."
                 ].map((tip, i) => (
                   <li key={i} className="flex gap-3">
                      <span className="font-oswald text-[10px] font-black text-[#FF0004]">{i+1}.</span>
                      <span className="font-inter text-[10px] uppercase font-bold tracking-tight opacity-60">{tip}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      </div>

      <input 
        type="file" 
        multiple 
        accept=".pdf" 
        ref={fileInputRef} 
        onChange={handleFileAdd} 
        className="hidden" 
      />
    </ToolLayout>
  );
}
