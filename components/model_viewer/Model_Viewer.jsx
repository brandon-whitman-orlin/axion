import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

import { ReactComponent as Cross } from "../../assets/icons/cross.svg";

// Mapping of file types to their loaders
const loaders = {
  stl: STLLoader,
  obj: OBJLoader,
  fbx: FBXLoader,
  gltf: GLTFLoader,
  glb: GLTFLoader,
};

// Utility to apply color to model meshes
const applyColorToModel = (object, color) => {
  if (!object || !color) return;
  object.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({ color });
    }
  });
};

// Generic model loader component
const ModelLoader = ({ url, fileType, modelRef, modelColor }) => {
  const loader = loaders[fileType];
  const loaded = useLoader(loader, url);

  let model = loaded;

  if (fileType === "stl") {
    return (
      <mesh ref={modelRef}>
        <primitive object={loaded} attach="geometry" />
        <meshStandardMaterial color={modelColor || "#b3b3b3"} />
      </mesh>
    );
  }

  if (fileType === "gltf" || fileType === "glb") {
    model = loaded.scene;
  }

  useEffect(() => {
    applyColorToModel(model, modelColor);
  }, [model, modelColor]);

  return <primitive ref={modelRef} object={model} />;
};

// Auto-rotation component that handles the rotation logic
const AutoRotate = ({ groupRef, enabled }) => {
  useFrame(() => {
    if (enabled && groupRef.current) {
      groupRef.current.rotation.y += 0.005; // Slow rotation speed
    }
  });

  return null;
};

// Fallback error mesh
const ErrorBox = ({ message }) => (
  <mesh position={[0, 0, 0]}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="red" />
  </mesh>
);

// Wrapper to handle dimension calculation and scaling
const ModelWithDimensions = ({
  url,
  fileType,
  onDimensionsCalculated,
  onError,
  modelColor,
  autoRotate,
}) => {
  const modelRef = useRef();
  const groupRef = useRef();
  const dimensionsCalculated = useRef(false);

  const calculateDimensions = () => {
    if (!modelRef.current || !groupRef.current) return false;

    try {
      const boundingBox = new THREE.Box3().setFromObject(modelRef.current);
      if (boundingBox.isEmpty()) return false;

      const center = new THREE.Vector3();
      boundingBox.getCenter(center);
      modelRef.current.position.sub(center);

      const size = new THREE.Vector3();
      boundingBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const normalizedScale = 2 / maxDim;
      groupRef.current.scale.setScalar(normalizedScale);

      const dimensions = {
        width: size.x * normalizedScale * 1000,
        height: size.y * normalizedScale * 1000,
        depth: size.z * normalizedScale * 1000,
      };

      dimensionsCalculated.current = true;
      onDimensionsCalculated?.(dimensions);
      return true;
    } catch (err) {
      console.error("Error calculating dimensions:", err);
      onError?.(err);
      dimensionsCalculated.current = true;
      return true;
    }
  };

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 5;

    const tryCalculate = () => {
      if (dimensionsCalculated.current || attempts >= maxAttempts) return;
      attempts++;
      const success = calculateDimensions();
      if (!success) {
        setTimeout(tryCalculate, 300);
      }
    };

    const timer = setTimeout(tryCalculate, 300);
    return () => clearTimeout(timer);
  }, [url, fileType]);

  if (!loaders[fileType]) {
    onError?.(new Error(`Unsupported file format: ${fileType}`));
    return <ErrorBox message={`Unsupported format: ${fileType}`} />;
  }

  return (
    <group ref={groupRef}>
      <AutoRotate groupRef={groupRef} enabled={autoRotate} />
      <ModelLoader
        url={url}
        fileType={fileType}
        modelRef={modelRef}
        modelColor={modelColor}
      />
    </group>
  );
};

// Loading spinner placeholder
const LoadingPlaceholder = () => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="gray" wireframe />
      </mesh>
      <mesh position={[0, -1.5, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
    </group>
  );
};

