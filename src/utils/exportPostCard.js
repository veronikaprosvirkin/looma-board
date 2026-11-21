export async function exportPostCard(post) {
  if (!post) return;

  const styles = getComputedStyle(document.documentElement);
  const bgColor = styles.getPropertyValue('--bg-surface').trim() || '#1f1713';
  const borderColor = styles.getPropertyValue('--border-color').trim() || '#3a2c24';
  const textPrimary = styles.getPropertyValue('--text-primary').trim() || '#f5efe6';
  const textSecondary = styles.getPropertyValue('--text-secondary').trim() || '#b8a99a';
  const accentColor =
    post.status === 'memory'
      ? styles.getPropertyValue('--accent-memory').trim() || '#e88d72'
      : styles.getPropertyValue('--accent-plan').trim() || '#72b8e8';

  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 820;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  let textStartY = 90;
  if (post.imageUrl) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = post.imageUrl;
      });
      ctx.drawImage(img, 44, 44, canvas.width - 88, 400);
      textStartY = 495;
    } catch {
      // Якщо зовнішній сайт блокує CORS
    }
  }

  ctx.font = 'bold 21px sans-serif';
  ctx.fillStyle = accentColor;
  ctx.fillText(post.status === 'memory' ? '• Спогад' : '• План', 48, textStartY);

  ctx.fillStyle = textSecondary;
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(post.date || '', canvas.width - 48, textStartY);
  ctx.textAlign = 'left';

  ctx.fillStyle = textPrimary;
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText((post.title || '').slice(0, 36), 48, textStartY + 55);

  ctx.fillStyle = textSecondary;
  ctx.font = '21px sans-serif';
  const words = (post.description || '').split(' ');
  let line = '';
  let lineY = textStartY + 102;

  for (const word of words) {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > canvas.width - 96) {
      ctx.fillText(line, 48, lineY);
      line = word + ' ';
      lineY += 30;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 48, lineY);

  if (post.tags?.length > 0) {
    ctx.fillStyle = textSecondary;
    ctx.font = '19px sans-serif';
    const tagsText = post.tags.map((t) => `#${t}`).join('   ');
    ctx.fillText(tagsText, 48, lineY + 48);
  }

  if (post.location) {
    ctx.fillStyle = textPrimary;
    ctx.font = '20px sans-serif';
    ctx.fillText(`📍 ${post.location}`, 48, canvas.height - 48);
  }

  const link = document.createElement('a');
  link.download = `${post.title || 'memory'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}