import React from "react";

/**
 *  arr[ 1, 2, 3] o / p: 1 + 2 =3 the pair should have minimum sum
 */
export default class FindMinimumSumOfPair extends React.Component {
  getMinimumSumOfPair = arr => {
    let arrLength = arr.length;
    let minimum = Number.MAX_VALUE,
      secondMin = Number.MAX_VALUE;

    for (let j = 0; j < arrLength; j++) {
      // if found new minimum
      if (arr[j] < minimum) {
        secondMin = minimum; // minimum become secodn mini
        minimum = arr[j]; // update the mini
        // if current element is greater than minimum and less than second mini
      } else if (arr[j] < secondMin && arr[j] !== minimum) {
        secondMin = arr[j]; // update second mini
      }
    }
    return secondMin + minimum;
  };

  render() {
    let arr = [1, 2, 8, 5];
    return <div>{this.getMinimumSumOfPair(arr)}</div>;
  }
}
