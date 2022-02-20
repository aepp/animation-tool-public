import {useSelector} from 'react-redux';
import {APP_BAR_HEIGHT} from '../../../../config/constants';
import {selectIsStandalone} from '../reducers';

export const useContentStyle = () => {
  const isStandalone = useSelector(selectIsStandalone);
  if (isStandalone)
    return {
      height: `calc(100% - ${APP_BAR_HEIGHT}px)`
    };
  return {height: '100%'};
};
