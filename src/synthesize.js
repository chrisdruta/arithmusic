import { range, map } from 'lodash';
import { parse, simplify } from 'mathjs';

const hasErrors = (segment) => {
    return !!segment.length.error || !!segment.expression.error;
}

const SynthesizeGraphData = (segments, multiplier) => {
    const plotData = [];
    if (segments === null) return;
    segments.forEach((seg, index) => {
        if (!hasErrors(seg)) {
            let offset = 0;
            for (let i = 0; i < index; i++) {
                offset += segments[i].length.value / 1000;
            }

            const sampleInput = range(0, seg.length.value / 1000, 1 / 1000);
            const func = simplify(parse(seg.expression.value)).compile();
            const sampleOutput = map(sampleInput, (x) => func.evaluate({ x: multiplier * x }));
            const shiftedSampleInput = map(sampleInput, (x) => (x + offset));

            plotData.push({
                x: shiftedSampleInput,
                y: sampleOutput,
                mode: "lines"
            });
        }
    });

    return plotData;
};

export { SynthesizeGraphData };
