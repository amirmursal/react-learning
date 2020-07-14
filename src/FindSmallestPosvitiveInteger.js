import React from "react";

export default class FindSmallestPositiveInteger extends React.Component {
  getSmallestPositiveInteger = (arr) => {
    let missingNumbers = [];
    for (let i = Math.min(...arr); i <= Math.max(...arr); i++) {
      if (arr.indexOf(i) === -1) {
        missingNumbers.push(i);
      }
    }
    return Math.min(...missingNumbers);
  };

  render() {
    let arr = [2, -1, 8, 5];
    return <div>{this.getSmallestPositiveInteger(arr)}</div>;
  }
}
