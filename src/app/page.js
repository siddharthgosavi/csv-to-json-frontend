"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ResultsTable from "@/components/ResultsTable";

export default function Home() {
  const [results, setResults] = useState(null);

  const handleUploadSuccess = (data) => {
    setResults(data);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
      <div className="flex flex-col items-center w-full max-w-4xl gap-8">
        <h1 className="text-3xl font-bold mb-6">
          Coding Challenge - Backend Developer
        </h1>

        <FileUpload onUploadSuccess={handleUploadSuccess} />

        {results && <ResultsTable data={results} />}
      </div>
    </main>
  );
}
