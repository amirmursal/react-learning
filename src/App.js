import React from "react";
import SumOfArrayElements from "./SumOfArrayElements";
import PrintElementFromTheArray from "./PrintElementFromTheArray";
import FindMinimumSumOfPair from "./FindMinimumSumOfPair";

export default class App extends React.Component {
  render() {
    return (
      <div>
        {/*<SumOfArrayElements />
        <PrintElementFromTheArray />*/}
        <FindMinimumSumOfPair />
      </div>
    );
  }
}