// Enhanced OrbitControls wrapper that handles rotation pausing
const RotationControlledOrbitControls = ({ setIsRotating, ...props }) => {
  const controlsRef = useRef();
  const lastInteractionRef = useRef(Date.now());
  const timeoutRef = useRef(null);

  // Set up event handlers
  useEffect(() => {
    if (!controlsRef.current) return;

    const handleStart = () => {
      // User started interacting, pause rotation
      setIsRotating(false);
      lastInteractionRef.current = Date.now();

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    const handleEnd = () => {
      // User stopped interacting, set timeout to resume rotation
      lastInteractionRef.current = Date.now();

      // Clear any existing timeout and set a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsRotating(true);
      }, 3000); // Resume rotation after 3 seconds of inactivity
    };

    // Add event handlers
    const controls = controlsRef.current;
    controls.addEventListener("start", handleStart);
    controls.addEventListener("end", handleEnd);

    // Clean up
    return () => {
      if (controls) {
        controls.removeEventListener("start", handleStart);
        controls.removeEventListener("end", handleEnd);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [setIsRotating]);

  return <OrbitControls ref={controlsRef} {...props} />;
};

// Main viewer component
function Model_Viewer({
  file,
  onDimensionsCalculated,
  showGrid = true,
  showAxes = true,
  backgroundColor = "#f0f0f0",
  modelColor = null,
  height = "100%",
  width = "100%",
  onRemove,
}) {
  const [objectUrl, setObjectUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorFallback, setErrorFallback] = useState(false);
  const [isRotating, setIsRotating] = useState(true); // Start with rotation enabled
  const [cursorStyle, setCursorStyle] = useState("grab"); // Default cursor to "grab"
  const [isDragging, setIsDragging] = useState(false); // Track if user is currently dragging
  const containerRef = useRef(null); // Reference to the container element

  useEffect(() => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setErrorFallback(false);

    const extension = file.name.split(".").pop().toLowerCase();
    setFileType(extension);

    const url = URL.createObjectURL(file);
    setObjectUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleErrorFallback = () => {
    setErrorFallback(true);
    setIsLoading(false);
  };

  useEffect(() => {
    const errorHandler = (event) => {
      console.error("Error loading model:", event.error);
      setError("Failed to load model. Please check file format and try again.");
      setIsLoading(false);
    };

    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  const handleModelLoaded = (dimensions) => {
    setIsLoading(false);
    if (onDimensionsCalculated && !window.dimensionsDebounceTimeout) {
      window.dimensionsDebounceTimeout = setTimeout(() => {
        onDimensionsCalculated(dimensions);
        window.dimensionsDebounceTimeout = null;
      }, 100);
    }
  };

  const handleModelError = (err) => {
    console.error("Model error:", err);
    setIsLoading(false);
    setError(err.message || "Error loading model");
  };

  // Set up global mouse event listeners to handle drag behavior outside the canvas
  useEffect(() => {
    // Global mousedown/touchstart - might not be needed since we set isDragging in the component handlers
    const handleGlobalMouseDown = () => {
      // We'll rely on the component's own handlers to set isDragging to true
    };

    // Global mouseup/touchend - to detect when dragging stops anywhere
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setCursorStyle("grab");
    };

    // Add listeners to window to catch events outside the component
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);
    window.addEventListener("mousedown", handleGlobalMouseDown);
    window.addEventListener("touchstart", handleGlobalMouseDown);

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
      window.removeEventListener("mousedown", handleGlobalMouseDown);
      window.removeEventListener("touchstart", handleGlobalMouseDown);
    };
  }, []);

  // Handle mouse down and up to change cursor and track dragging state
  const handleMouseDown = () => {
    setCursorStyle("grabbing"); // Change cursor to 'grabbing' when mouse is pressed down
    setIsDragging(true); // Set dragging state to true
  };

  const handleMouseUp = () => {
    setCursorStyle("grab"); // Reset cursor back to 'grab' on mouse up
    setIsDragging(false); // Set dragging state to false
  };

  // Handle mouse enter and leave to set the cursor
  const handleMouseEnter = () => {
    setCursorStyle(isDragging ? "grabbing" : "grab"); // Maintain grabbing during drag operations
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setCursorStyle("default"); // Only reset to default when not dragging
    }
    // If dragging, keep the cursor as "grabbing"
  };

  // Apply cursor style globally when dragging
  useEffect(() => {
    if (isDragging) {
      // When dragging, apply a style that affects the entire document
      document.body.style.cursor = "grabbing";
      
      // Create a style element to ensure the cursor stays consistent
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        * { 
          cursor: grabbing !important;
        }
      `;
      document.head.appendChild(styleElement);
      
      return () => {
        // Clean up when component unmounts or dragging stops
        document.body.style.cursor = '';
        document.head.removeChild(styleElement);
      };
    }
  }, [isDragging]);

  if (!objectUrl) {
    return (
      <div style={{ width, height }}>
        <p>No model selected</p>
      </div>
    );
  }

  const containerStyle = {
    position: "relative",
    width: width || "100%",
    height: height || "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: "0.5rem",
    aspectRatio: 1,
  };

  return (
    <div
      ref={containerRef}
      className="model-rendering-canvas-outer"
      style={containerStyle}
    >
      <button
        className="remove-model"
        aria-label="remove-model"
        onClick={() => {
          if (onRemove) onRemove();
        }}
      >
        <Cross />
      </button>
      <Canvas
        className="model-rendering-canvas"
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(backgroundColor));
        }}
        onPointerDown={handleMouseDown}
        onPointerUp={handleMouseUp}
        onPointerEnter={handleMouseEnter}
        onPointerLeave={handleMouseLeave}
        style={{ cursor: isDragging ? "grabbing" : cursorStyle }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} castShadow />
        <directionalLight position={[-10, -10, -10]} intensity={0.4} />

        <Suspense fallback={<LoadingPlaceholder />}>
          {!errorFallback && (
            <ModelWithDimensions
              url={objectUrl}
              fileType={fileType}
              onDimensionsCalculated={handleModelLoaded}
              onError={handleModelError}
              modelColor={modelColor}
              autoRotate={isRotating}
            />
          )}
        </Suspense>

        <RotationControlledOrbitControls
          setIsRotating={setIsRotating}
          enablePan
          enableZoom
          enableRotate
          minDistance={1}
          maxDistance={20}
          onStart={() => setIsDragging(true)}
          onEnd={() => setIsDragging(false)}
        />

        {showGrid && <gridHelper args={[10, 10]} />}
        {showAxes && <axesHelper args={[5]} />}
      </Canvas>
    </div>
  );
}

export default Model_Viewer;