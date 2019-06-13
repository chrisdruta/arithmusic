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

    const sampleInput = range(0, lengthMs/1000, 1/1000);
    const func = (!segment.expression.error ? simplify(parse(segment.expression.value)) : parse("0")).compile();
    const sampleOutput = map(sampleInput, (x) => func.evaluate({ x: multiplier * x }));
    const shiftedSampleInput = map(sampleInput, (x) => (x + offsetMs/1000));
    
    data.push({
      mode: "lines",
      x: shiftedSampleInput,
      y: sampleOutput
    });
  });
  return data;
};

const SynthesizeComposition = (timelines, masterVolume, multiplier, fs, aliasing) => {
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
  const bufferSize = maxLengthMs / 1000 * fs;
  const rawBuffer = new Float32Array(bufferSize);

  timelines.forEach((timeline, timelineIndex) => {
    let bufferIndex = 0;

    timeline.segments.forEach((segment, segmentIndex) => {
      console.log(trackLengthsMs[timelineIndex] / 1000 * fs)
      const sampleInput = range(0, trackLengthsMs[timelineIndex] / 1000 * fs);
      const func = (!segment.expression.error ? simplify(parse(segment.expression.value)) : parse("0")).compile();
      const sampleOutput = aliasing ? map(sampleInput, (x) => func.evaluate({ x: multiplier * x }))
                            : map(sampleInput, (x) => func.evaluate({ x: multiplier * x < (fs/2) ? multiplier * x : 0 }));
      
      let volumeMultiplier = masterVolume * (!timeline.segments[segmentIndex].volume.error ? timeline.segments[segmentIndex].volume.value : 0) / 10000;
      sampleOutput.forEach((tone) => {
        rawBuffer[bufferIndex] += volumeMultiplier * Math.cos(2 * Math.PI * tone * bufferIndex / fs);
        bufferIndex++;
      });

    });
    console.log(`Buffer index: ${bufferIndex}`)
  });
  console.log(`Buffer size: ${bufferSize}`)
  
  return rawBuffer;

};

// const poop = (timelines, masterVolume, multiplier, fs, aliasing) => {
//   timelines.forEach((timeline) => {
//     let bufferIndex = 0;
//     const sampledSegments = SampleTrack(timeline.segments, multiplier, fs);
    
//     sampledSegments.forEach((sample, index) => {
//       let volumeMultiplier = masterVolume * (!timeline.segments[index].volume.error ? timeline.segments[index].volume.value : 0) / 100 / 100;
//       sample.y.forEach((tone) => {
//         //for (let j = 0; j < fs / 1000; j++) {
//           // TODO: assign wave type to a const and use to evaluate instead of just sinusoidal wave
//           rawBuffer[bufferIndex] += volumeMultiplier * Math.cos(2 * Math.PI * tone * bufferIndex / fs)
//           bufferIndex++;
//         //}
//       });
//     });
//   });
  
//   return rawBuffer;

// };

export { SampleTrackGraph, SynthesizeComposition };
