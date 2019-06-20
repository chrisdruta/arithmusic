import { map, range } from 'lodash';
import { parse, simplify } from 'mathjs';

const wavewaves = {
  sine: (x) => (Math.sin(x)),
  triangle: (x) => (2/Math.PI * Math.asin(Math.sin(x))),
  saw: (x) => (1/Math.PI * Math.atan(Math.tan(x/2 + Math.PI/2)))
  //saw: (x) => (-2/Math.PI * (Math.PI / 2 - Math.atan(Math.tan(x/2 + Math.PI/2))) + 1)
  //saw: (x) => (2*(x/Math.PI + 0.5 - Math.floor(x/Math.PI + 0.5)) - 1)
};

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

  timelines.forEach((timeline) => {
    let bufferIndex = 1;
    const phase = new Float32Array(bufferSize + 1);
    const waveFunc = wavewaves[timeline.options.wave];
    const muteMultiplier = timeline.options.mute ? 0 : 1;

    timeline.segments.forEach((segment) => {
      const func = simplify(parse(segment.expression.value));
      for (let i = 0; i <= segment.length.value / 1000; i += 1/fs.value) {
        let tone = func.evaluate({x: multiplier.value * i});

        if (!aliasing && (tone > fs.value/2 || tone < 0)) tone = 0;
        let volumeMultiplier = segment.volume.value * volume.value / 10000 * muteMultiplier; // TODO: Exponentially decrease gain near end

        phase[bufferIndex] = phase[bufferIndex - 1] + 2 * Math.PI * tone/fs.value;
        if (phase[bufferIndex] > 2 * Math.PI)
          phase[bufferIndex] -= 2 * Math.PI;
        else if (phase[bufferIndex] < -2 * Math.PI)
          phase[bufferIndex] += 2 * Math.PI;

        rawBuffer[bufferIndex] += volumeMultiplier * waveFunc(phase[bufferIndex]);
        bufferIndex++;
      }
    });
  });
  
  // TODO: Exponentially decress gain near end
  
  return rawBuffer;

};


export { SampleTrackGraph, SynthesizeComposition };
