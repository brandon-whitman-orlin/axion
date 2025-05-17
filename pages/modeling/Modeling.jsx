import React, { useState } from "react";
import "./Modeling.css";

import Z_header from "../../components/Z_header/Z_header";
import Z_pagesection from "../../components/Z_pagesection/Z_pagesection";
import Z_footer from "../../components/Z_footer/Z_footer";

import Reference_Viewer from "../../components/reference_viewer/Reference_Viewer";
import Tooltip from "../../components/tooltip/Tooltip";

import { ReactComponent as Logo } from "../../assets/icons/logo.svg";
import { ReactComponent as Plus } from "../../assets/icons/plus.svg";
import { ReactComponent as Check } from "../../assets/icons/check.svg";

function Modeling() {
  const [selectedFiles, setSelectedFiles] = useState([null, null, null, null]);
  const [errorMessages, setErrorMessages] = useState(["", "", "", ""]);
  const [inputKeys, setInputKeys] = useState([0, 1, 2, 3]);

  const [checkboxes, setCheckboxes] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
  });

  const [description, setDescription] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const validExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".mp4",
    ".webm",
    ".mov",
  ];

  const handleMediaFileSelect = (file, index) => {
    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      const newErrors = [...errorMessages];
      newErrors[index] =
        "Unsupported file type. Please upload an image, GIF, or video file.";
      setErrorMessages(newErrors);

      const newSelectedFiles = [...selectedFiles];
      newSelectedFiles[index] = null;
      setSelectedFiles(newSelectedFiles);
      return;
    }

    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles[index] = file;

    const newErrors = [...errorMessages];
    newErrors[index] = "";

    setSelectedFiles(newSelectedFiles);
    setErrorMessages(newErrors);
  };

  const resetFileInput = (index) => {
    const newInputKeys = [...inputKeys];
    newInputKeys[index] = Date.now();
    setInputKeys(newInputKeys);
  };

  const handleMediaRemove = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles[index] = null;
    setSelectedFiles(newSelectedFiles);

    const newErrors = [...errorMessages];
    newErrors[index] = "";
    setErrorMessages(newErrors);

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

    console.log("Form details:");
    console.log("Description:", description);
    console.log("Additional Notes:", additionalNotes);
    console.log("Checkbox values:", checkboxes);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setCheckboxes((prev) => ({
      ...prev,
      [name]: checked,
      ...(name === "checkbox2" && !checked ? { checkbox3: false } : {}),
    }));
  };

  return (
    <div className="modeling">
            <Z_header
              links={[
                <a href="/about" rel="noopener noreferrer">
                  About
                </a>,
                <a href="/contact" rel="noopener noreferrer">
                  Contact
                </a>,
                <div className="dropdown">
                  Services
                  <ul className="dropdown-menu">
                    <li>
                      <a href="/printing">3D Printing</a>
                    </li>
                    <li>
                      <a href="/modeling">3D Modeling</a>
                    </li>
                  </ul>
                </div>,
              ]}
              name={"Axion"}
              logo={<Logo />}
            />
      <main className="main">
        <Z_pagesection>
          <h2>3D Modeling</h2>
          <h3>Help us get your model just right!</h3>

          <form className="upload-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <label htmlFor="textarea1">Description</label>
              <textarea
                name="textarea1"
                id="textarea1"
                className="styled-textarea"
                placeholder="Model Description"
                aria-label="Description of your model"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="media-upload-inputs">
              {[0, 1, 2, 3].map((index) => (
                <div className="media-upload-wrapper" key={index}>
                  <div className="media-viewer-window">
                    <div
                      className={`file-input-container ${
                        selectedFiles[index] ? "file-selected" : ""
                      }`}
                    >
                      {!selectedFiles[index] && (
                        <>
                          <Plus className="plus-icon" />
                          <label
                            tabIndex={0}
                            className="media-upload-button-fake"
                            htmlFor={`media-upload-${index}`}
                            aria-label="Upload an image or video"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                document
                                  .getElementById(`media-upload-${index}`)
                                  ?.click();
                              }
                            }}
                          />
                        </>
                      )}
                      <input
                        className="media-upload-button"
                        type="file"
                        id={`media-upload-${index}`}
                        key={inputKeys[index]}
                        accept="image/*,video/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          handleMediaFileSelect(file, index);
                        }}
                      />
                      {errorMessages[index] && (
                        <p className="error-message">{errorMessages[index]}</p>
                      )}
                    </div>

                    {selectedFiles[index] && (
                      <div className="media-viewer-container">
                        <Reference_Viewer
                          file={selectedFiles[index]}
                          onRemove={() => handleMediaRemove(index)}
                        />
                      </div>
                    )}
                  </div>
                  <span className="upload-hint">
                    {selectedFiles[index]
                      ? `Selected file: ${selectedFiles[index].name}`
                      : "Click to upload reference"}
                  </span>
                </div>
              ))}
            </div>

            <div className="form-section checkboxes">
              <Tooltip
                tooltipText="Use a custom filament color or material"
                id="tooltip-filament"
              >
                <label>
                  <input
                    type="checkbox"
                    name="checkbox1"
                    value="1"
                    checked={checkboxes.checkbox1}
                    onChange={handleCheckboxChange}
                    aria-describedby="tooltip-filament"
                  />
                  Custom Filament
                  <Check />
                </label>
              </Tooltip>

              <Tooltip
                tooltipText="Extra finishing after printing"
                id="tooltip-postprocessing"
              >
                <label>
                  <input
                    type="checkbox"
                    name="checkbox2"
                    value="2"
                    checked={checkboxes.checkbox2}
                    onChange={handleCheckboxChange}
                    aria-describedby="tooltip-postprocessing"
                  />
                  Post Processing
                  <Check />
                </label>
              </Tooltip>

              <Tooltip
                tooltipText={
                  checkboxes.checkbox2
                    ? "Add paint to the printed model"
                    : "Enable Post Processing to allow painting"
                }
                id="tooltip-painting"
              >
                <label>
                  <input
                    type="checkbox"
                    name="checkbox3"
                    value="3"
                    checked={checkboxes.checkbox3}
                    onChange={handleCheckboxChange}
                    disabled={!checkboxes.checkbox2}
                    aria-describedby="tooltip-painting"
                  />
                  Painting
                  <Check />
                </label>
              </Tooltip>
            </div>

            <div className="form-section">
              <label htmlFor="textarea2">Additional Notes</label>
              <textarea
                name="textarea2"
                id="textarea2"
                className="styled-textarea"
                placeholder="Additional Notes"
                aria-label="Additional notes for your model"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-button">
              Submit Files
            </button>
          </form>
        </Z_pagesection>
      </main>

      <footer className="footer">
        <Z_footer
          name={"Axion"}
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

export default Modeling;
