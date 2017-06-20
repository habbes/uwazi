import React from 'react';
import ReactDOM from 'react-dom';
import {RadialChart, Hint} from 'react-vis';

export default class RadialChartExample extends React.Component {
  componentWillMount() {
    this.setState({value: false});
  }

  render() {
    const {value} = this.state;
    return (
       <RadialChart
        innerRadius={0}
        radius={140}
        showLabels={false}
        animation={true}
        data={[
          {angle: 2},
          {angle: 6, label: 'Un label', subLabel: 'With annotation'},
          {angle: 2, label: 'Otro label'},
          {angle: 3},
          {angle: 1}
        ]}
        onValueMouseOver={v => {
          console.log(v);
          this.setState({value: v});
        }}
        onMouseLeave={() => this.setState({value: false})}
        width={300}
        height={300}
      >
        {value && <Hint value={value}>
          <div className="rv-hint__content">
            <h5>{value.label}</h5><br />{value.subLabel}
          </div>
        </Hint>}
      </RadialChart>
    );
  }
}

ReactDOM.render(<RadialChartExample />, document.querySelector('#chart'));
