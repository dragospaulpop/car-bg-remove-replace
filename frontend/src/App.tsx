import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { InputFile } from "./components/input-file";
import NavBar from "./components/navbar";
import { PhotoCard } from "./components/photo-card";
import { Button } from "./components/ui/button";
function App() {
  const [carPhoto, setCarPhoto] = useState<HTMLImageElement | null>(null);
  const [bgPhoto, setBgPhoto] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);

  const [carX, setCarX] = useState(0);
  const [carY, setCarY] = useState(0);
  const [isDraggingCar, setIsDraggingCar] = useState(false);
  const [isClickingCar, setIsClickingCar] = useState(false);
  const [carWidth, setCarWidth] = useState(0);
  const [carHeight, setCarHeight] = useState(0);
  const [isResizing, setIsResizing] = useState(false);

  const handleSize = 20;

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!carPhoto) return;

    const rect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    if (
      offsetX > carX + carWidth - handleSize &&
      offsetX < carX + carWidth &&
      offsetY > carY + carHeight - handleSize &&
      offsetY < carY + carHeight
    ) {
      setIsResizing(true);
      canvas.style.cursor = "nwse-resize";
    } else {
      setIsResizing(false);
      canvas.style.cursor = "default";
    }

    const isClickingCar =
      offsetX > carX &&
      offsetX < carX + carPhoto.width &&
      offsetY > carY &&
      offsetY < carY + carPhoto.height;

    setIsClickingCar(isClickingCar);

    setDragging(true);
    setDragX(offsetX);
    setDragY(offsetY);
  };

  const handleMouseUp = () => {
    setDragging(false);
    setIsResizing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.cursor = "default";
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!carPhoto || !bgPhoto) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    if (
      offsetX > carX + carWidth - handleSize &&
      offsetX < carX + carWidth &&
      offsetY > carY + carHeight - handleSize &&
      offsetY < carY + carHeight
    ) {
      canvas.style.cursor = "nwse-resize";
    } else {
      canvas.style.cursor = "default";
    }

    if (dragging) {
      if (!isResizing) {
        canvas.style.cursor = "grabbing";
      }
      const deltaX = offsetX - dragX;
      const deltaY = offsetY - dragY;

      if (isResizing) {
        setCarWidth((prevWidth) => prevWidth + deltaX);
        setCarHeight((prevHeight) => prevHeight + deltaY);
      } else {
        const isDraggingCar =
          offsetX > carX &&
          offsetX < carX + carPhoto.width &&
          offsetY > carY &&
          offsetY < carY + carPhoto.height;

        setIsDraggingCar(isDraggingCar);

        if (!isDraggingCar) return;

        setCarX((prevX) => prevX + deltaX);
        setCarY((prevY) => prevY + deltaY);
      }

      setDragX(offsetX);
      setDragY(offsetY);

      renderCanvas();
    }
  };

  const renderCanvas = useCallback(() => {
    if (!carPhoto || !bgPhoto) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(bgPhoto, 0, 0);
    if (isClickingCar) {
      ctx.beginPath();
      ctx.rect(carX, carY, carWidth, carHeight);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw resize handle

      ctx.fillStyle = "black";
      ctx.fillRect(
        carX + carWidth - handleSize,
        carY + carHeight - handleSize,
        handleSize,
        handleSize
      );
    }
    ctx.drawImage(carPhoto, carX, carY, carWidth, carHeight);
  }, [
    bgPhoto,
    carPhoto,
    carX,
    carY,
    canvasRef,
    isClickingCar,
    carHeight,
    carWidth,
  ]);

  const resetCanvas = useCallback(() => {
    setCarX(0);
    setCarY(0);
    setCarWidth(carPhoto ? carPhoto.width : 0);
    setCarHeight(carPhoto ? carPhoto.height : 0);
    renderCanvas();
  }, [renderCanvas, carPhoto]);

  const processFile = useCallback(
    (
      file: File,
      setPhoto: React.Dispatch<React.SetStateAction<HTMLImageElement | null>>
    ) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        setPhoto(image);
        if (setPhoto === setCarPhoto) {
          setCarWidth(image.width);
          setCarHeight(image.height);
        }
      };
    },
    []
  );

  useEffect(() => {
    const processImages = async () => {
      if (carPhoto && bgPhoto) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        renderCanvas();
      }
    };

    processImages();
  }, [carPhoto, bgPhoto, canvasRef, renderCanvas]);

  return (
    <div className="flex h-full w-full max-w-full flex-col gap-0 overflow-hidden">
      <NavBar />
      <motion.div
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="flex w-full flex-1 flex-col items-center gap-4 p-2 h-full overflow-scroll"
      >
        <div className="grid grid-cols-2 gap-2">
          <PhotoCard title="Car photo" description="">
            <div className="flex w-full h-full flex-1 flex-col items-center gap-4 p-2 justify-between">
              {carPhoto && (
                <div className="bg-accent rounded-lg flex-1 grid place-items-center">
                  <motion.img
                    initial={{ y: -200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    src={carPhoto.src}
                    alt="car photo"
                  />
                </div>
              )}
              <InputFile
                label="Car photo"
                onChange={(file) => processFile(file, setCarPhoto)}
              />
            </div>
          </PhotoCard>
          <PhotoCard title="Background" description="">
            <div className="flex w-full h-full flex-1 flex-col items-center gap-4 p-2 justify-between">
              {bgPhoto && (
                <div className="bg-accent rounded-lg flex-1 grid place-items-center">
                  <motion.img
                    initial={{ y: -200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    src={bgPhoto.src}
                    alt="background"
                  />
                </div>
              )}
              <InputFile
                label="Background"
                onChange={(file) => processFile(file, setBgPhoto)}
              />
            </div>
          </PhotoCard>
          <div className="col-span-2">
            <PhotoCard
              title="Combined"
              description=""
              footer={<Button onClick={() => resetCanvas()}>Reset</Button>}
            >
              <div className="flex w-full h-full flex-1 flex-col items-center gap-4 p-2 justify-between">
                <div className="bg-accent rounded-lg flex-1 grid place-items-center">
                  <motion.canvas
                    initial={{ y: -200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 10,
                    }}
                    width={Math.max(carPhoto?.width || 0, bgPhoto?.width || 0)}
                    height={Math.max(
                      carPhoto?.height || 0,
                      bgPhoto?.height || 0
                    )}
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                  ></motion.canvas>
                </div>
              </div>
            </PhotoCard>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
