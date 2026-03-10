import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Image, Download, Wand2, AlertCircle, Check, Loader2 } from 'lucide-react';

// Define the global window interface for AI Studio helpers
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const PRESET_PROMPTS = [
  "Doctor consulting a patient online via video call",
  "Patient using a mobile app for telemedicine consultation",
  "Modern pharmacy interior with shelves of medicines",
  "Medical supplies: medicine bottles, pills, syringes, prescription pad",
  "Hospital equipment: stethoscope, thermometer, medical kit on a clean surface",
  "Online appointment booking interface on a laptop screen",
  "Digital prescription document with medical icons",
  "Medicine delivery drone or courier handing package to patient"
];

const STYLE_SUFFIX = ", flat or modern 3D illustration style, clean, minimal, and professional, medical color theme (blue, green, white), friendly and trustworthy appearance, white background, high quality, detailed.";

export default function IllustrationGenerator() {
  const [prompt, setPrompt] = useState(PRESET_PROMPTS[0]);
  const [size, setSize] = useState<"1K" | "2K" | "4K">("1K");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeySelected, setApiKeySelected] = useState(false);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    if (window.aistudio?.hasSelectedApiKey) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setApiKeySelected(hasKey);
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      await checkApiKey();
    } else {
      setError("AI Studio API Key selection is not available in this environment.");
    }
  };

  const generateImage = async () => {
    if (!apiKeySelected) {
      await handleSelectKey();
      if (!apiKeySelected) return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Initialize the client with the selected API key (handled by environment)
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

      const fullPrompt = `${prompt} ${STYLE_SUFFIX}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            { text: fullPrompt }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1", // Default square for icons/illustrations
            imageSize: size
          }
        }
      });

      let imageUrl = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        throw new Error("No image data received from the model.");
      }

    } catch (err: any) {
      console.error("Image generation error:", err);
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `apna-hospital-illustration-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medical Illustration Generator</h1>
          <p className="text-slate-500 mt-1">Generate consistent, professional assets for your platform.</p>
        </div>
        {!apiKeySelected && (
          <button
            onClick={handleSelectKey}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
          >
            Connect API Key
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Quick Presets
              </label>
              <select
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
              >
                {PRESET_PROMPTS.map((p, i) => (
                  <option key={i} value={p}>{p.substring(0, 40)}...</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Custom Prompt
              </label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="block w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
                placeholder="Describe the medical illustration..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Resolution
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["1K", "2K", "4K"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                      size === s
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateImage}
              disabled={loading}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="-ml-1 mr-2 h-4 w-4" />
                  Generate Illustration
                </>
              )}
            </button>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Style Applied Automatically</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    All images will be generated in a consistent <strong>flat/modern 3D medical style</strong> with a blue/green/white palette.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full min-h-[500px] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-medium text-slate-900">Preview</h3>
              {generatedImage && (
                <button
                  onClick={downloadImage}
                  className="inline-flex items-center px-3 py-1.5 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="-ml-1 mr-2 h-4 w-4" />
                  Download
                </button>
              )}
            </div>
            
            <div className="flex-1 p-6 flex items-center justify-center bg-slate-50 rounded-b-xl overflow-hidden relative">
              {loading ? (
                <div className="text-center">
                  <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Creating your masterpiece...</p>
                  <p className="text-slate-400 text-sm mt-1">This may take a few seconds.</p>
                </div>
              ) : error ? (
                <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-red-100">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-red-800 mb-2">Generation Failed</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              ) : generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated Medical Illustration"
                  className="max-w-full max-h-[600px] object-contain rounded-lg shadow-lg"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <Image className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No image generated yet</p>
                  <p className="text-sm mt-1">Select a prompt and click Generate to start.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
