/** Declaration file generated by dts-gen */
import * as React from "react";

export class AsyncPanel extends React.Component {
  constructor(props: any);

  componentDidMount(): void;

  componentWillReceiveProps(nextProps: any): void;

  loadPanel(): any;

  render(): any;

  static defaultProps: {
    cache: boolean;
  };
}

export class DragTab extends React.Component {
  constructor(...args: any[]);

  render(): any;

  static displayName: string;
}

export class DragTabList extends React.Component {
  constructor(...args: any[]);

  render(): any;

  static displayName: string;
}

export class ExtraButton extends React.Component {
  constructor(...args: any[]);

  render(): any;

  static defaultProps: {
    disabled: boolean;
  };
}

export class Panel extends React.Component {
  constructor(...args: any[]);

  render(): any;
}

export class PanelList extends React.Component {
  constructor(...args: any[]);

  render(): any;
}

export class Tab extends React.Component {
  constructor(props: any);

  clickDelete(event: any): void;

  clickTab(): void;

  render(): any;

  static displayName: string;
}

export class TabList extends React.Component {
  constructor(props: any);

  componentDidMount(): void;

  componentDidUpdate(prevProps: any, prevState: any): void;

  getTabNode(tab: any): any;

  handleScroll(direction: any): void;

  isShowArrowButton(): void;

  isShowModalButton(): void;

  render(): any;

  renderArrowButton(ScrollButton: any): any;

  renderTabs(...args: any[]): any;

  scrollToIndex(index: any, rectSide: any): void;

  scrollToZero(): void;

  toggleModal(open: any): void;

  unifyScrollMax(width: any): any;

  static displayName: string;
}

export class Tabs extends React.Component {
  constructor(props: any);

  componentWillReceiveProps(nextProps: any): void;

  getActiveIndex(props: any): any;

  handleEdit(_ref2: any): void;

  handleTabChange(index: any): void;

  handleTabSequence(_ref: any): void;

  render(): any;
}

export const styled: {
  ActionButtonStyle: {
    $$typeof: any;
    attrs: any[];
    componentStyle: {
      componentId: string;
      generateAndInjectStyles: any;
      isStatic: boolean;
      rules: string[];
    };
    displayName: string;
    foldedComponentIds: any[];
    render: any;
    styledComponentId: string;
    target: string;
    toString: any;
    warnTooManyClasses: any;
    withComponent: any;
  };
  PanelStyle: {
    $$typeof: any;
    attrs: any[];
    componentStyle: {
      componentId: string;
      generateAndInjectStyles: any;
      isStatic: boolean;
      rules: string[];
    };
    displayName: string;
    foldedComponentIds: any[];
    render: any;
    styledComponentId: string;
    target: string;
    toString: any;
    warnTooManyClasses: any;
    withComponent: any;
  };
  TabListStyle: {
    $$typeof: any;
    attrs: any[];
    componentStyle: {
      componentId: string;
      generateAndInjectStyles: any;
      isStatic: boolean;
      rules: string[];
    };
    displayName: string;
    foldedComponentIds: any[];
    render: any;
    styledComponentId: string;
    target: string;
    toString: any;
    warnTooManyClasses: any;
    withComponent: any;
  };
  TabStyle: {
    $$typeof: any;
    attrs: any[];
    componentStyle: {
      componentId: string;
      generateAndInjectStyles: any;
      isStatic: boolean;
      rules: string[];
    };
    displayName: string;
    foldedComponentIds: any[];
    render: any;
    styledComponentId: string;
    target: string;
    toString: any;
    warnTooManyClasses: any;
    withComponent: any;
  };
};

export namespace AsyncPanel {
  const isMounted: any;

  const isPureReactComponent: boolean;

  const isReactComponent: {};

  const replaceState: any;

  function componentDidMount(): void;

  function componentWillReceiveProps(nextProps: any): void;

  function forceUpdate(callback: any): void;

  function loadPanel(): any;

  function render(): any;

  function setState(partialState: any, callback: any): void;

  namespace componentDidMount {
    const prototype: {};
  }

  namespace componentWillReceiveProps {
    const prototype: {};
  }

  namespace forceUpdate {
    const prototype: {};
  }

  namespace loadPanel {
    const prototype: {};
  }

  namespace render {
    const prototype: {};
  }

  namespace setState {
    const prototype: {};
  }
}

export namespace DragTab {
  const isMounted: any;

  const isPureReactComponent: boolean;

  const isReactComponent: {};

  const replaceState: any;

  function forceUpdate(callback: any): void;

  function render(): any;

  function setState(partialState: any, callback: any): void;

  namespace forceUpdate {
    const prototype: {};
  }

  namespace render {
    const prototype: {};
  }

  namespace setState {
    const prototype: {};
  }
}

export namespace DragTabList {
  const isMounted: any;

  const isPureReactComponent: boolean;

  const isReactComponent: {};

  const replaceState: any;

  function forceUpdate(callback: any): void;

  function onSortEnd(_ref: any): void;

  function render(): any;

  function setState(partialState: any, callback: any): void;

