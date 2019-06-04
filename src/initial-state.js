export default {

  selectedTabId: 't0',
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
          title: "Tab 1",
          expression: "10*x",
          length: 500,
          volume: 100
        },
        {
          id: "t1",
          title: "Tab 2",
          expression: "20*x",
          length: 500,
          volume: 100
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
          id: "t2",
          title: "Tab 3",
          expression: "10*x",
          length: 500,
          volume: 100
        },
        {
          id: "t3",
          title: "Tab 4",
          expression: "20*x",
          length: 500,
          volume: 100
        }
      ]
    }

  ]
};
