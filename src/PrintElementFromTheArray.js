import React from "react";

export default class PrintElementFromTheArray extends React.Component {
  getIndexedArrayElement = (arr, indexTobeSearch) => {
    let found;
    arr.forEach((element, index) => {
      if (indexTobeSearch === index) {
        found = element;
      }
    });
    return found;
  };

  render() {
    let arr = [10, 20, 30, 40, 50, 60, 70];
    let index = 4;
    return <div>{this.getIndexedArrayElement(arr, index)}</div>;
  }
}
