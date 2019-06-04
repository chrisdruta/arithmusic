export default {

  selectedTabId: 't1',
  timelines: [
    {
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
      ],
      otherStuff: "blah"
    },
    {
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
      ],
      otherStuff: "poop"
    }

  ]
};
