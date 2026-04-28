import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileText, Scissors, Download, ShieldCheck, Settings2, HelpCircle } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";
import { PDFDocument } from "pdf-lib";

export default function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        setPageCount(pdf.getPageCount());
        showToast("PDF loaded. Ready to split.", "success");
      } catch (err) {
        showToast("Invalid PDF file.", "error");
        setFile(null);
        setPageCount(null);
      }
    }
  };

  const handleSplit = async () => {
    if (!file || !pageRange) {
      showToast("Select a file and specify a page range.", "error");
      return;
    }

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const totalPages = pdf.getPageCount();

      // Parse range: "1-3, 5, 10-12"
      const ranges = pageRange.split(",").map(r => r.trim());
      const pagesToKeep: number[] = [];

      for (const range of ranges) {
        if (range.includes("-")) {
          const [start, end] = range.split("-").map(Number);
          if (start > 0 && end <= totalPages && start <= end) {
            for (let i = start; i <= end; i++) pagesToKeep.push(i - 1);
          }
        } else {
          const page = Number(range);
          if (page > 0 && page <= totalPages) {
            pagesToKeep.push(page - 1);
          }
        }
      }

      if (pagesToKeep.length === 0) {
        showToast("Invalid page range specified.", "error");
        setIsProcessing(false);
        return;
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, [...new Set(pagesToKeep)]);
      copiedPages.forEach(p => newPdf.addPage(p));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `clef_split_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast("PDF split successful!", "success");
    } catch (err: any) {
      showToast("Split failed. Check your range syntax.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout toolId="pdf-split">
      <div className="flex flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b-[2px] border-black/5">
          <div className="flex flex-col">
            <span className="font-oswald text-[10px] font-black uppercase tracking-[0.3em] text-[#F9FF00] mb-2">SYSTEM_DOCUMENT_ATOMIZER</span>
            <h1 className="font-oswald text-4xl md:text-5xl font-black uppercase tracking-tight">PDF_SPLIT</h1>
          </div>
          <div className="flex items-center gap-4 bg-black/5 px-5 py-3 border-[2px] border-black/10">
             <ShieldCheck size={16} className="text-[#00FF87]" />
             <span className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-60">LOCAL_ISOLATED_BUFFER</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 px-2">
                <FileText size={16} />
                <span className="font-oswald text-xs font-black uppercase tracking-widest">SOURCE_DOCUMENT</span>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-all duration-300" />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-[4px] border-black bg-white h-[300px] flex flex-col items-center justify-center p-12 cursor-pointer hover:bg-black/5 transition-all"
                >
                  {file ? (
                    <div className="flex flex-col items-center animate-scale-in">
                       <div className="w-20 h-20 bg-black flex items-center justify-center mb-6">
                         <FileText size={32} className="text-[#F9FF00]" />
                       </div>
                       <h3 className="font-oswald text-xl font-black uppercase tracking-widest mb-2 text-center max-w-md truncate">{file.name}</h3>
                       <div className="flex items-center gap-4">
                         <span className="font-mono text-xs opacity-40 uppercase">Pages: {pageCount}</span>
                         <span className="font-mono text-xs opacity-40 uppercase">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</span>
                       </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 border-[3px] border-black flex items-center justify-center mb-6 group-hover:bg-[#F9FF00] transition-colors">
                        <Plus size={28} />
                      </div>
                      <span className="font-oswald text-lg font-black uppercase tracking-widest">SELECT_TARGET_PDF</span>
                      <p className="font-inter text-[10px] text-black/40 uppercase tracking-widest mt-2">Maximum file limit: 50MB</p>
                    </>
                  )}
                </div>
              </div>

              {file && (
                <div className="flex flex-col gap-6 mt-4 animate-slide-up">
                  <div className="flex items-center gap-3 px-2">
                    <Settings2 size={16} />
                    <span className="font-oswald text-xs font-black uppercase tracking-widest">EXTRACTION_PARAMETERS</span>
                  </div>
                  <div className="p-8 border-[4px] border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                    <label className="font-oswald text-[10px] font-black uppercase tracking-[0.2em] opacity-40 block mb-4">PAGE_RANGE_SEQUENCE</label>
                    <input 
                      type="text"
                      placeholder="e.g. 1-5, 8, 10-12"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                      className="w-full bg-black/5 border-[3px] border-black p-5 font-mono text-lg outline-none focus:bg-[#F9FF00]/10 transition-all placeholder:opacity-20"
                    />
                    <div className="mt-4 flex items-start gap-3">
                      <HelpCircle size={14} className="shrink-0 mt-0.5 opacity-40" />
                      <p className="font-inter text-[10px] uppercase font-bold tracking-tight opacity-40 leading-relaxed">
                        Specify ranges using hyphens and individual pages using commas. All values must be within 1 and {pageCount}.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8">
             <div className="flex items-center gap-3 px-2">
                <div className="w-2 h-2 bg-black rotate-45" />
                <span className="font-oswald text-xs font-black uppercase tracking-widest">PROCESS_TERMINAL</span>
              </div>
              
              <div className="flex flex-col gap-8 p-8 border-[4px] border-black bg-black text-white shadow-[12px_12px_0px_rgba(0,0,0,1)]">
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={handleSplit}
                    disabled={!file || !pageRange || isProcessing}
                    className="group relative h-20 w-full bg-[#F9FF00] text-black border-[4px] border-black font-oswald font-black uppercase tracking-[0.2em] text-lg transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-30"
                  >
                    <div className="flex items-center justify-center gap-4 relative z-10">
                      {isProcessing ? (
                        <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Scissors size={24} />
                      )}
                      {isProcessing ? "FRAGMENTING" : "EXECUTE_SPLIT"}
                    </div>
                    <div className="absolute inset-0 bg-white translate-x-full group-hover:translate-x-0 transition-transform duration-500 -z-10" />
                  </button>
                </div>

                <div className="flex flex-col gap-4 opacity-40">
                   <div className="flex justify-between border-b border-white/10 pb-2">
                     <span className="font-oswald text-[9px] font-black uppercase tracking-widest">STATUS</span>
                     <span className="font-mono text-[9px]">{file ? "LOADED" : "AWAITING_INPUT"}</span>
                   </div>
                   <div className="flex justify-between border-b border-white/10 pb-2">
                     <span className="font-oswald text-[9px] font-black uppercase tracking-widest">BUFFER_SIZE</span>
                     <span className="font-mono text-[9px]">{file ? (file.size/1024).toFixed(0) + " KB" : "0 KB"}</span>
                   </div>
                </div>
              </div>
          </div>
        </div>
      </div>

      <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
    </ToolLayout>
  );
}
