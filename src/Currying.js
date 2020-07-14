import React from "react";

/**
 *  Add any numbers of argumenst with javascript curring method
 */
export default class Curring extends React.Component {
  render() {
    function add() {
      let args = [...arguments];
      function resultFn() {
        let args1 = [...arguments];
        return add(...args, ...args1);
      }
      let total = args.reduce((total, value) => total + value);
      resultFn.value = total;
      return resultFn;
    }
    return <div>{add(4, 5).value}</div>;
  }
}
