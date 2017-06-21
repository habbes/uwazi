import React from 'react';
import {ResponsiveContainer, PieChart, Pie, Cell, Sector} from 'recharts';

export default class ChartExample extends React.Component {
  componentWillMount() {
    this.setState({activeIndex: 0});
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

  onPieEnter(data, index) {
    this.setState({
      activeIndex: index
    });
  }

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
      <ResponsiveContainer height={280}>
        <PieChart>
          <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              activeIndex={this.state.activeIndex}
              activeShape={this.renderActiveShape}
              onMouseMove={this.onPieEnter.bind(this)}
              fill="#8884d8"
          >
            {data.map((entry, index) => <Cell key={index} fill={colors[index % colors.length]}/>)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

// import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts';

// export default class ChartExample extends React.Component {
//   render() {
//     const data = [
//       {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
//       {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
//       {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
//       {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
//       {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
//       {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
//       {name: 'Page G', uv: 3490, pv: 4300, amt: 2100}
//     ];

//     return (
//       <LineChart width={600} height={300} data={data} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
//         <Line type="monotone" dataKey="uv" stroke="#8884d8" />
//         <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//       </LineChart>
//     );
//   }
// }
