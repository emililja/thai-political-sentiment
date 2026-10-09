/**
 * Utility to reliably export SVG elements as standalone SVG files or high-resolution PNGs.
 * Ensures:
 * 1. Explicit width, height, and viewBox attributes so intrinsic dimensions are never miscalculated.
 * 2. Proper XML namespaces (xmlns and xmlns:xlink).
 * 3. Opaque white background rect so the exported image is never transparent or cropped.
 * 4. Exact canvas dimensions and drawImage(img, 0, 0, canvas.width, canvas.height)
 *    to completely eliminate double-scaling or quadrant cropping (e.g. Q2-only bug).
 */

export function downloadSvg(
  svgElement: SVGSVGElement,
  filename: string,
  width: number,
  height: number
): void {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;

  // Set explicit dimensions and namespaces
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  clone.setAttribute('width', `${width}`);
  clone.setAttribute('height', `${height}`);
  clone.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // Prepend solid white background rect
  const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bgRect.setAttribute('x', '0');
  bgRect.setAttribute('y', '0');
  bgRect.setAttribute('width', `${width}`);
  bgRect.setAttribute('height', `${height}`);
  bgRect.setAttribute('fill', '#FFFFFF');
  clone.insertBefore(bgRect, clone.firstChild);

  // Add default font style
  const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  styleEl.textContent = `
    text { font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  `;
  clone.insertBefore(styleEl, clone.firstChild);

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(clone);

  // Ensure xmlns is present
  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // Prepend XML declaration
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadPng(
  svgElement: SVGSVGElement,
  filename: string,
  width: number,
  height: number,
  scale: number = 2
): void {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;

  // Set explicit dimensions and namespaces
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  clone.setAttribute('width', `${width}`);
  clone.setAttribute('height', `${height}`);
  clone.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // Prepend solid white background rect
  const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bgRect.setAttribute('x', '0');
  bgRect.setAttribute('y', '0');
  bgRect.setAttribute('width', `${width}`);
  bgRect.setAttribute('height', `${height}`);
  bgRect.setAttribute('fill', '#FFFFFF');
  clone.insertBefore(bgRect, clone.firstChild);

  // Add default font style
  const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  styleEl.textContent = `
    text { font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  `;
  clone.insertBefore(styleEl, clone.firstChild);

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(clone);

  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fill canvas background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the entire image over the entire canvas (0, 0, canvas.width, canvas.height)
      // This strictly prevents double-scaling or cropping into any quadrant!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      try {
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Failed to export PNG:', err);
      }
    }
    URL.revokeObjectURL(url);
  };

  img.onerror = (err) => {
    console.error('Failed to load SVG into Image for PNG conversion:', err);
    URL.revokeObjectURL(url);
  };

  img.src = url;
}

