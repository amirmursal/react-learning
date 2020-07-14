import React from "react";

export default class FindScore extends React.Component {
    getNonScoredCountriesCount = (arr) => {
        let scoredCentury;
        const output = arr.map(([country, score]) => ({ country, score }));

        for (let i = 0; i < output.length; i++) {
            if (output[i].score > 100)
                scoredCentury = output[i].country;
        }
        const filtered = output.filter((element) => element.country !== scoredCentury);
        const result = filtered.reduce((unique, current) => {
            if (!unique.some(obj => obj.country === current.country && obj.country !== scoredCentury)) {
                unique.push(current);
            }
            return unique;
        }, []);

        return result.length;

    };

    render() {
        let arr = [
            ["Pakistan", 23],
            ["Pakistan", 127],
            ["India", 3],
            ["India", 71],
            ["Australia", 31],
            ["India", 22],
            ["Pakistan", 81]
        ];
        return <div>{this.getNonScoredCountriesCount(arr)}</div>;
    }
}
