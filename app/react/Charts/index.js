import React from 'react';
import {Chart} from 'react-google-charts';

export default class ChartExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {googleChart: false};
  }

  componentDidMount() {
    this.setState({googleChart: true});
  }

  render() {
    const options = {
      chartTitle: 'DonutChart',
      chartType: 'PieChart',
      width: '100%',
      height: '500px',
      data: [
        ['Pais', 'cantidad'],
        ['Colombia', 21],
        ['El Salvador', 7],
        ['Peru', 6],
        ['Mexico', 5],
        ['Ecuador', 5],
        ['Venezuela', 2],
        ['Haiti', 2],
        ['Chile', 1],
        ['Costa Rica', 1]
      ],
      options: {title: 'Ordenes de la Corte: Paises', pieHole: 0, is3D: true}
    };

    return this.state.googleChart ? <Chart {...options}/> : null;
  }
}
