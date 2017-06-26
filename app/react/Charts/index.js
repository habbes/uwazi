import React from 'react';
import C3Chart from 'react-c3js';

export class ChartPie extends React.Component {
  render() {
    const chartData = {
      data: {
        columns: [
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
        type: 'pie',
        title: 'Pais'
      },
      legend: {
        position: 'inset',
        inset: {
          anchor: 'top-right',
          x: 20,
          y: 0,
          step: null
        }
      },
      pie: {
        expand: false
      }
    };

    return (
      <C3Chart {...chartData} />
    );
  }
}

export class ChartBar extends React.Component {
  render() {
    // ['Medidas Provisionales', 34],
    // ['Supervisión de cumplimiento de Sentencia', 16],
    // ['En casos', 2],
    // ['De asunto', 2],
    // ['Otros', 1]
    const chartData = {
      data: {
        columns: [
          ['Manuel E. Ventura Robles', 37],
          ['Diego García-Sayán', 28],
          ['Eduardo Vio Grossi', 24],
          ['Leonardo A. Franco', 23],
          ['Rhadys Abreu Blondet', 23],
          ['Margarette May Macaulay', 22],
          ['Alberto Pérez Pérez', 21],
          ['Sergio García Ramírez', 20],
          ['Cecilia Medina Quiroga', 14],
          ['Roberto de Figueiredo Caldas', 13],
          ['Antonio A. Cançado Trindade', 12],
          ['Alirio Abreu Burelli', 12],
          ['Eduardo Ferrer Mac-Gregor Poisot', 12],
          ['Oliver Jackman', 10],
          ['Humberto Antonio Sierra Porto', 9],
          ['Hernán Salgado Pesantes', 8],
          ['Máximo Pacheco Gómez', 7],
          ['Carlos Vicente de Roux-Rengifo', 6],
          ['Héctor Fix Zamudio', 2],
          ['Eugenio Raúl Zaffaroni', 1],
          ['Leoncio Patricio Pazmiño Freire', 1],
          ['Elizabeth Odio Benito', 1]
        ],
        type: 'bar'
      },
      axis: {
        x: {
          type: 'category',
          categories: [
            'Firmantes'
          ]
        }
      },
      legend: {
        // position: 'inset',
        // inset: {
        //   anchor: 'top-right',
        //   x: 20,
        //   y: 0,
        //   step: null
        // }
      },
      tooltip: {
        grouped: false
      }
    };

    return (
      <C3Chart {...chartData} />
    );
  }
}

export class ChartBarAlt extends React.Component {
  render() {
    // ['Medidas Provisionales', 34],
    // ['Supervisión de cumplimiento de Sentencia', 16],
    // ['En casos', 2],
    // ['De asunto', 2],
    // ['Otros', 1]

    const titles = [
      'Manuel E. Ventura Robles',
      'Diego García-Sayán',
      'Eduardo Vio Grossi',
      'Leonardo A. Franco',
      'Rhadys Abreu Blondet',
      'Margarette May Macaulay',
      'Alberto Pérez Pérez',
      'Sergio García Ramírez',
      'Cecilia Medina Quiroga',
      'Roberto de Figueiredo Caldas',
      'Antonio A. Cançado Trindade',
      'Alirio Abreu Burelli',
      'Eduardo Ferrer Mac-Gregor Poisot',
      'Oliver Jackman',
      'Humberto Antonio Sierra Porto',
      'Hernán Salgado Pesantes',
      'Máximo Pacheco Gómez',
      'Carlos Vicente de Roux-Rengifo',
      'Héctor Fix Zamudio',
      'Eugenio Raúl Zaffaroni',
      'Leoncio Patricio Pazmiño Freire',
      'Elizabeth Odio Benito'
    ];

    const values = [37, 28, 24, 23, 23, 22, 21, 20, 14, 13, 12, 12, 12, 10, 9, 8, 7, 6, 2, 1, 1, 1];

    const chartData = {
      data: {
        columns: [
          ['Firmantes', ...values]
        ],
        type: 'bar'
      },
      axis: {
        x: {
          type: 'category',
          categories: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
        }
      },
      legend: {
        // position: 'inset',
        // inset: {
        //   anchor: 'top-right',
        //   x: 20,
        //   y: 0,
        //   step: null
        // }
      },
      tooltip: {
        grouped: true,
        format: {
          title: () => 'Firmantes',
          name: function (name, ratio, id, index) {
            return titles[index];
          }
        }
      }
    };

    return (
      <C3Chart {...chartData} />
    );
  }
}

export default class ChartExample extends React.Component {
  render() {
    return (
      <div>
        <ChartPie />
        <ChartBar />
        <ChartBarAlt />
      </div>
    );
  }
}
