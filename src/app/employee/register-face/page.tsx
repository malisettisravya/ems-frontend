"use client";

import { useEffect, useRef, useState } from "react";
import faceapi, { loadModels } from "@/lib/faceapi";
import api from "@/lib/api";

export default function RegisterFace() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startCamera();
    loadModels();
  }, []);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  const capture = async () => {
    setLoading(true);

    const detection = await faceapi
      .detectSingleFace(videoRef.current!, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("No face detected");
      setLoading(false);
      return;
    }

    const descriptor = Array.from(detection.descriptor);

    await api.post("/employee/register-face", {
      userId: "EMP001", // replace with real userId
      descriptor,
    });

    alert("Face Registered Successfully");
    setLoading(false);
  };

  return (
    <div>
      <h1>Register Face</h1>

      <video
        ref={videoRef}
        autoPlay
        muted
        width={400}
        height={300}
        style={{ border: "1px solid black" }}
      />

      <button onClick={capture} disabled={loading}>
        {loading ? "Processing..." : "Capture & Register"}
      </button>
    </div>
  );
}