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
        if (!!value.error && key !== "title") {
          editor.push({ key: key, title: segment.title.value });
        }
      }
    });
  });

  if (settings.length || editor.length) {
    return { settings, editor };
  } else {
    return null;
  }

}

export function settingsChange(field, value) {
  const { settings } = this.state;
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
  this.setState({ settings });
}

export function trackDataChange(field, value) {
  //TODO: find better method than looping through all segments (if slow)
  this.state.timelines.forEach((tl, i) => {
    tl.segments.forEach((segment, j) => {
      if (segment.id === this.state.selectedSegmentId) {
        const { timelines } = this.state;
        timelines[i].segments[j][field].value = value;

        if (field === "title") {
          if (value.length > 0) {
            timelines[i].segments[j].title.error = "";
          } else {
            timelines[i].segments[j].title.error = "Too short"
          }
        } else if (field === "expression") {
          try {
            const parsedMath = simplify(parse(value));
            parsedMath.evaluate({ x: 1 });
            timelines[i].segments[j].expression.error = "";
          } catch (e) {
            timelines[i].segments[j].expression.error = e.message;
          }
          if (value.length === 0) {
            timelines[i].segments[j].expression.error = "Undefined";
          }

        } else if (field === "length") {
          const parsedVal = parseInt(value);
          if (parsedVal >= 0) {
            timelines[i].segments[j].length.value = parsedVal;
            timelines[i].segments[j].length.error = "";
          } else if (isNaN(parsedVal)) {
            timelines[i].segments[j].length.error = "Not a number";
          } else {
            timelines[i].segments[j].length.error = "Can't be negative"
          }

        } else if (field === "volume") {
          const parsedVal = parseInt(value);
          if (parsedVal >= 0) {
            timelines[i].segments[j].volume.value = parsedVal;
            timelines[i].segments[j].volume.error = "";
          } else if (isNaN(parsedVal)) {
            timelines[i].segments[j].volume.error = "Not a number";
          } else {
            timelines[i].segments[j].volume.error = "Can't be negative"
          }
        }

        this.setState({ timelines: timelines });
        return;
      }
    });
  });
}

export function loadJson(json) {
  // TODO: error checking
  const parsedJson = JSON.parse(json);
  this.setState({ timelines: parsedJson }, () => this.toggleModal("load"));
}
//#endregion

//#region Editor state changes
export function segmentSelection(selectedRowIndex, selectedSegmentId) {
  this.setState({
    selectedRowIndex: selectedRowIndex,
    selectedSegmentId: selectedSegmentId
  });
}

export function segmentRearrange(index, segments) {
  const { timelines } = this.state;
  timelines[index].segments = segments;
  this.setState({ timelines: timelines });
}

export function addSegment(index) {
  const { timelines } = this.state;

  timelines[index].segments = [...timelines[index].segments,
  {
    id: `t${++this.idCount}`,
    title: { value: "New Tab", error: "" },
    expression: { value: "40000 * x", error: "" },
    length: { value: 500, error: "" },
    volume: { value: 100, error: "" }
  }
  ];
  this.setState({ timelines: timelines });
}

export function deleteSegment() {
  const { timelines } = this.state;
  let prevSegmentId = null;

  timelines.forEach((tl, tlIndex) => {
    tl.segments.forEach((segment, segmentIndex) => {

      if (segment.id === this.state.selectedSegmentId) {
        const updateSegments = [...tl.segments];
        updateSegments.splice(segmentIndex, 1);
        timelines[tlIndex].segments = updateSegments;

        this.setState({
          selectedSegmentId: prevSegmentId,
          timelines: timelines
        });
        return;
      }
      prevSegmentId = segment.id;
    });
  });
}

export function trackOptionChange(index, field, value) {
  const { timelines } = this.state;
  if (field === 'title') {
    timelines[index].options.title = value;
  } else if (field === 'type') {
    if (value === null)
      timelines[index].options.type = 'sine';
    else
      timelines[index].options.type = value;
  } else if (field === 'mute') {
    timelines[index].options.mute = !timelines[index].options.mute;
  }

  this.setState({ timelines: timelines });
}

export function addTrack() {
  const { timelines } = this.state;

  timelines.push({
    options: {
      title: 'Untitled Track',
      type: 'sine',
      mute: false
    },
    segments: []
  });

  this.setState({ timelines: timelines });
}

export function deleteTrack(trackIndex) {
  const { timelines } = this.state;

  timelines.splice(trackIndex, 1);
  this.setState({ timelines: timelines });
}

//#endregion

//#region Modal toggle handler
export function toggleModal(kind) {
  const { showingModals } = this.state;
  showingModals[kind] = !showingModals[kind];
  this.setState({ showingModals });
}
//#endregion
