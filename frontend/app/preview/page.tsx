"use client";
import { useState } from "react";

export default function PreviewPage() {
  const [fullUrl, setFullUrl] = useState<string>(""); // State for the full URL input
  const [iframeUrl, setIframeUrl] = useState<string>(""); // URL to be used in the iframe
  const [error, setError] = useState<string>(""); // State for error messages

  const handlePreview = () => {
    // Validate the full URL
    if (!fullUrl.startsWith("https://nusmods.com/timetable/")) {
      setError("Please enter a valid NUSMods timetable URL.");
      setIframeUrl(""); // Clear the iframe
      return;
    }

    setError(""); // Clear previous errors
    setIframeUrl(fullUrl); // Set the URL for the iframe
  };

  return (
    <div className="min-h-screen bg-mainbg text-white flex flex-col items-center py-10">
      {/* Header */}
      <h1 className="text-3xl font-bold text-orange mb-8">
        NUSMods Timetable Preview
      </h1>

      {/* Input Section */}
      <div className="w-full max-w-4xl flex flex-col items-center gap-4 px-4">
        <div className="w-full flex flex-col md:flex-row items-center gap-4">
          {/* Input Field */}
          <input
            type="text"
            placeholder="Enter full NUSMods timetable URL"
            value={fullUrl}
            onChange={(e) => setFullUrl(e.target.value)}
            className="w-full bg-mainbg border border-gray-600 text-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-orange focus:outline-none"
          />

          {/* Preview Button */}
          <button
            onClick={handlePreview}
            className="bg-orange text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-all duration-300"
          >
            Preview
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Timetable Preview Section */}
      {iframeUrl && (
        <div className="mt-8 w-full flex justify-center">
          <iframe
            src={iframeUrl}
            width="90%"
            height="600"
            className="border border-gray-600 rounded-md shadow-lg"
            title="NUSMods Timetable"
          />
        </div>
      )}
    </div>
  );
}
