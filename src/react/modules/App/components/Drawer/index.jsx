import React from 'react';
import {NavLink} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemSecondaryAction,
  Typography,
  useTheme
} from '@mui/material';
import {
  OndemandVideoRounded as VideoIcon,
  DirectionsRunRounded as AnimationIcon,
  DescriptionRounded as DescriptionIcon,
  PreviewRounded as PreviewIcon,
  ArrowRight as ArrowRightIcon
} from '@mui/icons-material';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub} from '@fortawesome/free-brands-svg-icons';

import vitIconRaw from '../../../../../demoData/vit/favicon.ico';

import {selectIsDrawerOpen} from '../../reducers';
import {setDrawerState} from '../../actions';
import DrawerItem from '../DrawerItem';
import routes from '../../../../routes';
import {APP_BAR_HEIGHT} from '../../../../../config/constants';

export const AppDrawer = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  // const isInitialized = useSelector(selectIsAnimationInitialized);
  const isDrawerOpen = useSelector(selectIsDrawerOpen);
  return (
    <Drawer
      anchor={'left'}
      open={isDrawerOpen}
      onClose={() => dispatch(setDrawerState(false))}>
      <Box paddingX={2}>
        <Typography
          variant={'h4'}
          height={APP_BAR_HEIGHT}
          alignItems={'center'}
          justifyContent={'center'}
          display={'flex'}
          color={theme.palette.text.secondary}>
          Discover&nbsp;<b>Animation Tool</b>
        </Typography>
        <Divider sx={{marginBottom: 2}} />
        <nav aria-label='Animation tool menu'>
          <List>
            <DrawerItem
              primary={'Animate dataset'}
              secondary={
                <>
                  generated by <b>LearningHub</b> or <b>Tensor flow</b>
                </>
              }
              icon={<AnimationIcon />}
              component={NavLink}
              componentProps={{
                to: routes.root
              }}
            />
            <DrawerItem
              primary={'Generate dataset'}
              secondary={
                <>
                  from an <b>mp4</b> video file
                </>
              }
              icon={<VideoIcon />}
              component={NavLink}
              componentProps={{
                to: routes.estimate
              }}
            />
            <Divider component={'li'} sx={{my: 1}} />
            <DrawerItem
              primary={'API Reference'}
              secondary={
                <>
                  auto generated by <b>jsdoc</b>
                </>
              }
              icon={<DescriptionIcon />}
              component={'a'}
              componentProps={{
                href: routes.external.docs,
                target: '_blank'
              }}
            />
            <DrawerItem
              primary={'Integration demo'}
              secondary={
                <span
                  style={{
                    whiteSpace: 'pre',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                  via <b>UMD</b> in{' '}
                  <img src={vitIconRaw} alt={'Visual Inspection Tool icon'} />
                  &nbsp;
                  <b>Visual Inspection Tool</b>
                </span>
              }
              icon={<PreviewIcon />}
              component={'a'}
              componentProps={{
                href: routes.external.demo,
                target: '_blank'
              }}
              secondaryAction={
                <ListItemSecondaryAction>
                  <IconButton
                    size='large'
                    sx={{
                      '& svg': {
                        color: 'secondary',
                        transition: '0.2s',
                        transform: 'translateX(0) rotate(0)'
                      },
                      '&:hover, &:focus': {
                        bgcolor: 'unset',
                        '& svg:first-of-type': {
                          transform: 'translateX(-4px) rotate(-20deg)'
                        },
                        '& svg:last-of-type': {
                          right: 0,
                          opacity: 1
                        }
                      },
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        height: '80%',
                        display: 'block',
                        left: 0,
                        width: '1px',
                        bgcolor: 'divider'
                      }
                    }}
                    component={'a'}
                    href={'https://github.com/dimstudio/visual-inspection-tool'}
                    target={'_blank'}>
                    <FontAwesomeIcon icon={faGithub} />
                    <ArrowRightIcon
                      sx={{position: 'absolute', right: 4, opacity: 0}}
                    />
                  </IconButton>
                </ListItemSecondaryAction>
              }
            />
          </List>
        </nav>
      </Box>
    </Drawer>
  );
};

export default AppDrawer;
