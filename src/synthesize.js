import { map, range } from 'lodash';
import { parse, simplify } from 'mathjs';

const SampleTrack = (segments, multiplier) => {
  if (segments === null) return;
  const data = [];

  segments.forEach((segment, index) => {
    const length = !segment.length.error ? segment.length.value : 0;
    let offset = 0;
    for (let i = 0; i < index; i++) {
      let offsetLength = !segments[i].length.error ? segments[i].length.value : 0;
      offset += offsetLength / 1000;
    }

    const sampleInput = range(0, length / 1000, 1/1000);
    const func = !segment.expression.error ? simplify(parse(segment.expression.value)).compile() : parse("0").compile();
    const sampleOutput = map(sampleInput, (x) => func.evaluate({ x: multiplier * x }));
    const shiftedSampleInput = map(sampleInput, (x) => (x + offset));
    
    data.push({
      x: shiftedSampleInput,
      y: sampleOutput
    });

  });

  return data;
};

const SynthesizeComposition = (timelines, masterVolume, multiplier, fs, aliasing) => {
  // Find required buffer size
  let maxLength = 0;
  timelines.forEach((timeline) => {
    let tempLength = 0;
    timeline.segments.forEach((segment) => {
      tempLength += !segment.length.error ? segment.length.value : 0;
    });
    if (tempLength > maxLength) maxLength = tempLength;
  });

  // Synthesize
  const bufferSize = maxLength / 1000 * fs;
  const rawBuffer = new Float32Array(bufferSize);
  
  
  timelines.forEach((timeline) => {
    let bufferIndex = 0;
    const sampledSegments = SampleTrack(timeline.segments, multiplier);
    
    sampledSegments.forEach((sample, index) => {
      let volumeMultiplier = masterVolume * (!timeline.segments[index].volume.error ? timeline.segments[index].volume.value : 0) / 100 / 100;
      sample.y.forEach((tone) => {
        for (let j = 0; j < fs / 2000; j++) {
          // TODO: assign wave type to a const and use to evaluate instead of just sine wave
          //rawBuffer[bufferIndex] += volumeMultiplier * Math.sin(j/((fs/tone)/(Math.PI * 2)));
          rawBuffer[bufferIndex] += volumeMultiplier * Math.cos(2 * Math.PI * tone * j / fs)
          bufferIndex++;
        }
      });
    });

  });

  return rawBuffer;

};

const SynthesizeGraphData = (segments, multiplier) => {
  const plotData = [];
  SampleTrack(segments, multiplier).forEach((segment) => {
    plotData.push(Object.assign({ mode: "lines" }, segment));
  });
  return plotData;
};

export { SynthesizeGraphData, SynthesizeComposition };
