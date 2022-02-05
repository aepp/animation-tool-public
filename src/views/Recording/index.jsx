import React, {useEffect, useRef, useState} from 'react';
import {
  Box,
  Button,
  Fade,
  Grid,
  LinearProgress,
  Typography,
  useTheme
} from '@mui/material';
import {FileDownload as FileDownloadIcon} from '@mui/icons-material';
import {useDispatch, useSelector} from 'react-redux';
// import * as tf from '@tensorflow/tfjs-core';
// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-webgl';
import videoSrc from '../../demoData/video/choreo1.mp4';
import {useContentStyle} from '../../modules/App/hooks/useContentStyle';
import {DOWNLOAD_DETECTION_RESULTS, VIDEO_PLAYBACK_END} from './actions';
import {selectDetectionStatus, selectIsModelWarmingUp} from './reducers';
import VideoButton from './components/VideoButton';
import {useWindowSize} from '../../modules/App/hooks/useWindowSize';

export const RecordingContent = () => {
  const {width, height} = useWindowSize();
  const contentStyle = useContentStyle();
  const theme = useTheme();

  const videoRefPreview = useRef();
  const videoRefOriginal = useRef();
  const boxRef = useRef();
  const gridItemRef = useRef();
  const [previewVideoDimensions, setPreviewVideoDimensions] = useState({});
  const [originalVideoDimensions, setOriginalVideoDimensions] = useState({});

  const dispatch = useDispatch();
  const isModelWarmingUp = useSelector(selectIsModelWarmingUp);
  const {hasDetectionStarted, isDetecting} = useSelector(selectDetectionStatus);

  useEffect(() => {
    if (gridItemRef && boxRef && gridItemRef.current && boxRef.current) {
      setPreviewVideoDimensions({
        width: gridItemRef.current.offsetWidth,
        height: boxRef.current.offsetHeight
      });
    }
  }, [width, height, gridItemRef, boxRef]);

  return (
    <Box sx={{...contentStyle, width: '100%', overflow: 'hidden'}} ref={boxRef}>
      <Grid container>
        <Grid xs={12} md={6} ref={gridItemRef} item>
          <Box sx={{position: 'relative'}}>
            {videoRefOriginal && videoRefOriginal.current && (
              <VideoButton
                videoElementPreview={videoRefPreview.current}
                videoElementOriginal={videoRefOriginal.current}
              />
            )}
            <Fade in={isModelWarmingUp}>
              <Box
                left={0}
                top={0}
                width={'100%'}
                height={'100%'}
                position={'absolute'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                zIndex={1}
                backgroundColor={theme.palette.secondary.light}
              />
            </Fade>
            <video
              ref={videoRefPreview}
              {...previewVideoDimensions}
              id={'preview-video'}
              onLoadedMetadata={() => {
                setPreviewVideoDimensions({
                  width: gridItemRef.current.offsetWidth,
                  height: boxRef.current.offsetHeight
                });
              }}
            >
              <source src={videoSrc} type='video/mp4' />
            </video>
          </Box>
          <video
            style={{visibility: 'hidden', zIndex: -1}}
            {...originalVideoDimensions}
            ref={videoRefOriginal}
            id={'original-video'}
            onLoadedMetadata={() => {
              setOriginalVideoDimensions({
                width: videoRefOriginal.current.offsetWidth,
                height: videoRefOriginal.current.offsetHeight
              });
              videoRefOriginal.current.style.display = 'none';
            }}
            onEnded={() =>
              dispatch({
                type: VIDEO_PLAYBACK_END
              })
            }
            muted
          >
            <source src={videoSrc} type='video/mp4' />
          </video>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            padding: 2,
            borderLeft: `solid 1px ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          {hasDetectionStarted && (
            <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
              <Typography>Detection progress</Typography>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Box sx={{width: '100%', mr: 1}}>
                  <LinearProgress
                    color={'primary'}
                    variant={'determinate'}
                    value={
                      (videoRefPreview.current.currentTime * 100) /
                      videoRefPreview.current.duration
                    }
                  />
                </Box>
                <Box sx={{minWidth: 35}}>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                  >{`${Math.round(
                    (videoRefPreview.current.currentTime * 100) /
                      videoRefPreview.current.duration
                  )}%`}</Typography>
                </Box>
              </Box>
            </Box>
          )}
          {hasDetectionStarted && (
            <Button
              color={'secondary'}
              variant={'contained'}
              disabled={isDetecting}
              sx={{mt: 2}}
              onClick={() => dispatch({type: DOWNLOAD_DETECTION_RESULTS})}
              startIcon={
                <FileDownloadIcon
                  color={isDetecting ? 'disabled' : 'primary'}
                />
              }
            >
              {!isDetecting ? 'Download results' : 'Detecting poses...'}
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecordingContent;
