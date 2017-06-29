import React from 'react';
import PropTypes from 'prop-types';
import {ResponsiveContainer, PieChart, Pie, Legend, Cell, Sector,
        BarChart, XAxis, YAxis, CartesianGrid, Bar, Tooltip} from 'recharts';

import Immutable from 'immutable';

export class PieExample extends React.Component {
  componentWillMount() {
    const fullData = Immutable.fromJS([
      {name: 'Colombia', value: 21, enabled: true},
      {name: 'El Salvador', value: 7, enabled: true},
      {name: 'Peru', value: 6, enabled: true},
      {name: 'Mexico', value: 5, enabled: true},
      {name: 'Ecuador', value: 5, enabled: true},
      {name: 'Venezuela', value: 2, enabled: true},
      {name: 'Haiti', value: 2, enabled: true},
      {name: 'Chile', value: 1, enabled: true},
      {name: 'Costa Rica', value: 1, enabled: true}
    ]);
    this.setState({activeIndex: 0, fullData});
  }

  renderActiveShape(props) {
    const RADIAN = Math.PI / 180;
    const {cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value} = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#fff"
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${payload.name}: ${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(Proporción: ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  }

  getFilteredIndex(data, index) {
    let filteredIndexMap = {};
    let enabledIndices = -1;
    data.forEach((item, iterator) => {
      if (item.get('enabled')) {
        enabledIndices += 1;
        filteredIndexMap[iterator] = enabledIndices;
        return;
      }
      filteredIndexMap[iterator] = null;
    });

    return filteredIndexMap[index];
  }

  onIndexEnter(data, index) {
    this.setState({activeIndex: index});
  }

  onFullIndexEnter(data, index) {
    this.onIndexEnter(null, this.getFilteredIndex(this.state.fullData, index));
  }

  onIndexClick(data, index) {
    const oldData = this.state.fullData;
    const enabled = !oldData.getIn([index, 'enabled']);
    let activeIndex = null;
    const fullData = oldData.setIn([index, 'enabled'], enabled);
    if (enabled) {
      activeIndex = this.getFilteredIndex(fullData, index);
    }

    this.setState({activeIndex, fullData});
  }

  render() {
    const fullColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#D24040', '#A250B3'];
    const filteredColors = [];

    const fullData = this.state.fullData.toJS();

    const filteredData = fullData.reduce((results, item, index) => {
      if (item.enabled) {
        results.push(item);
        filteredColors.push(fullColors[index % fullColors.length]);
      }
      return results;
    }, []);

    return (
      <ResponsiveContainer height={300}>
        <PieChart>
          <Pie
              data={filteredData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              activeIndex={this.state.activeIndex}
              activeShape={this.renderActiveShape}
              animationBegin={200}
              animationDuration={500}
              onMouseMove={this.onIndexEnter.bind(this)}
              onClick={this.onIndexEnter.bind(this)}
              fill="#8884d8">
            {filteredData.map((entry, index) =>
              <Cell key={index} fill={filteredColors[index]} opacity={0.8} />
            )}
          </Pie>
          <Legend layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  onMouseEnter={this.onFullIndexEnter.bind(this)}
                  onClick={this.onIndexClick.bind(this)}
                  payload={fullData.map((item, index) => {
                    return {
                      value: item.name,
                      type: 'rect',
                      color: fullData[index].enabled ? fullColors[index % fullColors.length] : '#aaa',
                      className: 'mierda',
                      formatter: () => <span style={{color: fullData[index].enabled ? '#333' : '#999'}}>{item.name}</span>
                    };
                  })}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

class ExtendedTooltip extends React.Component {
  render() {
    if (this.props.active) {
      return (
        <div style={{backgroundColor: '#fff', border: '1px solid #ccc'}}>
          <div style={{backgroundColor: '#eee', borderBottom: '1px dashed #ccc', padding: '5px'}}>
            Firmantes
          </div>
          <div style={{padding: '5px'}}>
            {this.props.payload[0].payload.name}:&nbsp;&nbsp;<b style={{color: '#600'}}>{this.props.payload[0].value}</b>
          </div>
        </div>
      );
    }
    return null;
  }
}

ExtendedTooltip.propTypes = {
  payload: PropTypes.array,
  active: PropTypes.bool
};

export class BarExample extends React.Component {
  render() {
    const data = [
      {name: 'Manuel E. Ventura Robles', xAxisName: '', value: 37},
      {name: 'Diego García-Sayán', xAxisName: '', value: 28},
      {name: 'Eduardo Vio Grossi', xAxisName: '', value: 24},
      {name: 'Leonardo A. Franco', xAxisName: '', value: 23},
      {name: 'Rhadys Abreu Blondet', xAxisName: '', value: 23},
      {name: 'Margarette May Macaulay', xAxisName: '', value: 22},
      {name: 'Alberto Pérez Pérez', xAxisName: '', value: 21},
      {name: 'Sergio García Ramírez', xAxisName: '', value: 20},
      {name: 'Cecilia Medina Quiroga', xAxisName: '', value: 14},
      {name: 'Roberto de Figueiredo Caldas', xAxisName: '', value: 13},
      {name: 'Antonio A. Cançado Trindade', xAxisName: '', value: 12},
      {name: 'Alirio Abreu Burelli', xAxisName: '', value: 12},
      {name: 'Eduardo Ferrer Mac-Gregor Poisot', xAxisName: '', value: 12},
      {name: 'Oliver Jackman', xAxisName: '', value: 10},
      {name: 'Humberto Antonio Sierra Porto', xAxisName: '', value: 9},
      {name: 'Hernán Salgado Pesantes', xAxisName: '', value: 8},
      {name: 'Máximo Pacheco Gómez', xAxisName: '', value: 7},
      {name: 'Carlos Vicente de Roux-Rengifo', xAxisName: '', value: 6},
      {name: 'Héctor Fix Zamudio', xAxisName: '', value: 2},
      {name: 'Eugenio Raúl Zaffaroni', xAxisName: '', value: 1},
      {name: 'Leoncio Patricio Pazmiño Freire', xAxisName: '', value: 1},
      {name: 'Elizabeth Odio Benito', xAxisName: '', value: 1}
    ];

    return (
      <ResponsiveContainer height={300}>
        <BarChart height={300} data={data}
                  margin={{top: 5, right: 30, left: 20, bottom: 25}}>
          <XAxis dataKey="xAxisName" label="Firmantes"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="2 4"/>
          <Tooltip content={<ExtendedTooltip parentData={data} />}/>
          <Bar dataKey="value" fill="#D24040" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

export default class ChartExample extends React.Component {
  render() {
    return (
      <div>
        <PieExample />
        <BarExample />
      </div>
    );
  }
}
