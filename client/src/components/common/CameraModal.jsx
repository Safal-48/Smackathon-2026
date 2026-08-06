import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCw, Check, X, SwitchCamera, AlertCircle } from 'lucide-react';

export const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
  const [errorMsg, setErrorMsg] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  // Start Video Stream
  const startCamera = async (mode = facingMode) => {
    setIsStarting(true);
    setErrorMsg(null);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setErrorMsg('Could not access camera. Please allow camera permissions in your browser or select an image file from your device.');
    } finally {
      setIsStarting(false);
    }
  };

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera(facingMode);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedImage(dataUrl);

    // Stop stream tracks
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      handleClose();
    }
  };

  const toggleCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setCapturedImage(null);
    setErrorMsg(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-lg glass-panel p-5 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 relative bg-slate-950/95 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Live Crop & Soil Camera</h3>
                <p className="text-[11px] text-slate-400">Snap real-time crop photo for AI diagnostic</p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Camera Viewport / Captured Preview */}
          <div className="relative aspect-[4/3] rounded-2xl bg-black overflow-hidden border border-slate-800 flex items-center justify-center">
            {errorMsg ? (
              <div className="p-6 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <p className="text-xs text-slate-300 leading-relaxed">{errorMsg}</p>
                <button
                  onClick={() => startCamera()}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold"
                >
                  Retry Camera Access
                </button>
              </div>
            ) : capturedImage ? (
              <img src={capturedImage} alt="Captured crop/soil" className="w-full h-full object-cover" />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {isStarting && (
                  <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center text-xs text-slate-300 font-bold gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    Connecting Camera Stream...
                  </div>
                )}
                {/* Camera Viewfinder Overlay Grid */}
                <div className="absolute inset-4 border border-emerald-500/30 rounded-xl pointer-events-none flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-emerald-400/60 rounded-full animate-ping" />
                </div>
              </>
            )}

            {/* Hidden canvas for taking snapshot */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Controls Footer */}
          <div className="flex items-center justify-between pt-1">
            {capturedImage ? (
              <>
                <button
                  onClick={handleRetake}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                  Retake Photo
                </button>

                <button
                  onClick={handleConfirm}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/60 transition-all hover:opacity-90"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  Use Photo
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleCamera}
                  disabled={!!errorMsg}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                  title="Switch Camera (Front/Back)"
                >
                  <SwitchCamera className="w-4 h-4 text-cyan-400" />
                  <span>Switch</span>
                </button>

                <button
                  onClick={handleCapture}
                  disabled={!!errorMsg || isStarting}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-950/80 hover:scale-105 active:scale-95 transition-all"
                >
                  <Camera className="w-5 h-5" />
                  Capture Photo
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
