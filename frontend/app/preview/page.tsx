"use client";
<<<<<<< HEAD
import { useState, useEffect } from "react";
import html2canvas from "html2canvas";

export default function PreviewPage() {
  const [fullUrl, setFullUrl] = useState<string>(""); // State for the full URL input
  const [error, setError] = useState<string>(""); // State for error messages
  const [screenshot, setScreenshot] = useState<string>(""); // State for the screenshot image
  const [htmlContent, setHtmlContent] = useState<string>(""); // State for fetched HTML

  // Function to fetch HTML and render it locally
  const fetchHtmlContent = async (url: string) => {
    try {
      const response = await fetch(url, { mode: "cors" }); // Ensure CORS is enabled
      if (!response.ok) {
        throw new Error("Failed to fetch HTML content.");
      }

      const html = await response.text();
      setHtmlContent(html); // Save HTML for rendering
    } catch (err) {
      console.error("Error fetching HTML:", err);
      setError("Failed to fetch HTML content. Ensure the URL supports CORS.");
    }
  };

  // Function to capture a screenshot of the rendered content
  const captureScreenshot = async () => {
    const container = document.getElementById("html-preview");
    if (container) {
      try {
        const canvas = await html2canvas(container);
        const screenshotData = canvas.toDataURL("image/png");
        setScreenshot(screenshotData); // Save the screenshot
      } catch (err) {
        console.error("Error capturing screenshot:", err);
        setError("Failed to capture the screenshot.");
      }
    }
  };

  const handlePreview = async () => {
    if (!fullUrl.startsWith("http")) {
      setError("Please enter a valid URL.");
      setHtmlContent(""); // Clear previous content
      setScreenshot(""); // Clear previous screenshot
      return;
    }
    setError("");
    setHtmlContent(""); // Clear previous content
    setScreenshot(""); // Clear previous screenshot

    await fetchHtmlContent(fullUrl);
=======
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
>>>>>>> dev
  };

  return (
    <div className="min-h-screen bg-mainbg text-white flex flex-col items-center py-10">
      {/* Header */}
      <h1 className="text-3xl font-bold text-orange mb-8">
<<<<<<< HEAD
        Page Screenshot Preview
=======
        NUSMods Timetable Preview
>>>>>>> dev
      </h1>

      {/* Input Section */}
      <div className="w-full max-w-4xl flex flex-col items-center gap-4 px-4">
        <div className="w-full flex flex-col md:flex-row items-center gap-4">
          {/* Input Field */}
          <input
            type="text"
<<<<<<< HEAD
            placeholder="Enter the full URL"
=======
            placeholder="Enter full NUSMods timetable URL"
>>>>>>> dev
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

<<<<<<< HEAD
      {/* HTML Content Rendering Section */}
      {htmlContent && (
        <div className="mt-8 w-full max-w-4xl">
          <h2 className="text-lg font-bold text-orange mb-4">HTML Preview</h2>
          <div
            id="html-preview"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            className="bg-white text-black p-4 border border-gray-600 rounded-md overflow-auto max-h-[600px]"
          ></div>
          {/* Screenshot Button */}
          <button
            onClick={captureScreenshot}
            className="mt-4 bg-orange text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-all duration-300"
          >
            Capture Screenshot
          </button>
        </div>
      )}

      {/* Screenshot Display Section */}
      {screenshot && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-orange mb-4">Screenshot</h2>
          <img
            src={screenshot}
            alt="Screenshot"
            className="border border-gray-600 rounded-md shadow-lg"
=======
      {/* Timetable Preview Section */}
      {iframeUrl && (
        <div className="mt-8 w-full flex justify-center">
          <iframe
            src={iframeUrl}
            width="90%"
            height="600"
            className="border border-gray-600 rounded-md shadow-lg"
            title="NUSMods Timetable"
>>>>>>> dev
          />
        </div>
      )}
    </div>
  );
}
