import React from "react";

export default class SumOfArrayElements extends React.Component {
  getSumofArrayElement = () => {
    let arr = [1, 2, 3];
    let sum = 0;
    arr.forEach(element => {
      sum += element;
    });
    return sum;
  };

  render() {
    return <div>{this.getSumofArrayElement()}</div>;
  }
}
