import { parse, simplify } from 'mathjs';

//#region User input with error checking handlers
export function getCompositionErrors() {
  // Check settings
  const settings = [];
  for (let [key, value] of Object.entries(this.state.settings)) {
    if (!!value.error && key !== "graphRange") {
      settings.push(key);
    }
  }

  // Check editor
  const editor = [];
  this.state.timelines.forEach((timeline) => {
    timeline.segments.forEach((segment) => {
      for (let [key, value] of Object.entries(segment)) {
        if (!!value.error) {
          editor.push({ key: key, title: segment.title.value });
        }
      }
    });
  });

  if (settings.length || editor.length) {
    this.setState({ compositionErrors: { settings, editor } });
    return true;
  } else {
    this.setState({ compositionErrors: null });
    return false;
  }

}

export function settingsChange(field, value) {
  const settings = {...this.state.settings};
  let parsedVal;
  if (field !== 'aliasing') {
    parsedVal = parseInt(value);
    settings[field].value = value;
  }

  // Error checking
  if (field === 'volume') {
    if (parsedVal >= 0) {
      settings.volume.value = parsedVal;
      settings.volume.error = "";
    } else if (isNaN(parsedVal)) {
      settings.volume.error = "Not a number";
    } else {
      settings.volume.error = "Can't be negative";
    }

  } else if (field === 'multiplier') {
    if (isNaN(parsedVal)) {
      settings.multiplier.error = "Not a number";
    } else {
      settings.multiplier.value = parsedVal;
      settings.multiplier.error = "";
    }

  } else if (field === 'graphRange') {
    if (isNaN(parsedVal)) {
      settings.graphRange.error = "Not a number";
    } else if (parsedVal < 0) {
      settings.graphRange.error = "Can't be negative";
    } else {
      settings.graphRange.value = parsedVal;
      settings.graphRange.error = "";
    }

  } else if (field === 'fs') {
    if (isNaN(parsedVal)) {
      settings.fs.error = "Not a number";
    } else if (parsedVal < 3000) {
      settings.fs.error = "Must be at least 3000";
    } else if (parsedVal > 96000) {
      settings.fs.error = "Must be less than 96000";
    } else {
      settings.fs.value = parsedVal;
      settings.fs.error = "";
    }

  } else if (field === 'aliasing') {
    settings.aliasing = !settings.aliasing;
  }

  this.setState({ settings }, () => this.getCompositionErrors());
}

export function trackDataChange(timelines, segmentCol, segmentRow, field, value) {

  // Set value so input is still interactive
  timelines[segmentRow].segments[segmentCol][field].value = value;

  // Error checking
  if (field === "title") {
    if (value.length > 0) {
      timelines[segmentRow].segments[segmentCol].title.error = "";
    } else {
      timelines[segmentRow].segments[segmentCol].title.error = "Too short"
    }

  } else if (field === "expression") {
    try {
      const parsedMath = simplify(parse(value));
      parsedMath.evaluate({ x: 1 });
      timelines[segmentRow].segments[segmentCol].expression.error = "";
    } catch (e) {
      timelines[segmentRow].segments[segmentCol].expression.error = e.message;
    }
    if (value.length === 0) {
      timelines[segmentRow].segments[segmentCol].expression.error = "Undefined";
    }

  } else if (field === "length") {
    const parsedVal = parseInt(value);
    if (parsedVal >= 0) {
      timelines[segmentRow].segments[segmentCol].length.value = parsedVal;
      timelines[segmentRow].segments[segmentCol].length.error = "";
    } else if (isNaN(parsedVal)) {
      timelines[segmentRow].segments[segmentCol].length.error = "Not a number";
    } else {
      timelines[segmentRow].segments[segmentCol].length.error = "Can't be negative"
    }

  } else if (field === "volume") {
    const parsedVal = parseInt(value);
    if (parsedVal >= 0) {
      timelines[segmentRow].segments[segmentCol].volume.value = parsedVal;
      timelines[segmentRow].segments[segmentCol].volume.error = "";
    } else if (isNaN(parsedVal)) {
      timelines[segmentRow].segments[segmentCol].volume.error = "Not a number";
    } else {
      timelines[segmentRow].segments[segmentCol].volume.error = "Can't be negative"
    }
  }

  this.setState({ timelines }, () => this.getCompositionErrors());
}
//#endregion

//#region Editor state changes
export function segmentSelection(selectedRowIndex, selectedColumnIndex) {
  this.setState({ selectedSegment: { row: selectedRowIndex, col: selectedColumnIndex } });
}

