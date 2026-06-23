"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import api from "@/lib/api";

export default function AttendancePage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // ✅ Clean state (no default text)
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState(false);

  // -----------------------------
  // INIT MODELS + CAMERA
  // -----------------------------
  useEffect(() => {
    const init = async () => {
      try {
        const MODEL_URL = "/models";

        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          await new Promise((resolve) => {
            videoRef.current!.onloadedmetadata = () => {
              videoRef.current!.play();
              resolve(true);
            };
          });
        }

        setReady(true); // ✅ system ready silently
      } catch (err) {
        console.error(err);
        setStatus("Initialization failed");
      }
    };

    init();
  }, []);

  // -----------------------------
  // MARK ATTENDANCE
  // -----------------------------
  const markAttendance = async () => {
    try {
      if (!videoRef.current) {
        setStatus("Camera not ready");
        return;
      }

      setStatus("Scanning face...");

      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,
            scoreThreshold: 0.45,
          })
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection || !detection.descriptor) {
        setStatus("Face not detected");
        return;
      }

      const descriptor = Array.from(detection.descriptor);

      if (descriptor.length !== 128) {
        setStatus("Invalid face data");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setStatus("Authentication required");
        return;
      }

      setStatus("Submitting attendance...");

      const res = await api.post(
        "http://localhost:5000/attendance/mark",
        {
          faceDescriptor: descriptor,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus(res.data.message || "Attendance recorded");
    } catch (err: any) {
      console.error(err);
      setStatus(err?.response?.data?.message || "Request failed");
    }
  };

  // -----------------------------
  // STATUS COLOR
  // -----------------------------
  const getStatusColor = () => {
    if (
      status.toLowerCase().includes("fail") ||
      status.toLowerCase().includes("not")
    ) {
      return "text-red-600";
    }

    if (
      status.toLowerCase().includes("recorded") ||
      status.toLowerCase().includes("success")
    ) {
      return "text-green-600";
    }

    return "text-gray-500";
  };

  // -----------------------------
  // UI
  // -----------------------------
 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">

    {/* Header */}
    <header className="flex justify-between items-center px-8 py-5 bg-white/70 backdrop-blur-md border-b shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
        Employee Attendance
      </h1>
      <span className="text-lg text-black font-medium">
        Face Recognition System
      </span>
    </header>

    {/* Main */}
    <main className="flex flex-1 items-center justify-center px-4 py-10 -mt-6">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl p-6   -translate-y-10">

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-800 mb-5 ">
            Mark Attendance
          </h2>
          <p className="text-sm text-black mb-5">
            Position your face clearly in the frame
          </p>

          {/* Camera Frame */}
          <div className="relative rounded-xl overflow-hidden border bg-black mb-5 group">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-auto object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 border-2 border-dashed border-white/40 rounded-xl pointer-events-none group-hover:border-blue-400 transition" />

            {/* Status Dot */}
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/60 px-2 py-1 rounded-full text-xs text-white">
              <span className={`w-2 h-2 rounded-full ${
                ready ? "bg-green-400 animate-pulse" : "bg-gray-400"
              }`} />
              {ready ? "Ready" : "Loading"}
            </div>
          </div>

          {/* Button */}
          <button
            onClick={markAttendance}
            disabled={!ready}
            className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-200
              ${
                ready
                  ? "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-md"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {ready ? "Scan & Mark Attendance" : "Initializing..."}
          </button>

          {/* Status */}
          {status && (
            <div className="mt-4 text-center">
              <p className={`text-sm font-medium ${getStatusColor()}`}>
                {status}
              </p>
            </div>
          )}

        </div>

        {/* Footer Note */}
        <p className="text-center text-m text-black ">
          Ensure proper lighting for accurate detection
        </p>

      </div>
    </main>
  </div>
);
}