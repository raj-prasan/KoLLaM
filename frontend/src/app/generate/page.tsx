"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from '../components/Navbar.tsx';

export default function KolamGenerator() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [size, setSize] = useState<number>(8); // default value
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (size < 2 || size > 50) {
      alert("Size must be between 2 and 50");
      return;
    }

    setLoading(true);
    setImageUrl(null); // reset previous image

    try {
      const res = await fetch("http://localhost:8081/generate-kolam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ size }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Error generating kolam:", text);
        alert("Failed to generate kolam: " + text);
        return;
      }

      const blob = await res.blob();
      if (!blob.size) {
        alert("No image returned from backend");
        return;
      }

      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      console.error("Error fetching Kolam:", err);
      alert("Something went wrong while generating Kolam.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-pink-50 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-purple-100"
      >
        <h1 className="text-3xl font-extrabold text-center text-purple-700 mb-6 tracking-tight">
          ✨ Kolam Generator
        </h1>

        <div className="flex items-center justify-center gap-3 mb-6">
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-28 px-3 py-2 border border-purple-200 rounded-xl shadow-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Size"
            min={2}
            max={50}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-6 py-2 rounded-xl shadow-lg transition-transform ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src={imageUrl}
              alt="Generated Kolam"
              className="rounded-2xl border border-purple-100"
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  </>
  );
}
