import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileText, Plus, Trash2, ArrowUp, ArrowDown, Play, ImageIcon, ShieldCheck, Settings2 } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";
import { PDFDocument } from "pdf-lib";

interface QueuedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
}

export default function ImageToPdf() {
  const [images, setImages] = useState<QueuedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageSize, setPageSize] = useState<"A4" | "Fit">("A4");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newImages = selectedFiles.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      file: f,
      preview: URL.createObjectURL(f),
      name: f.name
    }));
    setFiles(prev => [...prev, ...newImages]);
    showToast(`${selectedFiles.length} image(s) added.`, "success");
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const target = prev.find(img => img.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return filtered;
    });
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setImages(newImages);
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      showToast("Please add at least one image.", "error");
      return;
    }

    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const img of images) {
        const imgBytes = await img.file.arrayBuffer();
        let embeddedImage;
        
        if (img.file.type === "image/jpeg" || img.file.type === "image/jpg") {
          embeddedImage = await pdfDoc.embedJpg(imgBytes);
        } else if (img.file.type === "image/png") {
          embeddedImage = await pdfDoc.embedPng(imgBytes);
        } else {
          showToast(`Skipping unsupported format: ${img.name}`, "warning");
          continue;
        }

        const { width, height } = embeddedImage;
        const page = pdfDoc.addPage(pageSize === "A4" ? [595.28, 841.89] : [width, height]);
        
        if (pageSize === "A4") {
          const scale = Math.min(555 / width, 801 / height, 1);
          page.drawImage(embeddedImage, {
            x: (595.28 - width * scale) / 2,
            y: (841.89 - height * scale) / 2,
            width: width * scale,
            height: height * scale,
          });
        } else {
          page.drawImage(embeddedImage, { x: 0, y: 0, width, height });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `clef_images_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast("PDF generated successfully!", "success");
    } catch (err: any) {
      console.error(err);
      showToast("Conversion failed.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout toolId="image-to-pdf">
      <div className="flex flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b-[2px] border-black/5">
          <div className="flex flex-col">
            <span className="font-oswald text-[10px] font-black uppercase tracking-[0.3em] text-[#7C3AED] mb-2">SYSTEM_IMAGE_RASTERIZER</span>
            <h1 className="font-oswald text-4xl md:text-5xl font-black uppercase tracking-tight">IMAGE_TO_PDF</h1>
          </div>
          <div className="flex items-center gap-4 bg-black/5 px-5 py-3 border-[2px] border-black/10">
             <ShieldCheck size={16} className="text-[#00FF87]" />
             <span className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-60">CLIENT_SIDE_ONLY</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <ImageIcon size={16} />
                <span className="font-oswald text-xs font-black uppercase tracking-widest">IMAGE_SEQUENCE ({images.length})</span>
              </div>
              <button onClick={() => setImages([])} className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">CLEAR_QUEUE</button>
            </div>

            <div className="relative group">
               <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-all duration-300" />
               <div className="relative border-[4px] border-black bg-white min-h-[500px] p-6 flex flex-col">
                 {images.length === 0 ? (
                   <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 transition-colors"
                   >
                     <div className="w-20 h-20 border-[3px] border-black flex items-center justify-center mb-6">
                       <Plus size={32} />
                     </div>
                     <span className="font-oswald text-xl font-black uppercase tracking-widest">UPLOAD_SOURCE_IMAGES</span>
                     <p className="font-inter text-xs text-black/40 uppercase tracking-widest mt-2">JPG, PNG supported</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                     {images.map((img, i) => (
                       <div key={img.id} className="group/card relative border-[3px] border-black aspect-[3/4] overflow-hidden bg-[#fafafa]">
                         <img src={img.preview} alt="" className="w-full h-full object-cover grayscale group-hover/card:grayscale-0 transition-all duration-500" />
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                            <div className="flex gap-2">
                              <button onClick={() => moveImage(i, "up")} disabled={i === 0} className="p-2 bg-white border-[2px] border-black hover:bg-[#F9FF00] disabled:opacity-20"><ArrowUp size={14} /></button>
                              <button onClick={() => moveImage(i, "down")} disabled={i === images.length - 1} className="p-2 bg-white border-[2px] border-black hover:bg-[#F9FF00] disabled:opacity-20"><ArrowDown size={14} /></button>
                            </div>
                            <button onClick={() => removeImage(img.id)} className="px-4 py-2 bg-[#FF0004] text-white font-oswald text-[10px] font-black uppercase border-[2px] border-black">REMOVE</button>
                         </div>
                         <div className="absolute top-3 left-3 w-6 h-6 bg-black text-[#F9FF00] font-mono text-[10px] font-bold flex items-center justify-center">
                           {i + 1}
                         </div>
                       </div>
                     ))}
                     <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-[3px] border-dashed border-black/20 aspect-[3/4] flex flex-col items-center justify-center hover:bg-black/5 transition-all group/add"
                     >
                        <Plus size={24} className="opacity-20 group-hover/add:opacity-100" />
                        <span className="font-oswald text-[10px] font-black uppercase opacity-20 group-hover/add:opacity-100 mt-2">ADD_IMAGE</span>
                     </button>
                   </div>
                 )}
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8">
             <div className="flex items-center gap-3 px-2">
                <div className="w-2 h-2 bg-[#7C3AED] rotate-45" />
                <span className="font-oswald text-xs font-black uppercase tracking-widest">PDF_SETTINGS</span>
              </div>

              <div className="flex flex-col gap-8 p-8 border-[4px] border-black bg-black text-white shadow-[12px_12px_0px_rgba(0,0,0,1)]">
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="font-oswald text-[10px] font-black uppercase tracking-[0.2em] opacity-40 block mb-3">PAGE_LAYOUT</label>
                    <div className="grid grid-cols-2 gap-0 border-[2px] border-white/20 overflow-hidden">
                      {["A4", "Fit"].map(size => (
                        <button 
                          key={size}
                          onClick={() => setPageSize(size as any)}
                          className={`py-3 font-oswald text-xs font-bold uppercase tracking-widest transition-all ${pageSize === size ? "bg-[#7C3AED] text-white" : "hover:bg-white/10"}`}
                        >
                          {size === "A4" ? "STANDARD_A4" : "AUTO_FIT"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={handleConvert}
                    disabled={images.length === 0 || isProcessing}
                    className="group relative h-20 w-full bg-[#F9FF00] text-black border-[4px] border-black font-oswald font-black uppercase tracking-[0.2em] text-lg transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-30"
                  >
                    <div className="flex items-center justify-center gap-4 relative z-10">
                      {isProcessing ? (
                        <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Play size={24} />
                      )}
                      {isProcessing ? "COMPILING" : "GENERATE_PDF"}
                    </div>
                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-10" />
                  </button>
                </div>
              </div>
          </div>
        </div>
      </div>

      <input type="file" multiple accept="image/jpeg,image/png" ref={fileInputRef} onChange={handleImageAdd} className="hidden" />
    </ToolLayout>
  );
}
