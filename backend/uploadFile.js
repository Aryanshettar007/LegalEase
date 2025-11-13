import dotenv from "dotenv";
import fs from "fs";
import { GoogleAIFileManager } from "@google/generative-ai/server";

dotenv.config();

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

async function uploadFile(filePath, displayName) {
  try {
    const upload = await fileManager.uploadFile(filePath, {
      mimeType: "application/pdf",
      displayName,
    });

    console.log("Uploaded:", upload.file.name);

    // Save file ID to local JSON
    const fileData = { fileId: upload.file.name };
    fs.writeFileSync("fileId.json", JSON.stringify(fileData, null, 2));
    console.log("File ID saved to fileId.json");

    return upload.file.name;
  } catch (err) {
    console.error("Upload failed:", err);
  }
}

// Run directly if executed
if (process.argv[2]) {
  const filePath = process.argv[2]; // e.g., "constitution.pdf"
  const displayName = process.argv[3] || "Uploaded PDF";
  uploadFile(filePath, displayName);
}

export default uploadFile;