export function segmentRearrange(rowIndex, sourceColIndex, destinationColIndex, segments) {
  const { selectedSegment, timelines } = { ...this.state };
  timelines[rowIndex].segments = segments;
  this.setState({ timelines });

  if (sourceColIndex === selectedSegment.col) {
    selectedSegment.col = destinationColIndex;
    this.setState({ selectedSegment });
  }
}

export function addSegment(rowIndex) {
  const timelines = [...this.state.timelines];

  timelines[rowIndex].segments = [...timelines[rowIndex].segments,
  {
    id: `t${++this.idCount}`,
    title: { value: "New Tab", error: "" },
    expression: { value: "440 + 100 * x", error: "" },
    length: { value: 500, error: "" },
    volume: { value: 100, error: "" }
  }
  ];
  this.setState({ timelines });
}

export function deleteSegment() {
  const { selectedSegment, timelines } = { ...this.state };

  timelines[selectedSegment.row].segments.splice(selectedSegment.col, 1);
  if (selectedSegment.col === 0) {
    if (selectedSegment.row > 0) {
      selectedSegment.row--;
      selectedSegment.col = timelines[selectedSegment.row].segments.length - 1;
    }
  } else {
    selectedSegment.col--;
  }

  this.setState({ selectedSegment, timelines });
}

export function trackOptionChange(index, field, value) {
  const { timelines } = this.state;
  if (field === 'title') {
    timelines[index].options.title = value;
  } else if (field === 'wave') {
    if (value === null)
      timelines[index].options.wave = 'sine';
    else
      timelines[index].options.wave = value;
  } else if (field === 'mute') {
    timelines[index].options.mute = !timelines[index].options.mute;
  }

  this.setState({ timelines: timelines });
}

export function addTrack() {
  const timelines = [...this.state.timelines];
  timelines.push({
    options: {
      title: 'Untitled Track',
      wave: 'sine',
      mute: false
    },
    segments: []
  });

  this.setState({ timelines: timelines });
}

export function deleteTrack(rowIndex) {
  const { selectedSegment, timelines } = { ...this.state };
  timelines.splice(rowIndex, 1);
  if (selectedSegment.row === rowIndex) {
    selectedSegment.row--;
    selectedSegment.col = 0;
  }

  this.setState({ selectedSegment, timelines });
}
//#endregion

//#region Modal toggle handler
export function toggleModal(kind) {
  const showingModals = {...this.state.showingModals};
  if (kind === "save" && this.state.compositionErrors) {
    showingModals["alert"] = true;
  } else {
    showingModals[kind] = !showingModals[kind];
  }

  this.setState({ showingModals });
}
//#endregion

//#region Json parsing
export function exportCompositionJson() {
  const timelines = this.state.timelines;
  const minimizedJson = [];

  timelines.forEach((timeline) => {
    const segments = [];
    timeline.segments.forEach((segment) => {
      segments.push({
        title: segment.title.value,
        expression: segment.expression.value,
        length: segment.length.value,
        volume: segment.volume.value
      });
    });

    minimizedJson.push({
      options: timeline.options,
      segments: segments
    });
  });

  return JSON.stringify(minimizedJson);
}

export function loadCompositionJson(json) {
  const parsedJson = JSON.parse(json);
  if (!Array.isArray(parsedJson)) {
    // Make more robust
    return "Unexpected format";
  }

  let id = 0;
  try {
    for (let rowIndex in parsedJson) {
      for (let colIndex in parsedJson[rowIndex].segments) {
        let oldSegment = { ...parsedJson[rowIndex].segments[colIndex] };
        let segmentId = `t${id}`;

        parsedJson[rowIndex].segments[colIndex] = {
          title: {}, expression: {}, length: {}, volume: {}
        };
        parsedJson[rowIndex].segments[colIndex].id = segmentId;
        this.trackDataChange(parsedJson, colIndex, rowIndex, "title", oldSegment.title);
        this.trackDataChange(parsedJson, colIndex, rowIndex, "expression", oldSegment.expression);
        this.trackDataChange(parsedJson, colIndex, rowIndex, "length", oldSegment.length);
        this.trackDataChange(parsedJson, colIndex, rowIndex, "volume", oldSegment.volume);
        id++;
      }
    }
  } catch (e) {
    alert(e.message);
    return;
  }


  this.toggleModal("load");
  this.setState({ selectedSegment: { row: 0, col: 0 } });
}
////#endregion
