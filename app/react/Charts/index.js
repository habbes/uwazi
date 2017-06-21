import React from 'react';
import {RadialChart, Hint} from 'react-vis';

export default class RadialChartExample extends React.Component {
  componentWillMount() {
    this.setState({value: false});
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.value.color !== nextState.value.color;
  }

  render() {
    const {value} = this.state;
    return (
       <RadialChart
        innerRadius={0}
        radius={140}
        showLabels={false}
        animation={true}
        className="donut-chart-example"
        data={[
          {angle: 2},
          {angle: 6, label: 'Un label', subLabel: 'With annotation'},
          {angle: 2, label: 'Otro label'},
          {angle: 3},
          {angle: 1}
        ]}
        onValueMouseOver={v => this.setState({value: v})}
        onMouseLeave={() => this.setState({value: false})}
        width={300}
        height={300}
      >
        {value && value.label && <Hint value={value}>
          <div className="rv-hint__content">
            {value.label}<br /><span style={{color: '#999'}}>{value.subLabel}</span>
          </div>
        </Hint>}
      </RadialChart>
    );
  }
}
