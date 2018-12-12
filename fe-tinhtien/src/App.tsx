import React, { Component } from "react";
import "@com.mgmtp.a12/plasma-design/dist/plasma.css";
import "./App.css";
import Overview from "./pages/Overview";

const BASE_URL = "http://localhost:8080/get-increasing-number";

class App extends Component<{}, { displayNumber?: number }> {
  state = {
    displayNumber: 0
  };

  async componentDidMount(): Promise<void> {
    const rawResult = await fetch(BASE_URL);
    const numberResult = (await rawResult.json()) as number;
    this.setState({
      displayNumber: numberResult
    });
  }

  render() {
    return (
      <div>
        <label>Hello, number {this.state.displayNumber}</label>
        <Overview />
      </div>
    );
  }
}

export default App;
