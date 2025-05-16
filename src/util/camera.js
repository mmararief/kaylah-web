let stream = null;

export const initCamera = async (video, canvas, captureButton, photoInput) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error('Camera API not supported');
    return false;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 } 
      } 
    });
    
    video.srcObject = stream;
    await video.play().catch((error) => {
      if (error.name === 'NotAllowedError' || error.name === 'NotFoundError') {
        console.error('Camera access denied or not found:', error);
        return false;
      } else if (error.name === 'AbortError') {
        // Ignore play() request interrupted error
        console.warn('Video play() request was interrupted:', error);
      } else {
        console.error('Failed to play video:', error);
        return false;
      }
    });
    
    return true;
  } catch (err) {
    console.error('Failed to access camera:', err);
    return false;
  }
};

export const capturePhoto = (video, canvas) => {
  if (!video || !canvas) return null;
  
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(blob);
    }, 'image/jpeg', 0.9);
  });
};

export const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
};
