import "./style.css";

const form = document.getElementById("form");
const fileInput = document.getElementById("file");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const saveBtn = document.getElementById("save");
const clearBtn = document.getElementById("clear");

const PADDING = 20;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  if (!file) return;

  const width = Number(document.getElementById("width").value);
  const height = Number(document.getElementById("height").value);

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    canvas.width = width;
    canvas.height = height;
    canvas.style.display = "block";
    saveBtn.style.display = "inline-block";

    ctx.clearRect(0, 0, width, height);

    // ===== cover scaling =====
    const scale = Math.max(
      width / img.naturalWidth,
      height / img.naturalHeight
    );

    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;

    const offsetX = (width - drawW) / 2;
    const offsetY = (height - drawH) / 2;

    // base image
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

    // ===== glass =====
    const glassX = PADDING;
    const glassY = PADDING;
    const glassW = width - PADDING * 2;
    const glassH = height - PADDING * 2;

    const radius = 20;
    const blurPx = 14;

    // offscreen blur
    const panel = document.createElement("canvas");
    panel.width = glassW;
    panel.height = glassH;
    const pctx = panel.getContext("2d");

    pctx.filter = `blur(${blurPx}px)`;
    pctx.drawImage(
      img,
      (glassX - offsetX) / scale,
      (glassY - offsetY) / scale,
      glassW / scale,
      glassH / scale,
      0,
      0,
      glassW,
      glassH
    );
    pctx.filter = "none";

    // rounded clip
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(glassX + radius, glassY);
    ctx.arcTo(
      glassX + glassW,
      glassY,
      glassX + glassW,
      glassY + glassH,
      radius
    );
    ctx.arcTo(
      glassX + glassW,
      glassY + glassH,
      glassX,
      glassY + glassH,
      radius
    );
    ctx.arcTo(glassX, glassY + glassH, glassX, glassY, radius);
    ctx.arcTo(glassX, glassY, glassX + glassW, glassY, radius);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(panel, glassX, glassY);

    // glass overlay
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.fillRect(glassX, glassY, glassW, glassH);
    ctx.restore();

    // border
    ctx.beginPath();
    ctx.moveTo(glassX + radius, glassY);
    ctx.arcTo(
      glassX + glassW,
      glassY,
      glassX + glassW,
      glassY + glassH,
      radius
    );
    ctx.arcTo(
      glassX + glassW,
      glassY + glassH,
      glassX,
      glassY + glassH,
      radius
    );
    ctx.arcTo(glassX, glassY + glassH, glassX, glassY, radius);
    ctx.arcTo(glassX, glassY, glassX + glassW, glassY, radius);
    ctx.closePath();
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 1;
    ctx.stroke();

    URL.revokeObjectURL(img.src);
  };
});

// save
saveBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "glass-image.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// clear
clearBtn.addEventListener("click", () => {
  fileInput.value = "";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.display = "none";
  saveBtn.style.display = "none";
});
