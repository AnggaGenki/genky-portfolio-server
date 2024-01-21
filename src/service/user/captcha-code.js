import { createCanvas } from "canvas";
import jwt from "jsonwebtoken";

const CaptchaCodeService = () => {
  const cWidth = 90;
  const cHeight = 25;
  const cCanvas = createCanvas(cWidth, cHeight);
  const cContext = cCanvas.getContext("2d");
  const cChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const frGenerateRandomNumber = (pMin, pMax) => {
    return Math.floor(Math.random() * (pMax - pMin + 1)) + pMin;
  };

  const frGenerateRandomCode = () => {
    let vCode = "";

    for (let i = 0; i < 6; i++) {
      vCode += cChars[frGenerateRandomNumber(0, cChars.length - 1)];
    }

    return vCode;
  };

  const cCode = frGenerateRandomCode();
  const cBackground = cContext.createLinearGradient(cWidth / 2, 0, 0, cHeight);

  cBackground.addColorStop(0, "white");
  cBackground.addColorStop(1, "black");

  cContext.fillStyle = cBackground;
  cContext.fillRect(0, 0, cWidth, cHeight);
  cContext.font = "italic 18px serif";
  cContext.lineWidth = 1;
  cContext.strokeText(`${cCode}`, 5, 20);
  cContext.beginPath();
  cContext.moveTo(0, frGenerateRandomNumber(5, 20));
  cContext.lineTo(
    frGenerateRandomNumber(20, 40),
    frGenerateRandomNumber(10, 15)
  );
  cContext.lineTo(
    frGenerateRandomNumber(50, 70),
    frGenerateRandomNumber(5, 20)
  );
  cContext.lineTo(cWidth, frGenerateRandomNumber(10, 15));
  cContext.stroke();
  cContext.lineWidth = 3;
  cContext.strokeRect(0, 0, cWidth, cHeight);

  const cImage = cCanvas.toDataURL();
  const cToken = jwt.sign({ captchaCode: cCode }, process.env.JWTKEY, {
    expiresIn: 60 * 5,
  });

  return {
    captchaCode: cImage,
    token: cToken,
  };
};

export default CaptchaCodeService;
