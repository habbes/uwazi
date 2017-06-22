import React from 'react';
import {VictoryContainer, VictoryPie, VictoryLegend, VictoryLabel} from 'victory';

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
      <VictoryContainer width={1200} height={350} responsive={true}>
        <VictoryPie
          data={data}
          x="name"
          y="value"
          width={720}
          height={270}
          style={{
            labels: {fontSize: 12},
            parent: {border: '1px solid #f00'},
            data: {opacity: 0.75}
          }}
          colorScale={colors}
          padding={{left: 100, top: 50, bottom: 50}}

          labelComponent={<VictoryLabel text=""/>}

          events={[
            {
              target: 'data',
              eventHandlers: {
                onMouseOver: () => {
                  return [{
                    mutation: (props) => {
                      return {
                        style: Object.assign({}, props.style, {opacity: 1})
                      };
                    }
                  }, {
                    target: 'labels',
                    mutation: (props) => {
                      return {
                        text: `${props.data[props.index].name}\nItems: ${props.data[props.index].value}`,
                        style: [{fontWeight: 'bold'}, {fill: '#999'}]
                      };
                    }
                  }];
                },
                onMouseOut: () => {
                  return [{
                    mutation: (props) => {
                      return {
                        style: Object.assign({}, props.style, {opacity: 0.75})
                      };
                    }
                  }, {
                    target: 'labels',
                    mutation: () => {
                      return {text: ''};
                    }
                  }];
                }
              }
            }
          ]}
        />
        <VictoryLegend data={data} colorScale={colors}/>
      </VictoryContainer>
    );
  }
}
