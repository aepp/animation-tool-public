import React, {useEffect, useRef} from 'react';
import {Box, Fade, useTheme} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectEstimationVideoOriginalDimensions,
  selectEstimationVideoPreviewDimensions,
  selectIsEstimationVideoPlaying,
  selectEstimationVideoUrl,
  selectIsModelWarmingUp
} from '../../reducers';
import VideoButton from '../../components/VideoButton';
import {
  endEstimationVideo,
  setEstimationVideoOriginalDimensions,
  setEstimationVideoPreviewDimensions,
  updateEstimationVideoCurrentTime,
  updateEstimationVideoTotalTime
} from '../../actions/estimationPlayback';
import {useWindowSize} from '../../../../modules/App/hooks/useWindowSize';
export const VIDEO_ELEMENT_ID_ORIGINAL = 'original-video';
export const VIDEO_ELEMENT_ID_PREVIEW = 'preview-video';

export const EstimationVideo = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {width, height} = useWindowSize();

  const rootRef = useRef();
  const videoRefOriginal = useRef();
  const videoRefPreview = useRef();

  const previewVideoDimensions = useSelector(
    selectEstimationVideoPreviewDimensions
  );
  const originalVideoDimensions = useSelector(
    selectEstimationVideoOriginalDimensions
  );
  const estimationVideoUrl = useSelector(selectEstimationVideoUrl);
  const isPlaying = useSelector(selectIsEstimationVideoPlaying);
  const isModelWarmingUp = useSelector(selectIsModelWarmingUp);

  useEffect(() => {
    if (videoRefPreview.current) {
      if (
        isPlaying &&
        (videoRefPreview.current.paused || !videoRefPreview.current.currentTime)
      ) {
        videoRefOriginal.current.play();
        videoRefPreview.current.play();
      } else {
        videoRefOriginal.current.pause();
        videoRefPreview.current.pause();
      }
    }
  }, [isPlaying, videoRefOriginal, videoRefPreview]);

  useEffect(() => {
    if (rootRef && rootRef.current) {
      dispatch(
        setEstimationVideoPreviewDimensions({
          width: rootRef.current.offsetWidth,
          height: rootRef.current.offsetHeight
        })
      );
    }
  }, [width, height, rootRef, dispatch, estimationVideoUrl]);

  if (!estimationVideoUrl) return <React.Fragment />;

  return (
    <Box
      ref={rootRef}
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderTopLeftRadius: `${theme.shape.borderRadius}px`,
        borderBottomLeftRadius: `${theme.shape.borderRadius}px`
      }}>
      <Box sx={{position: 'relative'}}>
        {videoRefOriginal && videoRefOriginal.current && (
          <VideoButton videoElementOriginal={videoRefOriginal.current} />
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
          id={VIDEO_ELEMENT_ID_PREVIEW}
          onLoadedMetadata={e =>
            dispatch(updateEstimationVideoTotalTime(e.target.duration))
          }
          onTimeUpdate={e => {
            const previewVideo = e.target;
            if (
              previewVideo &&
              previewVideo.currentTime > 0 &&
              !previewVideo.paused &&
              !previewVideo.ended &&
              previewVideo.readyState > 2
            ) {
              dispatch(
                updateEstimationVideoCurrentTime(previewVideo.currentTime)
              );
            }
          }}>
          <source src={estimationVideoUrl} type='video/mp4' />
        </video>
      </Box>
      <video
        style={{visibility: 'hidden', zIndex: -1}}
        {...originalVideoDimensions}
        ref={videoRefOriginal}
        id={VIDEO_ELEMENT_ID_ORIGINAL}
        onLoadedMetadata={e => {
          dispatch(
            setEstimationVideoOriginalDimensions({
              width: e.target.offsetWidth,
              height: e.target.offsetHeight
            })
          );
        }}
        onEnded={() => dispatch(endEstimationVideo())}
        muted>
        <source src={estimationVideoUrl} type='video/mp4' />
      </video>
    </Box>
  );
};

export default EstimationVideo;
