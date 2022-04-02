import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Grid, Stack, Typography, useTheme} from '@mui/material';
import {
  MimeTypeLabel,
  SupportedInputFileFormat
} from '../../../config/constants';
import Animation from './modules/Animation';
import DefaultTemplate from '../../template/Default';
import {selectIsStandalone} from '../../modules/App/reducers';
import {cleanUpAnimationView} from './actions/view';
import {
  selectDataFileType,
  selectInputFileType,
  selectIsFileUploaded,
  selectIsFileUploading
} from './modules/Upload/reducers';
import Video from './modules/Video';
import {CoordinatesChart} from './modules/CoordinatesChart';
import {CoordinatesChartControls} from './modules/CoordinatesChartControls';
// import {JointsCoordinateChart} from './modules/C3Chart';

export const Visualization = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isStandalone = useSelector(selectIsStandalone);
  const dataFileType = useSelector(selectDataFileType);
  const inputFileType = useSelector(selectInputFileType);
  const isFileUploading = useSelector(selectIsFileUploading);
  const isFileUploaded = useSelector(selectIsFileUploaded);

  useEffect(() => {
    return () => dispatch(cleanUpAnimationView());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DefaultTemplate>
      <Grid sx={{height: '100%'}} container>
        <Grid
          xs={12}
          md={isStandalone ? 6 : 12}
          sx={{padding: 1, position: 'relative'}}
          item>
          {dataFileType === SupportedInputFileFormat.JSON && <Animation />}
          {dataFileType === SupportedInputFileFormat.MP4 && <Video />}
          {!isFileUploaded && (
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Typography>
                {isFileUploading
                  ? `Processing ${MimeTypeLabel[inputFileType]} `
                  : 'Upload file'}
                ...
              </Typography>
            </Box>
          )}
        </Grid>
        {isStandalone && (
          <Grid
            xs={12}
            md={6}
            sx={{
              maxHeight: '100%',
              padding: 1,
              borderLeft: `solid 1px ${theme.palette.divider}`
            }}
            item>
            <Stack direction={'column'} sx={{height: '100%'}}>
              <CoordinatesChartControls />
              <CoordinatesChart />
            </Stack>
            {/*{isFileUploaded && <JointsCoordinateChart />}*/}
          </Grid>
        )}
      </Grid>
    </DefaultTemplate>
  );
};

export default Visualization;
