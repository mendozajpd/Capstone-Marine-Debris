import React, { useState, useRef, useEffect } from 'react';

const ClientWebCam = () => {
  const [stream, setStream] = useState(null);
  const canvasRef = useRef(null);

  const handleStartWebcam = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true
    });
    setStream(mediaStream);
  };

  const handleStopWebcam = () => {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    setStream(null);
  };

  useEffect(() => {
    if (!stream) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();

    const render = () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');
      sendFrameToServer(imageData);
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    return () => {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    };
  }, [stream]);

  const sendFrameToServer = async (imageData) => {
    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image: imageData })
    });
    const data = await response.json();
    // Handle the response data as needed
    console.log(data)
  };

  return (
    <div style={{display:'grid'}}>
      <h1>Simple Webcam with React </h1>
      <button onClick={handleStartWebcam}>Start Webcam</button>
      <button onClick={handleStopWebcam}>Stop Webcam</button>
      <canvas ref={canvasRef} width={640} height={480} />
    </div>
  );
};

export default ClientWebCam;




sudo chown -R www-data:www-data /var/www/html/storage
sudo chmod -R 755 /var/www/html/storage
mkdir -p /var/www/html/storage/app/public/videos
sudo chown -R www-data:www-data /var/www/html/storage/app/public/videos
sudo chmod -R 755 /var/www/html/storage/app/public/videos
php artisan storage:link
