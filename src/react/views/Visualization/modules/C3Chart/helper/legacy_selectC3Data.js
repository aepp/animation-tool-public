import {duration} from 'moment';
import {format} from 'd3';
import {sum, stringObj, toInteger} from './legacy_common';
let allSelectedItems = [
  {
    value: '2_ElbowRight_X'
  },
  {
    value: '2_ElbowRight_Y'
  },
  {
    value: '2_ElbowRight_Z'
  }
  // {
  //   value: '2_ElbowLeft_X'
  // },
  // {
  //   value: '2_ElbowLeft_Y'
  // },
  // {
  //   value: '2_ElbowLeft_Z'
  // }
];
export function treeOnChange({attrDict}) {
  let keyMax = 0;
  let xs = {};
  const columns = [];
  const normalize = false;

  for (let i in allSelectedItems) {
    let attr = allSelectedItems[i].value;
    if (sum(attrDict[attr]) !== 0 && !isNaN(sum(attrDict[attr]))) {
      const cols = [];
      if (normalize) {
        let arr = Object.keys(attrDict[attr]).map(k => attrDict[attr][k]);
        let xMin = Math.min.apply(null, arr);
        let xMax = Math.max.apply(null, arr);
        for (let value of attrDict[attr]) {
          cols.push((2 * (value - xMin)) / (xMax - xMin) - 1);
        }
        // $.each(attrDict[attr], function (key, value) {
        //   cols.push((2 * (value - xMin)) / (xMax - xMin) - 1);
        // });
        //cols = $.map(attrDict[attr], function (value, key) { return (2*(value - xMin)/ (xMax - xMin))-1 });
      } else {
        // console.log('attrDict[attr]', attrDict[attr]);
        Object.keys(attrDict[attr]).forEach(key =>
          cols.push(attrDict[attr][key])
        );
        // for (let value of attrDict[attr]) {
        //   cols.push(value);
        // }
        // $.each(attrDict[attr], function (key, value) {
        //   cols.push(value);
        // });
        //cols = $.map(attrDict[attr], function (value, key) { return value });
      }
      cols.unshift(attr);
      // attrDict[attr];
      let rows = [];
      Object.keys(attrDict[attr]).forEach(key =>
        rows.push(duration(key).asSeconds())
      );
      // attrDict[attr].forEach((value, key) => {
      //   rows.push(duration(key).asSeconds());
      // });
      // $.each(attrDict[attr], function (key, value) {
      //   rows.push(moment.duration(key).asSeconds());
      // });
      //rows = $.map(attrDict[attr], function (value, key) { return moment.duration(key).asSeconds()});
      let max = duration(
        Object.keys(attrDict[attr])[Object.keys(attrDict[attr]).length - 1]
      ).asSeconds();
      if (max > keyMax) {
        keyMax = max;
      }
      rows.unshift(attr + '_x');
      columns.push(cols);
      columns.push(rows);
      xs[attr] = attr + '_x';
    } else if (stringObj(attrDict[attr])) {
      // String time series (e.g. feedback)
      let rows = attrDict[attr].map((value, key) => {
        return duration(key).asSeconds();
      });
      // $.map(attrDict[attr], function (value, key) {
      //   return moment.duration(key).asSeconds();
      // });
      rows.unshift(attr + '_x');
      let values = attrDict[attr].map(() => {
        return '0';
      });
      // $.map(attrDict[attr], function (value, key) {
      //   return '0';
      // });
      values.unshift(attr);
      columns.push(values);
      columns.push(rows);
      xs[attr] = attr + '_x';
    }
  }
  const xAxisTicks = [];
  if (keyMax > 0) {
    let q = keyMax / 20;
    for (let i = 0; i <= 20; i = i + 1) {
      xAxisTicks.push(toInteger(q * (i + 1)));
    }
  }
  return generatePlot(xs, columns, xAxisTicks, attrDict);
}

function generatePlot(xs, columns, xAxisTicks, attrDict) {
  return {
    data: {
      xs: {
        ...xs
      },
      xFormat: '%S.%L', //'%H:%M:%S.%L'	,
      columns,
      onclick: function (id) {
        if (window._AnimationToolInstance) {
          window._AnimationToolInstance.updateFrameIdx(id.index);
        }
      }
    },
    subchart: {
      show: true
      // onbrush: function (domain) {
      //   $('#interval').val(domain[0].toFixed(3) + ', ' + domain[1].toFixed(3));
      // }
    },
    legend: {
      show: false
    },
    grid: {
      x: {show: true},
      y: {show: true}
    },
    zoom: {
      enabled: false,
      rescale: true
      // onzoom: function (domain) {
      //   $('#interval').val(domain[0].toFixed(3) + ', ' + domain[1].toFixed(3));
      // }
    },
    axis: {
      x: {
        //type: 'timeseries',
        tick: {
          format: x => {
            // return duration(x, 'seconds').format('hh:mm:ss');
            return duration(x, 'seconds').humanize();
          },
          values: xAxisTicks
        },
        label: 'Time (s)'
      },
      y: {
        tick: {
          format: () => format('.2f')
        }
      }
    },
    size: {
      height: 500
    },
    padding: {
      top: 20
    },
    tooltip: {
      grouped: false,
      format: {
        title: d => {
          // return duration(d, 'seconds').format('hh:mm:ss.SSS');
          return duration(d, 'seconds').humanize();
        },
        value: (value, ratio, id, index) => {
          return attrDict[id][Object.keys(attrDict[id])[index]];
        }
      }
    }
  };
}
