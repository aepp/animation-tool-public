import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Box, useTheme} from '@mui/material';
import Plot from 'react-plotly.js';
// import {
//   Chart as ChartJS,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend
// } from 'chart.js';
// // import {Scatter} from 'react-chartjs-2';

import {selectDataSet} from './reducers';
import {selectIsAnimationInitialized} from '../Animation/reducers';
import {PRIMARY_COLOR, SECONDARY_COLOR} from '../../../../theme/constants';
import {DataSourceType} from '../../../../../constants';

// ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export const options = {
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

export const DataSet = () => {
  const theme = useTheme();
  const isInitialized = useSelector(selectIsAnimationInitialized);

  /**
   * @type {PreProcessedDataSet}
   */
  const dataSet = useSelector(selectDataSet);

  const [points, setPoints] = useState({x: [], y: []});
  // const [vectors, setVectors] = useState([]);
  const [plotType, setPlotType] = useState('scatter3d');

  useEffect(() => {
    if (isInitialized) {
      const x = [];
      const y = [];
      const z = [];
      // const vectors = [];
      dataSet.framesPerPerson.forEach(frame =>
        frame.forEach(person =>
          person.keyPoints.forEach(point => {
            x.push(point.x);
            y.push(point.y);
            z.push(point.z);
            // vectors.push(point);
          })
        )
      );
      if (dataSet.dataSource === DataSourceType.DATA_SOURCE_TF) {
        setPoints({x, y});
        // setVectors(vectors);
        setPlotType('scattergl');
      } else {
        setPoints({x, y, z});
        setPlotType('scatter3d');
        // setVectors(vectors);
      }
    }
  }, [dataSet, isInitialized]);

  if (!isInitialized) return '';
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        '& .main-svg, & .svg-container, & .js-plotly-plot, & .plot-container, & #scene':
          {
            height: '100% !important',
            width: '100% !important'
          },
        '& #scene': {
          top: 0 + ' !important',
          left: 0 + ' !important'
        },
        '& .main-svg': {
          borderRadius: `${theme.shape.borderRadius}px`
        }
      }}
    >
      {/*<Scatter*/}
      {/*  options={options}*/}
      {/*  type={'scatter'}*/}
      {/*  data={{*/}
      {/*    datasets: [*/}
      {/*      {*/}
      {/*        label: 'A dataset',*/}
      {/*        data: vectors,*/}
      {/*        backgroundColor: 'rgba(255, 99, 132, 1)'*/}
      {/*      }*/}
      {/*    ]*/}
      {/*  }}*/}
      {/*/>*/}
      <Plot
        data={[
          {
            ...points,
            type: plotType,
            mode: 'markers',
            marker: {
              color: PRIMARY_COLOR,
              opacity: 0.5,
              line: {
                color: SECONDARY_COLOR,
                width: 1,
                opacity: 0.5
              },
              size: 4
            }
          }
        ]}
        onSelected={data => console.log(data)}
        config={{responsive: true}}
        // layout={ {width: '100%', height: '100%', title: 'A Fancy Plot'} }
      />
    </Box>
  );
};
