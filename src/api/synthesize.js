import { map, range } from 'lodash';
import { parse, simplify } from 'mathjs';

const SampleTrackGraph = (segments, multiplier) => {
  if (segments === null) return;
  const data = [];

  segments.forEach((segment, index) => {
    const lengthMs = (!segment.length.error ? segment.length.value : 0);
    let offsetMs = 0;
    for (let i = 0; i < index; i++) {
      let offsetLength = !segments[i].length.error ? segments[i].length.value : 0;
      offsetMs += offsetLength;
    }

    const sampleInput = range(0, lengthMs / 1000, 1 / 1000);
    const func = (!segment.expression.error ? simplify(parse(segment.expression.value)) : parse("0")).compile();
    const sampleOutput = map(sampleInput, (x) => func.evaluate({ x: multiplier * x }));
    const shiftedSampleInput = map(sampleInput, (x) => (x + offsetMs / 1000));

    data.push({
      mode: "lines",
      x: shiftedSampleInput,
      y: sampleOutput
    });
  });
  return data;
};

const SynthesizeComposition = (timelines, settings) => {
  const { volume, multiplier, fs, aliasing } = settings;
  // Find buffer size
  let maxLengthMs = 0;
  const trackLengthsMs = [];
  timelines.forEach((timeline) => {
    let trackLengthMs = 0;
    timeline.segments.forEach((segment) => {
      trackLengthMs += !segment.length.error ? segment.length.value : 0;
    });
    trackLengthsMs.push(trackLengthMs);
    if (trackLengthMs > maxLengthMs) maxLengthMs = trackLengthMs;
  });

  // Synthesize
  const bufferSize = maxLengthMs / 1000 * fs.value;
  const rawBuffer = new Float32Array(bufferSize + 1);

  timelines.forEach((timeline, timelineIndex) => {
    let bufferIndex = 1;
    const phase = new Float32Array(bufferSize + 1);

    timeline.segments.forEach((segment, segmentIndex) => {
      const func = (!segment.expression.error ? simplify(parse(segment.expression.value)) : parse("0")).compile();
      for (let i = 0; i <= segment.length.value / 1000; i += 1/fs.value) {
        let tone = func.evaluate({x: i});

        phase[bufferIndex] = phase[bufferIndex - 1] + 2 * Math.PI * tone/fs.value;
        if (phase[bufferIndex] > 2 * Math.PI)
          phase[bufferIndex] -= 2 * Math.PI;
        else if (phase[bufferIndex] < -2 * Math.PI)
          phase[bufferIndex] += 2 * Math.PI;

        rawBuffer[bufferIndex] += 0.1 * Math.sin(phase[bufferIndex]);
        bufferIndex++;
      }
    });
  });
  
  // TODO: Exponentially decress gain near end
  
  return rawBuffer;

};


export { SampleTrackGraph, SynthesizeComposition };
