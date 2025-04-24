import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const LogoutIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-9H5c-1.1 0-2 .9-2 2v6h2V6h14v12H5v-4H3v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
  </SvgIcon>
);

export default LogoutIcon;
