import React from 'react';
import {Box, Grid, useTheme} from '@mui/material';
import Plot from 'react-plotly.js';
import DefaultTemplate from '../../template/Default';
import {useSelector} from 'react-redux';
import {selectSelectedAnnotationParameter} from './reducers';
import {annotationParameters} from './constants';

const colors = [
  '#0081CF',
  '#0089BA',
  '#008E9B',
  '#008F7A',

  '#D65DB1',
  '#C86FC9',
  '#a10fa3',
  '#bb117a'
];
const rTypes = {video: 'video', animation: 'animation'};
const coefficients = [0.2, 0.4, 0.6, 0.8];

const x = ['r2', 'r4', 'r6', 'r8', 'r1', 'r3', 'r5', 'r7'];

const bodyWeight = [
  /* r1 */
  {
    rId: 1,
    rType: rTypes.video,
    trace: [1, 0.962, 0.946, 0.951, 0.894, 0.663, 0.944, 0.879],
    color: colors[0]
  },
  /* r3 */
  {
    rId: 3,
    rType: rTypes.video,
    trace: [0.946, 0.955, 1, 0.962, 0.934, 0.646, 0.965, 0.876],
    color: colors[1]
  },
  /* r5 */
  {
    rId: 5,
    rType: rTypes.video,
    trace: [0.894, 0.899, 0.934, 0.906, 1, 0.583, 0.936, 0.833],
    color: colors[2]
  },
  /* r7 */
  {
    rId: 7,
    rType: rTypes.video,
    trace: [0.944, 0.939, 0.965, 0.946, 0.936, 0.633, 1, 0.878],
    color: colors[3]
  },

  /* r2 */
  {
    rId: 2,
    rType: rTypes.animation,
    trace: [0.962, 1, 0.955, 0.974, 0.899, 0.657, 0.939, 0.883],
    color: colors[4]
  },
  /* r4 */
  {
    rId: 4,
    rType: rTypes.animation,
    color: colors[5],
    trace: [0.951, 0.974, 0.962, 1, 0.906, 0.655, 0.946, 0.886]
  },
  /* r6 */
  {
    rId: 6,
    rType: rTypes.animation,
    trace: [0.663, 0.657, 0.646, 0.655, 0.583, 1, 0.633, 0.735],
    color: colors[6]
  },
  /* r8 */
  {
    rId: 8,
    rType: rTypes.animation,
    trace: [0.879, 0.883, 0.876, 0.886, 0.833, 0.735, 0.878, 1],
    color: colors[7]
  }
];

const armsLocked = [
  {
    rId: 1,
    rType: rTypes.video,
    color: colors[0],
    trace: [1, 0.812, 0.816, 0.669, 0.642, 0.802, 0.687, 0.789]
  },
  {
    rId: 3,
    rType: rTypes.video,
    color: colors[1],
    trace: [0.816, 0.834, 1, 0.803, 0.798, 0.811, 0.582, 0.811]
  },
  {
    rId: 5,
    rType: rTypes.video,
    color: colors[2],
    trace: [0.642, 0.676, 0.798, 0.899, 1, 0.732, 0.449, 0.791]
  },
  {
    rId: 7,
    rType: rTypes.video,
    color: colors[3],
    trace: [0.687, 0.553, 0.582, 0.435, 0.449, 0.538, 1, 0.543]
  },

  {
    rId: 2,
    rType: rTypes.animation,
    color: colors[4],
    trace: [0.812, 1, 0.834, 0.681, 0.676, 0.816, 0.553, 0.838]
  },
  {
    rId: 4,
    rType: rTypes.animation,
    color: colors[5],
    trace: [0.669, 0.681, 0.803, 1, 0.899, 0.798, 0.435, 0.824]
  },
  {
    rId: 6,
    rType: rTypes.animation,
    color: colors[6],
    trace: [0.802, 0.816, 0.811, 0.798, 0.732, 1, 0.538, 0.788]
  },
  {
    rId: 8,
    rType: rTypes.animation,
    color: colors[7],
    trace: [0.789, 0.838, 0.811, 0.824, 0.791, 0.788, 0.543, 1]
  }
];

const annotation = (text, y) => ({
  showarrow: false,
  text: `<i>${text}</i>`,
  align: 'right',
  x: 1,
  xref: 'paper',
  xanchor: 'right',
  y,
  yanchor: 'bottom',
  xshift: 70,
  yshift: -50,
  font: {
    color: 'black',
    size: 14
  }
});

