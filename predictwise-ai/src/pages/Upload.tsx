import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  Image,
  X,
  Loader2,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  status: "pending" | "processing" | "done" | "error";
  year?: string;
}

const UploadPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [examName, setExamName] = useState("");
  const [subject, setSubject] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
      status: "pending" as const,
      year: "",
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    toast.success(`${acceptedFiles.length} file(s) added`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "text/plain": [".txt"],
    },
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFileYear = (id: string, year: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, year } : f))
    );
  };

  const handleAnalyze = async () => {
    if (files.length < 2) {
      toast.error("Please upload at least 2 question papers");
      return;
    }
    if (!examName || !subject) {
      toast.error("Please fill in exam name and subject");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('examName', examName);
      formData.append('subject', subject);
      formData.append('subjectCode', 'KCS301'); // Default for now, can be made dynamic

      files.forEach((file, index) => {
        formData.append('files', file.file);
        formData.append(`year_${file.file.name}`, file.year || new Date().getFullYear().toString());
      });

      // Update file statuses to processing
      setFiles(prev => prev.map(f => ({ ...f, status: "processing" })));

      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Try to extract server-provided error message
        let errMsg = response.statusText;
        try {
          const body = await response.text();
          try {
            const json = JSON.parse(body);
            if (json.error) errMsg = json.error;
            else if (json.message) errMsg = json.message;
          } catch (e) {
            if (body) errMsg = body;
          }
        } catch (e) {
          // ignore
        }
        throw new Error(`Analysis failed: ${errMsg}`);
      }

      const result = await response.json();

      // Update file statuses to done
      setFiles(prev => prev.map(f => ({ ...f, status: "done" })));

      toast.success("Analysis complete! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard", {
          state: {
            subjectCode: 'KCS301',
            analysis: result.analysis,
            subject: subject
          }
        });
      }, 1500);

    } catch (error: any) {
      console.error('Analysis error:', error);
      const message = error?.message || 'Analysis failed. Please try again.';
      // Show a more detailed toast if available
      toast.error(message);
      setFiles(prev => prev.map(f => ({ ...f, status: "error" })));
    } finally {
      setIsProcessing(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return Image;
    return FileText;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Upload Your <span className="text-gradient">Question Papers</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Upload 5-10 years of previous question papers. Our AI will analyze
                patterns and generate predictions for your upcoming exam.
              </p>
            </div>

            {/* Exam Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Exam Name
                </label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g., JEE Main, NEET, CBSE Class 12"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Physics, Mathematics, Biology"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {isDragActive
                  ? "Drop your files here"
                  : "Drag & drop question papers"}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Supports PDF, images (PNG, JPG), and text files
              </p>
              <Button variant="outline" size="sm">
                Browse Files
              </Button>
            </div>

            {/* Uploaded Files */}
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <h3 className="font-semibold mb-4">
                  Uploaded Files ({files.length})
                </h3>
                <div className="space-y-3">
                  {files.map((file) => {
                    const FileIcon = getFileIcon(file.file);
                    return (
                      <div
                        key={file.id}
                        className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
                      >
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          {file.preview ? (
                            <img
                              src={file.preview}
                              alt=""
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <FileIcon className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {file.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(file.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <input
                          type="text"
                          value={file.year}
                          onChange={(e) => updateFileYear(file.id, e.target.value)}
                          placeholder="Year"
                          className="w-20 px-2 py-1 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                        <div className="w-8 flex-shrink-0">
                          {file.status === "pending" && (
                            <button
                              onClick={() => removeFile(file.id)}
                              className="p-1 hover:bg-muted rounded-lg transition-colors"
                              title="Remove file"
                            >
                              <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                          )}
                          {file.status === "processing" && (
                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                          )}
                          {file.status === "done" && (
                            <CheckCircle className="w-5 h-5 text-accent" />
                          )}
                          {file.status === "error" && (
                            <AlertCircle className="w-5 h-5 text-destructive" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Analyze Button */}
                <div className="mt-8 text-center">
                  <Button
                    variant="hero"
                    size="xl"
                    onClick={handleAnalyze}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Analyzing Papers...
                      </>
                    ) : (
                      <>
                        Start AI Analysis
                        <ArrowRight className="w-5 h-5 ml-1" />
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-3">
                    Analysis typically takes 2-5 minutes depending on file count
                  </p>
                </div>
              </motion.div>
            )}

            {/* Tips */}
            <div className="mt-12 p-6 bg-muted/50 rounded-2xl">
              <h3 className="font-semibold mb-3">Tips for Best Results</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  Upload at least 5 years of question papers for accurate predictions
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  Ensure PDF files are clear and readable (not heavily compressed)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  Add the year for each paper to improve trend analysis
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  Upload papers from the same exam board/type for consistency
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UploadPage;
