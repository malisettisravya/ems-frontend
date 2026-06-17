"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { toast } from "sonner"; // ✅ FIXED
import api from "@/lib/api";

export default function RegisterFace() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [descriptor, setDescriptor] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startCamera();
    loadModels();
  }, []);

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const captureFace = async () => {
    if (!videoRef.current) return;

    const detection = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      toast.error("No face detected ❌");
      return;
    }

    setDescriptor(Array.from(detection.descriptor));
    toast.success("Face captured successfully ✅");
  }; // ✅ FIXED (missing closing brace earlier)

  const registerFace = async () => {
    if (!descriptor) {
      toast.error("Please capture face first");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current!.videoWidth;
      canvas.height = videoRef.current!.videoHeight;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(videoRef.current!, 0, 0);

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg")
      );

      const formData = new FormData();
      formData.append("image", blob, "face.jpg");
      formData.append("faceDescriptor", JSON.stringify(descriptor));

      await api.post("/employee/register-face", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Face registered successfully 🎉"); // ✅ replaced alert
      setDescriptor(null);
    } catch (err) {
      console.log(err);
      toast.error("Error registering face ❌"); // ✅ replaced alert
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT - CAMERA */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Live Camera</h2>

          <div className="rounded-xl overflow-hidden border-4 border-gray-300 shadow-md">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-[350px] h-[280px] object-cover"
            />
          </div>

          <button
            onClick={captureFace}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            📸 Capture Face
          </button>
        </div>

        {/* RIGHT - ACTION PANEL */}
        <div className="flex flex-col justify-center items-center text-center">

          <h1 className="text-2xl font-bold mb-2">
            Face Registration
          </h1>

          <p className="text-gray-500 mb-6">
            Capture your face and register for attendance system
          </p>

          {descriptor ? (
            <div className="text-green-600 mb-4">
              ✅ Face captured successfully
            </div>
          ) : (
            <div className="text-gray-400 mb-4">
              No face captured yet
            </div>
          )}

          <button
            onClick={registerFace}
            disabled={!descriptor || loading}
            className={`px-6 py-2 rounded-lg text-white ${
              !descriptor || loading
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Registering..." : "🧾 Register Face"}
          </button>

        </div>
      </div>
    </div>
  );
}