  namespace forceUpdate {
    const prototype: {};
  }

  namespace onSortEnd {
    const prototype: {};
  }

  namespace render {
    const prototype: {};
  }

  namespace setState {
    const prototype: {};
  }
}

export namespace ExtraButton {
  const isMounted: any;

  const isPureReactComponent: boolean;

  const isReactComponent: {};

  const replaceState: any;

  function forceUpdate(callback: any): void;

  function render(): any;

  function setState(partialState: any, callback: any): void;

  namespace forceUpdate {
    const prototype: {};
  }

  namespace render {
    const prototype: {};
  }

  namespace setState {
    const prototype: {};
  }
}

export namespace Panel {
  const isMounted: any;

  const isPureReactComponent: boolean;

  const isReactComponent: {};

  const replaceState: any;

  function forceUpdate(callback: any): void;

  function render(): any;

  function setState(partialState: any, callback: any): void;

  namespace forceUpdate {
    const prototype: {};
  }

  namespace render {
    const prototype: {};
  }

  namespace setState {
    const prototype: {};
  }
}

export namespace PanelList {
  const isMounted: any;

  const isPureReactComponent: boolean;

  const isReactComponent: {};

  const replaceState: any;

  function forceUpdate(callback: any): void;

  function render(): any;

  function setState(partialState: any, callback: any): void;

  namespace forceUpdate {
    const prototype: {};
  }

  namespace render {
    const prototype: {};
  }

  namespace setState {
    const prototype: {};
  }
}

export namespace Tab {
  const isMounted: any;

  const isPureReactComponent: boolean;

  const isReactComponent: {};

  const replaceState: any;

  function clickDelete(event: any): void;

  function clickTab(): void;

  function forceUpdate(callback: any): void;

  function render(): any;

  function setState(partialState: any, callback: any): void;

  namespace clickDelete {
    const prototype: {};
  }

  namespace clickTab {
    const prototype: {};
  }

  namespace forceUpdate {
    const prototype: {};
  }

  namespace render {
    const prototype: {};
  }

  namespace setState {
    const prototype: {};
  }
}

export namespace TabList {
  const isMounted: any;

  const isReactComponent: {};

  const replaceState: any;

  function componentDidMount(): void;

  function componentDidUpdate(prevProps: any, prevState: any): void;

  function forceUpdate(callback: any): void;

  function getTabNode(tab: any): any;

  function handleScroll(direction: any): void;

  function isShowArrowButton(): void;

  function isShowModalButton(): void;

  function render(): any;

  function renderArrowButton(ScrollButton: any): any;

  function renderTabs(...args: any[]): any;

  function scrollToIndex(index: any, rectSide: any): void;

  function scrollToZero(): void;

  function setState(partialState: any, callback: any): void;

  function toggleModal(open: any): void;

  function unifyScrollMax(width: any): any;

  namespace componentDidMount {
    const prototype: {};
  }

  namespace componentDidUpdate {
    const prototype: {};
  }

  namespace forceUpdate {
    const prototype: {};
  }

  namespace getTabNode {
    const prototype: {};
  }

  namespace handleScroll {
    const prototype: {};
  }

  namespace isShowArrowButton {
    const prototype: {};
  }

  namespace isShowModalButton {
    const prototype: {};
  }

  namespace render {
    const prototype: {};
  }

  namespace renderArrowButton {
    const prototype: {};
  }

  namespace renderTabs {
    const prototype: {};
  }

  namespace scrollToIndex {
    const prototype: {};
  }

  namespace scrollToZero {
    const prototype: {};
  }

  namespace setState {
    const prototype: {};
  }

  namespace toggleModal {
    const prototype: {};
  }

  namespace unifyScrollMax {
    const prototype: {};
  }
}

export namespace Tabs {
  namespace defaultProps {
    const customStyle: {
      ActionButton: any;
      Panel: any;
      Tab: any;
      TabList: any;
    };

    const showArrowButton: string;

    const showModalButton: number;

    function onTabChange(): void;

    function onTabSequenceChange(): void;

    namespace onTabChange {
      const prototype: {};
    }

    namespace onTabSequenceChange {
      const prototype: {};
    }
  }

  const isMounted: any;

  const isReactComponent: {};

  const replaceState: any;

  function componentWillReceiveProps(nextProps: any): void;

  function forceUpdate(callback: any): void;

  function getActiveIndex(props: any): any;

  function handleEdit(_ref2: any): void;

  function handleTabChange(index: any): void;

  function handleTabSequence(_ref: any): void;

  function render(): any;

  function setState(partialState: any, callback: any): void;

  namespace componentWillReceiveProps {
    const prototype: {};
  }

  namespace forceUpdate {
    const prototype: {};
  }

  namespace getActiveIndex {
    const prototype: {};
  }

  namespace handleEdit {
    const prototype: {};
  }

  namespace handleTabChange {
    const prototype: {};
  }

  namespace handleTabSequence {
    const prototype: {};
  }

  namespace render {
    const prototype: {};
  }

  namespace setState {
    const prototype: {};
  }
}
