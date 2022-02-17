import {styled} from '@mui/material';

const Input = styled('input')({
  display: 'none'
});

export const InputFile = props => <Input type='file' {...props} />;
export default InputFile;
