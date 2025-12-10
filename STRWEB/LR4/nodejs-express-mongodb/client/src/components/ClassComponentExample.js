import React, { Component } from 'react';
import './ClassComponentExample.css';

class ClassComponentExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  handleIncrement = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div className="class-component-example">
        <h2>Пример классового компонента</h2>
        <p>Вы нажали на кнопку {this.state.count} раз.</p>
        <button onClick={this.handleIncrement}>
          Нажми на меня
        </button>
      </div>
    );
  }
}

export default ClassComponentExample;
