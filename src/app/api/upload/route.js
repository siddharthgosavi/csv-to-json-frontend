import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// Create a function to ensure the uploads directory exists
async function ensureUploadsDir() {
  const uploadsDir = join(process.cwd(), "uploads");
  try {
    await mkdir(uploadsDir, { recursive: true });
    return uploadsDir;
  } catch (error) {
    console.error("Error creating uploads directory:", error);
    throw error;
  }
}

export async function POST(request) {
  try {
    // Check if the request contains a file
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Make sure the file is a CSV
    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Only CSV files are allowed" },
        { status: 400 }
      );
    }

    // Get the file's buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = await ensureUploadsDir();

    // Create a unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + "-" + file.name;
    const filePath = join(uploadsDir, filename);

    // Write the file to disk
    await writeFile(filePath, buffer);

    // Return success response
    return NextResponse.json({
      message: "File uploaded successfully",
      filename: filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Error uploading file" },
      { status: 500 }
    );
  }
}
