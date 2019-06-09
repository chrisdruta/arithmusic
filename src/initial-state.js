export default {
  fs: 44100,
  volume: 100,
  multiplier: 1,
  aliasing: true,
  selectedSegmentId: 't0',
  showLoadModal: false,
  showSaveModal: false,
  showSettingsModal: false,
  timelines: [
    {
      options: {
        title: 'Untitled Track 1',
        type: 'sine',
        mute: false
      },
      segments: [
        {
          id: "t0",
          title: { value: "Tab 1", error: "" },
          expression: { value: "10*x", error: "" },
          length: { value: 500, error: "" },
          volume: { value: 100, error: "" }
        },
        {
          id: "t1",
          title: { value: "Tab 2", error: "" },
          expression: { value: "20*x", error: "" },
          length: { value: 500, error: "" },
          volume: { value: 100, error: "" }
        }
      ]
    },
    {
      options: {
        title: 'Untitled Track 2',
        type: 'saw',
        mute: true
      },
      segments: [
        {
          id: "t3",
          title: { value: "Tab 3", error: "" },
          expression: { value: "20*x", error: "" },
          length: { value: 500, error: "" },
          volume: { value: 100, error: "" }
        },
        {
          id: "t4",
          title: { value: "Tab 4", error: "" },
          expression: { value: "20*x", error: "" },
          length: { value: 500, error: "" },
          volume: { value: 100, error: "" }
        }
      ]
    }

  ]
};
