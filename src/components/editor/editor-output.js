import React, { Component } from 'react';

import { Tex } from 'react-tex';

import { parse, simplify } from 'mathjs';

const GenerateTex = (expression) => {
  return `\\LARGE f(x)=${simplify(parse(expression)).toTex()}`;
}

class EditorOutput extends Component {

  render() {
    return (
      <div className="EditorOutput">
        <span style={{marginRight: 10}}>Output:</span>
        { !this.props.error
          ? <Tex texContent={GenerateTex(this.props.output)}/>
          : <span>{this.props.output}</span>
        }
      </div>
    )
  }
}

export default EditorOutput;
