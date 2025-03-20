import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError("Please select a valid CSV file");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Step 1: Upload the file to ensure it exists
      const uploadResponse = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Failed to upload file");
      }

      const uploadResult = await uploadResponse.json();
      const fileName = uploadResult.filePath.split("/").pop();

      // Step 2: Process the uploaded file
      const processResponse = await fetch(`http://localhost:3000/api/process/${fileName}`, {
        method: "POST",
      });

      if (!processResponse.ok) {
        const errorData = await processResponse.json();
        throw new Error(errorData.error || "Failed to process file");
      }

      const result = await processResponse.json();
      setSuccess(`Successfully processed ${result.recordCount} records`);
      onUploadSuccess(result);
    } catch (err) {
      setError(err.message || "An error occurred during file upload");
    } finally {
      setIsUploading(false);
      setFile(null);
      setProgress(0);
    }
  };

  useEffect(()=>{
    if(isUploading){
      const interval = setInterval(()=>{
        setProgress((prev)=>{
          if(prev >= 100){
            clearInterval(interval)
            return 0
          }
          return prev + 10
        })
      }, 500)
      return ()=> clearInterval(interval)
    } 
  
  })

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Upload CSV File</CardTitle>
        <CardDescription>Upload a CSV file to convert to JSON and store in the database.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Input id="file" type="file" onChange={handleFileChange} accept=".csv" disabled={isUploading} />
          </div>
          {file && (
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="mr-2 h-4 w-4" />
              <span>{file.name}</span>
            </div>
          )}

          {isUploading && <Progress value={progress} />}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Success</AlertTitle>
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => { setFile(null); setError(null); setSuccess(null); }} disabled={isUploading || !file}>
          Cancel
        </Button>
        <Button onClick={handleUpload} disabled={isUploading || !file}>
          {isUploading ? "Uploading..." : "Upload"} {!isUploading && <Upload className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileUpload;