const traceAvgPerRater = (agreements, theme) => {
  const getY = rtype => {
    return agreements
      .filter(agreement => agreement.rType === rtype)
      .map(agreement => {
        let sum;
        if (agreement.rType === rTypes.animation) {
          sum = agreement.trace
            .filter((t, tIdx) => tIdx % 2 === 0)
            .reduce((a, b) => a + b, 0);
        } else {
          sum = agreement.trace
            .filter((t, tIdx) => tIdx % 2 !== 0)
            .reduce((a, b) => a + b, 0);
        }
        return (sum / (agreement.trace.length / 2) || 0).toFixed(3);
      });
  };
  const yAnimation = getY(rTypes.animation);
  const yVideo = getY(rTypes.video);

  const groupNames = ['Animation raters', 'Video raters'];
  return [yAnimation, yVideo].map((y, groupIdx) => {
    return {
      x: [
        [...yAnimation.map(_ => groupNames[groupIdx])],
        x.slice(groupIdx * 4, 4 * groupIdx + 4)
      ],
      text: y.map(v => `κ = ${v}`),
      y,
      name: groupNames[groupIdx],
      textfont: {
        family: 'Helvetica',
        size: 20,
        color: y.map(v => (v === 1 ? '#000' : '#fff'))
      },
      type: 'bar',
      // width: y.map((v) => v === 1 ? 0.01 : 0.15),
      // bargap: 0.1,
      marker: {
        // opacity: y.map((v) => v === 1 ? 0.5 : 1),
        color: y.map(a => {
          if (a >= 0.8) {
            return theme.palette.success.main;
          }
          if (a >= 0.6) {
            return theme.palette.info.main;
          }
          return theme.palette.warning.main;
        }),
        line: {
          width: 1,
          color: '#000000'
        }
      }
    };
  });
};

export const Stats = () => {
  const annotationParameter = useSelector(selectSelectedAnnotationParameter);
  const theme = useTheme();
  let traces = [];
  let parameterName;
  let agreements;
  let title;

  parameterName = annotationParameter;
  agreements = bodyWeight;

  if (annotationParameter === annotationParameters.armsLocked) {
    agreements = armsLocked;
  }

  // agreements.forEach((p, i) => {
  //   traces.push(trace(p, i));
  // });
  // title = `Agreement on <i>${parameterName}</i>`;

  traces = traceAvgPerRater(agreements, theme);
  title = `Average cross-group inter-rater agreements on <i>${parameterName}</i>`;

  const agreementsCounts = {
    'Almost perfect': 0,
    Substantial: 0,
    Moderate: 0,
    ZRest: 0
  };
  agreements
    .filter(p => p.rId % 2 !== 0)
    .forEach(p => {
      p.trace
        .filter((k, i) => (i + 1) % 2 === 0)
        .forEach(k => {
          if (k === 1) return;
          if (k >= 0.8) {
            agreementsCounts['Almost perfect']++;
            return;
          }
          if (k >= 0.6) {
            agreementsCounts['Substantial']++;
            return;
          }
          if (k >= 0.4) {
            agreementsCounts['Moderate']++;
            return;
          }
          agreementsCounts['Rest']++;
        });
    });

  return (
    <DefaultTemplate>
      <Grid container spacing={2} sx={{height: '100%'}}>
        <Grid item xs={12}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              position: 'relative',
              '& .infolayer': {
                // transform: 'translate(-14px, 0px)'
              },
              '& .main-svg, & .svg-container, & .js-plotly-plot, & .plot-container, & #scene':
                {
                  height: '100% !important',
                  width: '100% !important'
                },
              '& #scene': {
                // top: 0 + ' !important',
                // left: 0 + ' !important'
              },
              '& .main-svg': {
                borderRadius: `${theme.shape.borderRadius}px`
              }
            }}>
            <Plot
              data={traces}
              config={{responsive: true}}
              layout={{
                title: title ? title : '',
                barmode: 'group',
                showlegend: false,
                coloraxis: {
                  colorscale: 'Viridis'
                },
                xaxis: {
                  title: 'Rater',
                  showdividers: true,
                  tickfont: {
                    family: 'Helvetica',
                    size: 16,
                    color: 'black'
                  },
                  titlefont: {
                    family: 'Helvetica',
                    size: 18,
                    color: 'black'
                  }
                },
                yaxis: {
                  title: "Cohen's kappa (κ)",
                  showgrid: true,
                  zeroline: true,
                  showline: true,
                  tickfont: {
                    family: 'Helvetica',
                    size: 16,
                    color: 'black'
                  },
                  titlefont: {
                    family: 'Helvetica',
                    size: 18,
                    color: 'black'
                  }
                },
                shapes: [
                  ...coefficients.map(c => ({
                    type: 'line',
                    xref: 'paper',
                    x0: 0,
                    y0: c,
                    x1: 1,
                    // yref: 'paper',
                    y1: c,
                    line: {
                      color: '#444',
                      width: 1.5,
                      dash: 'dot'
                    }
                  }))
                ],
                annotations: [
                  ...['Slight', 'Fair', 'Moderate', 'Substantial'].map((c, i) =>
                    annotation(c, coefficients[i])
                  ),
                  annotation('Almost<br>perfect', 1)
                ]
              }}
            />
          </Box>
        </Grid>
        {/*<Grid item xs={6}>*/}

        {/*</Grid>*/}
      </Grid>
    </DefaultTemplate>
  );
};

export default Stats;
