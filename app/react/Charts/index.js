import React from 'react';
import {VictorySharedEvents, VictoryPie, VictoryLegend, VictoryLabel} from 'victory';

class LegendVictoryLabel extends React.Component {
  render() {
    return <VictoryLabel {...this.props} />;
  }
}

export default class ChartExample extends React.Component {
  render() {
    const data = [
      {name: 'Colombia', value: 21},
      {name: 'El Salvador', value: 7},
      {name: 'Peru', value: 6},
      {name: 'Mexico', value: 5},
      {name: 'Ecuador', value: 5},
      {name: 'Venezuela', value: 2},
      {name: 'Haiti', value: 2},
      {name: 'Chile', value: 1},
      {name: 'Costa Rica', value: 1}
    ];

    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#D24040'];

    return (
      <svg viewBox="0 0 900 350">
        <VictorySharedEvents
          events={[{
            childName: ['innerRing', 'outerRing', 'legend'],
            target: 'data',
            eventHandlers: {
              onMouseOver: () => {
                return [{
                  childName: ['innerRing', 'outerRing'],
                  mutation: (props) => {
                    return {
                      style: Object.assign({}, props.style, {opacity: 1})
                    };
                  }
                }, {
                  childName: ['innerRing'],
                  target: 'labels',
                  mutation: (props) => {
                    return {
                      text: `${props.data[props.index].name}\nItems: ${props.data[props.index].value}`,
                      style: [{fontSize: '12px', fontWeight: 'bold'}, {fontSize: '10px', fill: '#999'}]
                    };
                  }
                }];
              },
              onMouseOut: () => {
                return [{
                  childName: ['innerRing', 'outerRing'],
                  mutation: () => {
                    return null;
                  }
                }, {
                  childName: ['innerRing'],
                  target: 'labels',
                  mutation: () => {
                    return {text: ''};
                  }
                }];
              }
            }
          }]}>
          <g transform={"translate(290, -40)"}>
            <VictoryPie name="outerRing"
              width={350}
              standalone={false}
              data={data}
              x="name"
              y="value"
              style={{
                labels: {fontSize: 6},
                parent: {border: '1px solid #f00'},
                data: {opacity: 0}
              }}
              labelComponent={<VictoryLabel text=""/>}
              colorScale={colors}
              innerRadius={120}
            />
          </g>
          <g transform={"translate(300, -40)"}>
            <VictoryPie name="innerRing"
              width={330}
              standalone={false}
              data={data}
              x="name"
              y="value"
              style={{data: {opacity: 0.75}}}
              labelComponent={<VictoryLabel text=""/>}
              colorScale={colors}
            />
          </g>
          <g transform={"translate(0,0)"}>
            <VictoryLegend name="legend"
                           data={data}
                           colorScale={colors}
                           labelComponent={<LegendVictoryLabel />}/>
          </g>
        </VictorySharedEvents>
      </svg>
    );
  }
}
