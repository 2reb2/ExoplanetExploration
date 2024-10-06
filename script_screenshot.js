let capturedCanvasScreenshot;

document.getElementById('saveImageBtn').addEventListener('click', () => {
    console.log("Taking screenshot...");
    setTimeout(() => {
        html2canvas(document.getElementById('exoplanetCanvas')).then(canvasScreenshot => {
            capturedCanvasScreenshot = canvasScreenshot; 

            const screenshotDataUrl = canvasScreenshot.toDataURL();

            const overlayCanvas = document.createElement('canvas');
            overlayCanvas.width = canvasScreenshot.width;
            overlayCanvas.height = canvasScreenshot.height;
            const overlayContext = overlayCanvas.getContext('2d');

            overlayContext.drawImage(canvasScreenshot, 0, 0);

            const frameImage = new Image();
            frameImage.src = 'frame.png'; 

            frameImage.onload = () => {
                overlayContext.drawImage(frameImage, 0, 0, overlayCanvas.width, overlayCanvas.height);

                document.getElementById('planetImage').src = overlayCanvas.toDataURL();

                document.getElementById('imageModal').style.display = 'flex';

                console.log("Canvas width:", document.getElementById('exoplanetCanvas').width);
                console.log("Canvas height:", document.getElementById('exoplanetCanvas').height);
            };
        });
    }, 100); 
});

document.getElementById('confirmDownloadBtn').addEventListener('click', () => {
    const planetName = document.getElementById('planetNameInput').value || 'exoplanet';
    
    const finalImageCanvas = document.createElement('canvas');
    finalImageCanvas.width = capturedCanvasScreenshot.width;
    finalImageCanvas.height = capturedCanvasScreenshot.height;
    const finalContext = finalImageCanvas.getContext('2d');

    const planetImageSrc = document.getElementById('planetImage').src;
    const planetImage = new Image();
    planetImage.src = planetImageSrc;

    planetImage.onload = () => {
        finalContext.drawImage(planetImage, 0, 0, finalImageCanvas.width, finalImageCanvas.height);

        finalContext.font = '30px Consolas';
        finalContext.fillStyle = 'white'; 
        const textX = 110; 
        const textY = finalImageCanvas.height - 80; 
        finalContext.fillText(planetName, textX, textY); 

        const link = document.createElement('a');
        link.href = finalImageCanvas.toDataURL('image/png');
        link.download = `${planetName}.png`;
        link.click();
    };
});

document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('imageModal').style.display = 'none';
});
