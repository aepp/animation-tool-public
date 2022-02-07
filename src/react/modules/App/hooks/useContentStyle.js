import {useSelector} from 'react-redux';
import {APP_BAR_HEIGHT} from '../../../../constants';
import {selectWithAppBar} from '../reducers';

export const useContentStyle = () => {
  const withAppBar = useSelector(selectWithAppBar);
  if (withAppBar)
    return {
      height: `calc(100vh - ${APP_BAR_HEIGHT}px)`
    };
  return {height: '100vh'};
};
