import React, { Component } from "react";
import Header from "./components/Header";
import Menu from "./components/Menu";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header />
        <div>
          <Menu />
        </div>
      </div>
    );
  }
}

export default App;
