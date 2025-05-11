import React, { useState, useEffect } from "react";
import "./Model_Upload.css";

import Z_header from "../../components/Z_header/Z_header";
import Z_pagesection from "../../components/Z_pagesection/Z_pagesection";
import Z_footer from "../../components/Z_footer/Z_footer";

import Model_Viewer from "../../components/model_viewer/Model_Viewer";

import { ReactComponent as Logo } from "../../assets/icons/logo.svg";
import { ReactComponent as Plus } from "../../assets/icons/plus.svg";

function Model_Upload() {
  const [selectedFiles, setSelectedFiles] = useState([null, null, null, null]);
  const [modelDimensions, setModelDimensions] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [errorMessages, setErrorMessages] = useState(["", "", "", ""]);
  const [isLoadings, setIsLoadings] = useState([false, false, false, false]);
  // Add a new state to track input keys for resetting file inputs
  const [inputKeys, setInputKeys] = useState([0, 1, 2, 3]);

  const [customColors, setCustomColors] = useState({
    backgroundColor: "#1a1a1a", // fallback
    modelColor: "#00fff0", // fallback
  });

  const validExtensions = [".stl", ".obj", ".fbx", ".glb"];

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const cleanRGB = (value) =>
      value
        .split(",")
        .map((v) => v.trim())
        .join(",");

    const rawTabMenu = rootStyles
      .getPropertyValue("--tabMenuBackground")
      .trim();
    const rawSecondary = rootStyles.getPropertyValue("--secondary").trim();

    const backgroundColor = rawTabMenu
      ? `rgb(${cleanRGB(rawTabMenu)})`
      : "#1a1a1a";

    const modelColor = rawSecondary
      ? `rgb(${cleanRGB(rawSecondary)})`
      : "#00fff0";

    setCustomColors({
      backgroundColor,
      modelColor,
    });
  }, []);

  const handleFileSelect = (file, index) => {
    const newSelectedFiles = [...selectedFiles];
    const newIsLoadings = [...isLoadings];
    const newErrorMessages = [...errorMessages];

    newSelectedFiles[index] = file;
    newIsLoadings[index] = true;
    newErrorMessages[index] = "";

    setSelectedFiles(newSelectedFiles);
    setIsLoadings(newIsLoadings);
    setErrorMessages(newErrorMessages);
  };

  const handleDimensionsCalculated = (dimensions, index) => {
    const newModelDimensions = [...modelDimensions];
    const newIsLoadings = [...isLoadings];

    newModelDimensions[index] = dimensions;
    newIsLoadings[index] = false;

    setModelDimensions(newModelDimensions);
    setIsLoadings(newIsLoadings);
  };

  // Function to reset input by changing its key
  const resetFileInput = (index) => {
    const newInputKeys = [...inputKeys];
    newInputKeys[index] = Date.now(); // Generate a unique key using timestamp
    setInputKeys(newInputKeys);
  };

  // Function to handle model removal
  const handleModelRemove = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles[index] = null;
    setSelectedFiles(newSelectedFiles);

    const newModelDimensions = [...modelDimensions];
    newModelDimensions[index] = null;
    setModelDimensions(newModelDimensions);

    const newErrorMessages = [...errorMessages];
    newErrorMessages[index] = "";
    setErrorMessages(newErrorMessages);

    // Reset the file input
    resetFileInput(index);
  };

    const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted files:");
    selectedFiles.forEach((file, index) => {
      if (file) {
        console.log(`File ${index + 1}:`, file.name);
        console.log(file);
      }
    });
  };

  return (
    <div className="model_upload">
      <Z_header
        links={[
          <a href="/about" rel="noopener noreferrer">
            About
          </a>,
          <a href="/contact" rel="noopener noreferrer">
            Contact
          </a>,
          <div className="dropdown">
            Options
            <ul className="dropdown-menu">
              <li>
                <a href="/">Test</a>
              </li>
              <li>
                <a href="/">Test</a>
              </li>
              <li>
                <a href="/">Test</a>
              </li>
            </ul>
          </div>,
        ]}
        name={"Website Name"}
        logo={<Logo />}
      />

      <main className="main">
        <Z_pagesection>
          <h2>Model Upload</h2>
          <h3>Upload up to 4 models for printing</h3>
          <form className="upload-form" onSubmit={handleSubmit}>
      <div className="model-upload-inputs">
        {[0, 1, 2, 3].map((index) => (
          <div className="model-upload-wrapper" key={index}>
            <div className="model-viewer-window">
              <div
                className={`file-input-container ${selectedFiles[index] ? "file-selected" : ""}`}
              >
                {!selectedFiles[index] && (
                  <>
                    <Plus className="plus-icon" />
                    <label
                      tabIndex={0}
                      className="model-upload-button-fake"
                      htmlFor={`model-upload-${index}`}
                      aria-label="Enter a model"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault(); // prevent scrolling for spacebar
                          document
                            .getElementById(`model-upload-${index}`)
                            ?.click();
                        }
                      }}
                    />
                  </>
                )}
                <input
                  className="model-upload-button"
                  type="file"
                  id={`model-upload-${index}`}
                  key={inputKeys[index]} // Add key to force re-render when reset
                  accept=".stl,.obj"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const fileExtension = file.name
                      .slice(file.name.lastIndexOf("."))
                      .toLowerCase();

                    if (!validExtensions.includes(fileExtension)) {
                      const newErrors = [...errorMessages];
                      newErrors[index] =
                        "Unsupported file type. Please upload a 3D model in STL or OBJ format.";
                      setErrorMessages(newErrors);

                      const newSelectedFiles = [...selectedFiles];
                      newSelectedFiles[index] = null;
                      setSelectedFiles(newSelectedFiles);
                      return;
                    }

                    handleFileSelect(file, index);
                  }}
                />
                {errorMessages[index] && (
                  <p className="error-message">{errorMessages[index]}</p>
                )}
              </div>

              {selectedFiles[index] && (
                <div className="model-viewer-container">
                  <Model_Viewer
                    file={selectedFiles[index]}
                    onDimensionsCalculated={(dimensions) =>
                      handleDimensionsCalculated(dimensions, index)
                    }
                    showGrid={false}
                    showAxes={false}
                    backgroundColor={customColors.backgroundColor}
                    modelColor={customColors.modelColor}
                    onRemove={() => handleModelRemove(index)}
                  />
                </div>
              )}
            </div>
            <span className="upload-hint">
              {selectedFiles[index]
                ? `Selected file: ${selectedFiles[index].name}`
                : "Press to upload a model"}
            </span>
          </div>
        ))}
      </div>
      <button type="submit" className="submit-button">
        Submit Files
      </button>
    </form>
        </Z_pagesection>
      </main>

      <footer className="footer">
        <Z_footer
          name={"Website Name"}
          logo={<Logo />}
          children={[
            [
              <h4>Services</h4>,
              <a href="/articles" rel="noopener noreferrer">
                Articles
              </a>,
              <a href="/affiliate" rel="noopener noreferrer">
                Affiliate Links
              </a>,
            ],
            [
              <h4>More</h4>,
              <a href="/about" rel="noopener noreferrer">
                About Us
              </a>,
              <a href="/collaborate" rel="noopener noreferrer">
                Work With Us
              </a>,
              <a href="/contact" rel="noopener noreferrer">
                Contact
              </a>,
            ],
          ]}
        />
      </footer>
    </div>
  );
}

export default Model_Upload;