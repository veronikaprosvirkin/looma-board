export async function exportPostCard(post) {
  if (!post) return;

  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 960;
  const ctx = canvas.getContext('2d');


  ctx.fillStyle = '#141e18';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#2a3b31';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

  let textStartY = 110;
  if (post.imageUrl) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = post.imageUrl;
      });
      ctx.drawImage(img, 48, 48, canvas.width - 96, 420);
      textStartY = 525;
    } catch {
    }
  }

  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = post.status === 'memory' ? '#e88d72' : '#72b8e8';
  ctx.fillText(post.status === 'memory' ? '• СПОГАД' : '• ПЛАН', 54, textStartY);

  ctx.fillStyle = '#9aa89f';
  ctx.font = '20px sans-serif';
  ctx.fillText(post.date || '', 54, textStartY + 34);

  ctx.fillStyle = '#f2f5f3';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText((post.title || '').slice(0, 34), 54, textStartY + 90);

  ctx.fillStyle = '#c5d1c9';
  ctx.font = '22px sans-serif';
  const words = (post.description || '').split(' ');
  let line = '';
  let lineY = textStartY + 140;

  for (const word of words) {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > canvas.width - 108) {
      ctx.fillText(line, 54, lineY);
      line = word + ' ';
      lineY += 32;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 54, lineY);

  if (post.location) {
    ctx.fillStyle = '#9aa89f';
    ctx.font = '20px sans-serif';
    ctx.fillText(`📍 ${post.location}`, 54, canvas.height - 64);
  }

  const link = document.createElement('a');
  link.download = `${post.title || 'memory'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}