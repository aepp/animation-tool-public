import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Plot from 'react-plotly.js';
import {
  selectCurrentFrameIdx,
  selectIsAnimationInitialized
} from '../../../Animation/reducers';
import {selectSelectedJoints} from '../../../CoordinatesChartControls/reducers';
import {
  setIsPlaying,
  updateCurrentFrameIdx,
  updateCurrentFrameIdxToThree
} from '../../../AnimationControls/actions';
import {selectIsPlaying} from '../../../AnimationControls/reducers';
import {
  selectFirstNoneEmptyFrameIdx,
  selectFrameIdsByFormattedStamps,
  selectFramesPerPerson,
  selectFrameStampsFormatted,
  selectIsUsingFrameStamps
} from '../../reducers';

export const options = {
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

export const CoordinatesPlot = () => {
  const dispatch = useDispatch();
  const isInitialized = useSelector(selectIsAnimationInitialized);

  /**
   * @type {[]}
   */
  const framesPerPerson = useSelector(selectFramesPerPerson);

  /**
   * @type {string[]}
   */
  const selectedJoints = useSelector(selectSelectedJoints);

  /**
   * @type {number}
   */
  const currentFrameIdx = useSelector(selectCurrentFrameIdx);
  /**
   * @type {string[]}
   */
  const frameStamps = useSelector(selectFrameStampsFormatted);

  /**
   * @type {boolean}
   */
  const isPlaying = useSelector(selectIsPlaying);

  /**
   * @type {object}
   */
  const frameIdsByStamps = useSelector(selectFrameIdsByFormattedStamps);
  /**
   * @type {boolean}
   */
  const isUsingFrameStamps = useSelector(selectIsUsingFrameStamps);
  /**
   * @type {boolean}
   */
  const firstNoneEmptyFrameIdx = useSelector(selectFirstNoneEmptyFrameIdx);

  const [layout] = useState({
    showlegend: true,
    title: 'Joints coordinates',
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1
    },
    xaxis: {
      title: isUsingFrameStamps ? 'Time' : 'Frame ID'
    },
    yaxis: {
      title: 'Attribute value (normalized position)'
    },
    shapes: [
      {
        type: 'line',
        x0: frameStamps[firstNoneEmptyFrameIdx],
        y0: 0,
        x1: frameStamps[firstNoneEmptyFrameIdx],
        yref: 'paper',
        y1: 1,
        line: {
          color: 'red',
          width: 1.5,
          dash: 'dot'
        }
      }
    ]
  });
  const [shapes, setShapes] = useState([]);
  const [traces, setTraces] = useState([]);
  useEffect(() => {
    if (isInitialized) {
      const tracesObj = {};
      framesPerPerson.forEach((frame, frameIdx) =>
        frame.forEach(person =>
          person.keyPoints.forEach(point => {
            const selectedComponents = selectedJoints
              .filter(j => j.name === point.name)
              .map(j => j.component);

            selectedComponents.forEach(selectedComponent => {
              tracesObj[point.name + selectedComponent] =
                tracesObj[point.name + selectedComponent] || {};
              tracesObj[point.name + selectedComponent].name =
                point.name + ' ' + selectedComponent.toUpperCase();
              tracesObj[point.name + selectedComponent].mode = 'lines+markers';
              tracesObj[point.name + selectedComponent].type = 'scattergl';
              tracesObj[point.name + selectedComponent].x =
                tracesObj[point.name + selectedComponent].x || [];
              tracesObj[point.name + selectedComponent].y =
                tracesObj[point.name + selectedComponent].y || [];
              tracesObj[point.name + selectedComponent].x.push(
                frameStamps[frameIdx]
              );
              tracesObj[point.name + selectedComponent].y.push(
                point[selectedComponent]
              );
            });
          })
        )
      );
      const data = Object.keys(tracesObj).reduce((array, trace) => {
        array.push(tracesObj[trace]);
        return array;
      }, []);
      setTraces(data);
    }
  }, [frameStamps, framesPerPerson, isInitialized, selectedJoints]);

  useEffect(() => {
    if (currentFrameIdx >= firstNoneEmptyFrameIdx) {
      setShapes([
        {
          type: 'line',
          x0: frameStamps[currentFrameIdx],
          y0: 0,
          x1: frameStamps[currentFrameIdx],
          yref: 'paper',
          y1: 1,
          line: {
            color: 'red',
            width: 1.5,
            dash: 'dot'
          }
        }
      ]);
    }
  }, [
    firstNoneEmptyFrameIdx,
    currentFrameIdx,
    frameIdsByStamps,
    frameStamps,
    setShapes
  ]);

  return (
    <Plot
      data={selectedJoints.length > 0 ? traces : []}
      // onSelected={data => console.log(data)}
      config={{responsive: true}}
      // onInitialized={(figure) => setFigure(figure)}
      // onUpdate={figure => {
      //   setLayout(figure.layout);
      //   console.log('update', figure);
      // }}
      onClick={e => {
        const newFrameIdx = frameIdsByStamps[e.points[0].x];
        let resume = false;
        if (isPlaying) {
          dispatch(setIsPlaying(false));
          resume = true;
        }
        dispatch(updateCurrentFrameIdx(newFrameIdx));
        dispatch(updateCurrentFrameIdxToThree(newFrameIdx));
        if (resume) {
          dispatch(setIsPlaying(true));
        }
      }}
      layout={{
        ...layout,
        shapes
      }}
    />
  );
};
