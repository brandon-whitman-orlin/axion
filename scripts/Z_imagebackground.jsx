import React, { useEffect } from 'react';

const Z_imagebackground = () => {
  useEffect(() => {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      try {
        const url = new URL(img.src);
        const parts = url.pathname.split('/');
        const filename = parts.pop();

        const dotIndex = filename.lastIndexOf('.');
        if (dotIndex === -1) {
          console.warn('Filename has no extension:', filename);
          return;
        }

        const name = filename.slice(0, dotIndex);
        const ext = filename.slice(dotIndex);
        const newFilename = `${name}_lowres${ext}`;
        parts.push(newFilename);

        const newPath = parts.join('/');
        const newUrl = `${url.origin}${newPath}`;

        // Apply as background-image to the <img> itself
        img.style.backgroundImage = `url('${newUrl}')`;
        img.style.backgroundSize = 'cover';
        img.style.backgroundPosition = 'center';
        img.style.backgroundRepeat = 'no-repeat';

        console.log(`Set background-image for ${img.src} to ${newUrl}`);
      } catch (e) {
        console.warn('Could not parse image src:', img.src);
      }
    });
  }, []);

  return null;
};

export default Z_imagebackground;
