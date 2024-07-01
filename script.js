document.addEventListener("DOMContentLoaded", () => {
  const inputCanvas = document.getElementById("input-canvas");
  const invertButton = document.getElementById("invert");
  const widthInput = document.getElementById("width");
  const heightInput = document.getElementById("height");
  const downloadButton = document.getElementById("download");
  const scaleSelector = document.getElementById("scale-selector");
  const saveButton = document.getElementById("save");
  const loadButton = document.getElementById("load");
  const clearButton = document.getElementById("clear");
  const body = document.querySelector("body");
  const rightArrow = document.getElementById("right-arrow");
  const leftArrow = document.getElementById("left-arrow");
  const closeButtonEasterEgg = document.getElementById("close");
  const whiteInput = document.getElementById("white-input");
  const blackInput = document.getElementById("black-input");


  // Easter egg for the close button
  closeButtonEasterEgg.addEventListener("click", () => {
    //toggle the display of the background image of the button
    if (closeButtonEasterEgg.style.backgroundImage.includes("favicon.png")) {
      closeButtonEasterEgg.style.backgroundImage = "unset";
    } else {
      closeButtonEasterEgg.style.backgroundImage = "url(./favicon.png)";
    }
    closeButtonEasterEgg.style.backgroundSize = "cover";
    closeButtonEasterEgg.style.backgroundPosition = "center";
    closeButtonEasterEgg.style.backgroundRepeat = "no-repeat";
  });

  const wallpaperCanvas = document.createElement("canvas");

  const availablePresetFiles = [
    "dots_alternate_inverted.json",
    "dots_alternate_dense_inverted.json",
    "checkerboard.json",
    "dot_grid_inverted.json",
    "dense_columns.json",
    "ne_dense_diagonal_inverted.json",
    "columns.json",
    "squares.json",
    "rain.json",
    "square_grid_dense.json",
    "bricks.json",
    "dot.json",
    "tread_plate.json",
    "circle_tiles.json",
    "fabric.json",
    "trees.json",
    "sine_wave.json",
    "3d_grid.json",
    "amogus.json",
    "blank.json",
    "dots.json",
    "dots_alternate.json",
    "dots_alternate_dense.json",
    "dot_grid.json",
    "dense_rows.json",
    "ne_dense_diagonal.json",
    "rows.json",
    "ne_diagonal.json",
    "center_dot_grid.json",
    "square_grid.json",
    "tiles45.json",
    "quilt.json",
    "acutes.json",
    "wavy.json",
    "scales.json",
    "roof_tiles.json",
    "cherry.json",
    "diamond.json",
    "black.json",
  ];

  let black = blackInput.value;
  let white = whiteInput.value;

  blackInput.addEventListener("input", () => {
    black = blackInput.value;
    document.documentElement.style.setProperty("--black", black);
    scheduleUpdate();
  });

  whiteInput.addEventListener("input", () => {
    white = whiteInput.value;
    document.documentElement.style.setProperty("--white", white);
    scheduleUpdate();
  });

  let isMouseDown = false;
  let drawColor = black;
  let needsUpdate = false;

  const generateWallpaper = () => {
    const scale = parseInt(scaleSelector.value);
    const pattern = [];
    for (let row of inputCanvas.rows) {
      const rowData = [];
      for (let cell of row.cells) {
        rowData.push(varToHex(cell.style.backgroundColor) === black ? 1 : 0);
      }
      pattern.push(rowData);
    }

    // Get the width and height of the inputs
    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);
   
    // Create off-screen canvas with the 8x8 pattern
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = 8;
    patternCanvas.height = 8;
    const patternCtx = patternCanvas.getContext("2d");

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        patternCtx.fillStyle = pattern[y][x] ? black : white;
        patternCtx.fillRect(x, y, 1, 1);
      }
    }

    // Draw an image that will be used as background for the website
    // the image will be half the size of the viewport
    const backgroundCanvas = document.createElement("canvas");
    backgroundCanvas.width = window.innerWidth / scale;
    backgroundCanvas.height = window.innerHeight / scale;
    const backgroundCtx = backgroundCanvas.getContext("2d");

    for (let y = 0; y < backgroundCanvas.height; y += 8) {
      for (let x = 0; x < backgroundCanvas.width; x += 8) {
        backgroundCtx.drawImage(patternCanvas, x, y, 8, 8);
      }
    }

    // Draw the background image on the website
    // body.style.backgroundImage = `url(${backgroundCanvas.toDataURL()})`;

    // save it as a css variable
    document.documentElement.style.setProperty("--background-image", `url(${backgroundCanvas.toDataURL()})`);

    // Draw the wallpaper on the wallpaperCanvas
    wallpaperCanvas.width = width;
    wallpaperCanvas.height = height;
    const ctx = wallpaperCanvas.getContext("2d");

    for (let y = 0; y < height; y += 8) {
      for (let x = 0; x < width; x += 8) {
        ctx.drawImage(patternCanvas, x, y, 8, 8);
      }
    }
  }

  const scheduleUpdate = () => {
    if (!needsUpdate) {
      needsUpdate = true;
      requestAnimationFrame(() => {
        generateWallpaper();
        needsUpdate = false;
      });
    }
  };

  const hexToVar = (hex) => {
    return hex === black ? "var(--black)" : "var(--white)";
  };

  const varToHex = (varString) => {
    return varString === "var(--black)" ? black : white;
  };

  // Initialize 8x8 input canvas
  for (let row = 0; row < 8; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < 8; col++) {
      const td = document.createElement("td");
      td.style.backgroundColor = hexToVar(white);
      if ((row % 2 === 0 && col % 2 === 0) || (row % 2 === 1 && col % 2 === 1)) {
        td.style.backgroundColor = hexToVar(black);
      }
      td.addEventListener("mousedown", (event) => {
        const initialColor = varToHex(event.target.style.backgroundColor);
        drawColor = initialColor === black ? hexToVar(white) : hexToVar(black);
        td.style.backgroundColor = drawColor;
        isMouseDown = true;
        scheduleUpdate();
      });
      td.addEventListener("mouseenter", (event) => {
        if (isMouseDown) {
          event.target.style.backgroundColor = drawColor;
          scheduleUpdate();
        }
      });
      tr.appendChild(td);
    }
    inputCanvas.appendChild(tr);
  }

  document.addEventListener("mouseup", () => {
    isMouseDown = false;
  });

  // Invert the 8x8 design
  invertButton.addEventListener("click", () => {
    for (let row of inputCanvas.rows) {
      for (let cell of row.cells) {
        cell.style.backgroundColor = varToHex(cell.style.backgroundColor) === black ?
          hexToVar(white) : hexToVar(black);
      } 
    }
    scheduleUpdate();
  });


  //validate input values no less than 8 for width and height on blur
  widthInput.addEventListener("blur", () => {
    if (widthInput.value < 8) {
      widthInput.value = 8;
    }
  });

  heightInput.addEventListener("blur", () => {
    if (heightInput.value < 8) {
      heightInput.value = 8;
    }
  });

  // Update wallpaper when resizing the input canvas and validate input values
  widthInput.addEventListener("input", () => {
    if (!isNaN(widthInput.value)) {
      scheduleUpdate();
    }
  });

  heightInput.addEventListener("input", () => {
    if (!isNaN(heightInput.value)) {
      scheduleUpdate();
    }
  });

  // Update wallpaper when changing the scale
  scaleSelector.addEventListener("input", scheduleUpdate);

  let selectorValueToScale = {
    1: 1,
    2: 2,
    3: 4,
    4: 8,
    5: 10,
  };
  
  // When pressing the download button, download the wallpaperCavas as an image
  // with the selected scale, resampling the image with the nearest-neighbor algorithm
  downloadButton.addEventListener("click", (event) => {
    const scale = selectorValueToScale[scaleSelector.value];
    const downloadCanvas = document.createElement("canvas");
    downloadCanvas.width = wallpaperCanvas.width * scale;
    downloadCanvas.height = wallpaperCanvas.height * scale;
    const ctx = downloadCanvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(wallpaperCanvas, 0, 0, downloadCanvas.width, downloadCanvas.height);
    const link = document.createElement("a");
    link.download = "wallpaper.png";
    link.href = downloadCanvas.toDataURL();
    link.click();
  });



  // Save the configuration of the 8x8 design as a JSON file
  saveButton.addEventListener("click", (event) => {
    event.preventDefault();
    const pattern = [];
    for (let row of inputCanvas.rows) {
      const rowData = [];
      for (let cell of row.cells) {
        rowData.push(varToHex(cell.style.backgroundColor) === black ? 1 : 0);
      }
      pattern.push(rowData);
    }
    const json = JSON.stringify({
      width: parseInt(widthInput.value),
      height: parseInt(heightInput.value),
      pattern,
    });
    const link = document.createElement("a");
    link.download = "pattern.json";
    link.href = URL.createObjectURL(
      new Blob([json], { type: "application/json" })
    );
    link.click();
  });

  // Load a configuration from a JSON file
  loadButton.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const json = JSON.parse(reader.result);
        widthInput.value = json.width;
        heightInput.value = json.height;
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            if (json.pattern[row][col] === 1) {
              inputCanvas.rows[row].cells[col].style.backgroundColor = hexToVar(black);
            } else {
              inputCanvas.rows[row].cells[col].style.backgroundColor = hexToVar(white);
            }
          }
        }
        scheduleUpdate();
      };
      reader.readAsText(file);
    };
    input.click();
  });

  // Load a preset file when clicking on the arrows (scroll through the available presets)
  // the preset files are in "./examplePatterns/macOs_system3_1986/" folder
  let currentPresetIndex = -1;
  rightArrow.addEventListener("click", () => {
    currentPresetIndex = (currentPresetIndex + 1) % availablePresetFiles.length;
    const presetFile = availablePresetFiles[currentPresetIndex];
    fetch(`./examplePatterns/macOs_system3_1986/${presetFile}`)
      .then((response) => response.json())
      .then((json) => {
        widthInput.value = json.width;
        heightInput.value = json.height;
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            if (json.pattern[row][col] === 1) {
              inputCanvas.rows[row].cells[col].style.backgroundColor = hexToVar(black);
            } else {
              inputCanvas.rows[row].cells[col].style.backgroundColor = hexToVar(white);
            }
          }
        }
        scheduleUpdate();
      });
  });

  leftArrow.addEventListener("click", () => {
    currentPresetIndex =
      (currentPresetIndex - 1 + availablePresetFiles.length) %
      availablePresetFiles.length;
    const presetFile = availablePresetFiles[currentPresetIndex];
    fetch(`./examplePatterns/macOs_system3_1986/${presetFile}`)
      .then((response) => response.json())
      .then((json) => {
        widthInput.value = json.width;
        heightInput.value = json.height;
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            if (json.pattern[row][col] === 1) {
              inputCanvas.rows[row].cells[col].style.backgroundColor = hexToVar(black);
            } else {
              inputCanvas.rows[row].cells[col].style.backgroundColor = hexToVar(white);
            }
          }
        }
        scheduleUpdate();
      });
  });

  // Clear the 8x8 design
  clearButton.addEventListener("click", () => {
    for (let row of inputCanvas.rows) {
      for (let cell of row.cells) {
        cell.style.backgroundColor = white;
      }
    }
    scheduleUpdate();
  });

  // select all the text in the input when clicked
  widthInput.addEventListener("click", () => {
    widthInput.select();
  });

  heightInput.addEventListener("click", () => {
    heightInput.select();
  });

  // Update on viewport resize
  window.addEventListener("resize", scheduleUpdate);

  // Initial wallpaper generation
  scheduleUpdate();
});

// Set the range value when clicking on the labels
function setRangeValue(value) {
  document.getElementById("scale-selector").value = value;
  document.getElementById("scale-selector").dispatchEvent(new Event("input"));
}

