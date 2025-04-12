import React from 'react';
import { Box, Typography } from '@mui/material';

interface StyledProps {
  color?: string;
  size?: number;
}

export const WarehouseMap: React.FC = () => {
  return (
    <Box
      sx={{
        width: 3259,
        height: 4151,
        position: 'relative',
        bgcolor: 'white',
        overflow: 'hidden',
      }}
    >
      {/* Main Pathways */}
      <Box sx={{ width: 904, height: 160, left: 0, top: 1532, position: 'absolute', bgcolor: '#D9D9D9' }} />
      <Box sx={{ width: 928.32, height: 160, left: 1195, top: 2891.32, position: 'absolute', transform: 'rotate(-90deg)', transformOrigin: 'top left', bgcolor: '#D9D9D9' }} />
      
      {/* Blue Sections */}
      <Box sx={{ width: 464.16, height: 100, left: 804, top: 1616.16, position: 'absolute', transform: 'rotate(-90deg)', transformOrigin: 'top left', bgcolor: '#0B88FD' }} />
      <Box sx={{ width: 348.12, height: 50, left: 646, top: 1500.12, position: 'absolute', transform: 'rotate(-90deg)', transformOrigin: 'top left', bgcolor: '#0B88FD' }} />
      
      {/* Large Rotated Section */}
      <Box sx={{ width: 3713.29, height: 535, left: 0, top: 5405.29, position: 'absolute', transform: 'rotate(-90deg)', transformOrigin: 'top left', bgcolor: '#D9D9D9' }} />
      
      {/* White Sections */}
      <Box sx={{ width: 60, height: 8, left: 626, top: 50, position: 'absolute', bgcolor: 'white' }} />
      <Box sx={{ width: 142, height: 188, left: 1588, top: 0, position: 'absolute', bgcolor: 'white' }} />
      <Box sx={{ width: 626, height: 16, left: 0, top: 172, position: 'absolute', bgcolor: 'white' }} />
      <Box sx={{ width: 902, height: 16, left: 686, top: 173, position: 'absolute', bgcolor: 'white' }} />
      <Box sx={{ width: 1412, height: 265, left: 0, top: 173, position: 'absolute', bgcolor: 'white' }} />
      <Box sx={{ width: 505, height: 64, left: 1225, top: 173, position: 'absolute', bgcolor: 'white' }} />
      
      {/* Orange Section */}
      <Box sx={{ width: 804, height: 25, left: 0, top: 1346, position: 'absolute', bgcolor: '#F6530D' }} />
      
      {/* Storage Sections (Red) */}
      <Box sx={{ width: 395, height: 110, left: 686, top: 2, position: 'absolute', bgcolor: 'rgba(147, 23, 23, 0.8)' }} />
      <Box sx={{ width: 395, height: 110, left: 291, top: 2, position: 'absolute', bgcolor: 'rgba(147, 23, 23, 0.8)' }} />
      <Box sx={{ width: 395, height: 110, left: -104, top: 2, position: 'absolute', bgcolor: 'rgba(147, 23, 23, 0.8)' }} />
      <Box sx={{ width: 376, height: 110, left: 1081, top: 2, position: 'absolute', bgcolor: 'rgba(147, 23, 23, 0.8)' }} />
      <Box sx={{ width: 395, height: 110, left: 1457, top: 2, position: 'absolute', bgcolor: 'rgba(147, 23, 23, 0.8)' }} />
      
      {/* Large Storage Sections */}
      {[
        { left: 1457, top: 112 }, { left: 1062, top: 112 },
        { left: 1062, top: 507 }, { left: 667, top: 507 },
        { left: 272, top: 507 }, { left: -123, top: 507 },
        { left: 1062, top: 902 }, { left: 667, top: 902 },
        { left: 272, top: 902 }, { left: -123, top: 902 },
        { left: 667, top: 112 }, { left: 272, top: 112 },
        { left: -123, top: 112 }
      ].map((pos, index) => (
        <Box
          key={index}
          sx={{
            width: 395,
            height: 395,
            left: pos.left,
            top: pos.top,
            position: 'absolute',
            bgcolor: 'rgba(147, 23, 23, 0.8)',
          }}
        />
      ))}

      {/* Green Sections with Numbers */}
      <Box
        sx={{ 
          width: 580, 
          height: 72.12, 
          left: 70, 
          top: 282, 
          position: 'absolute', 
          bgcolor: '#0BF51B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }} 
      >
        <Typography sx={{ color: 'black', fontSize: 24, fontFamily: 'Inter', fontWeight: 400 }}>
          04
        </Typography>
      </Box>
      <Box sx={{ width: 580, height: 7.21, left: 70, top: 315.17, position: 'absolute', bgcolor: 'black' }} />
      
      {/* Numbers */}
      <Typography sx={{ width: 31, height: 22, left: 496, top: 286, position: 'absolute', color: 'black', fontSize: 24, fontFamily: 'Inter', fontWeight: 400 }}>04</Typography>
      <Typography sx={{ width: 26, height: 28, left: 496, top: 326, position: 'absolute', color: 'black', fontSize: 24, fontFamily: 'Inter', fontWeight: 400 }}>12</Typography>

      {/* Gray Sections */}
      <Box sx={{ width: 1100, height: 112, left: 0, top: 479, position: 'absolute', bgcolor: '#D9D9D9' }} />
      <Box sx={{ width: 1100, height: 113, left: 1, top: 568, position: 'absolute', bgcolor: '#D9D9D9' }} />
      
      {/* Blue Storage Areas with White Centers */}
      {[0, 1, 2, 3].map((index) => (
        <React.Fragment key={`blue-${index}`}>
          <Box sx={{ width: 138, height: 113, left: 1 + index * 143, top: 593, position: 'absolute', bgcolor: '#170D76' }} />
          <Box sx={{ width: 110, height: 97, left: 15 + index * 143, top: 609, position: 'absolute', bgcolor: 'white' }} />
        </React.Fragment>
      ))}

      {/* Black Bar */}
      <Box sx={{ width: 1100, height: 25, left: 0, top: 568, position: 'absolute', bgcolor: 'black' }} />
      
      {/* Number 10 */}
      <Typography sx={{ left: 495, top: 491, position: 'absolute', color: 'black', fontSize: 24, fontFamily: 'Inter', fontWeight: 400 }}>10<br/></Typography>

      {/* Green Top Sections */}
      <Box sx={{ width: 686, height: 75, left: 0, top: 0, position: 'absolute', bgcolor: '#0BF51B' }} />
      <Box sx={{ width: 60, height: 60, left: 626, top: 58, position: 'absolute', bgcolor: '#0BF51B' }} />
      <Box sx={{ width: 60, height: 60, left: 626, top: 128, position: 'absolute', bgcolor: '#0BF51B' }} />
      <Box sx={{ width: 539, height: 80, left: 0, top: 137, position: 'absolute', bgcolor: '#0BF51B' }} />
      
      {/* Black Lines */}
      <Box sx={{ width: 539, height: 7.82, left: 0, top: 173.65, position: 'absolute', bgcolor: 'black' }} />
      <Box sx={{ width: 361, height: 5.86, left: 750, top: 311.81, position: 'absolute', bgcolor: 'black' }} />

      {/* Numbers 01-03 */}
      <Typography sx={{ left: 504, top: 25, position: 'absolute', color: 'black', fontSize: 24, fontFamily: 'Inter', fontWeight: 400 }}>01</Typography>
      <Typography sx={{ width: 30, height: 45.35, left: 496, top: 143, position: 'absolute', color: 'black', fontSize: 24, fontFamily: 'Inter', fontWeight: 400 }}>02</Typography>
      <Typography sx={{ width: 31, height: 29, left: 495, top: 188, position: 'absolute', color: 'black', fontSize: 24, fontFamily: 'Inter', fontWeight: 400 }}>03</Typography>

      {/* Additional Green Section */}
      <Box sx={{ width: 413, height: 75, left: 750, top: 282, position: 'absolute', bgcolor: '#0BF51B' }} />
      
      {/* White Rectangle */}
      <Box sx={{ width: 86, height: 24.61, left: 1077, top: 301.78, position: 'absolute', bgcolor: 'white' }} />
      
      {/* Numbers 6-7 */}
      <Typography sx={{ width: 14, height: 33, left: 758, top: 324, position: 'absolute', color: 'black', fontSize: 24, fontFamily: 'Inter', fontWeight: 400 }}>7</Typography>
      <Typography sx={{ width: 15, height: 33, left: 758, top: 286, position: 'absolute', color: 'black', fontSize: 24, fontFamily: 'Inter', fontWeight: 400 }}>6</Typography>

      {/* Circle and Vertical Bars */}
      <Box sx={{ width: 50, height: 50, left: 723, top: 193, position: 'absolute', bgcolor: '#D9D9D9', borderRadius: '9999px' }} />
      <Box sx={{ width: 45, height: 221, left: 1412, top: 236, position: 'absolute', bgcolor: '#D9D9D9' }} />
      <Box sx={{ width: 45, height: 455, left: 1730, top: 2, position: 'absolute', bgcolor: '#D9D9D9' }} />
      
      {/* DALPAK Title */}
      <Typography sx={{ left: 889, top: 58, position: 'absolute', color: 'black', fontSize: 48, fontFamily: 'Inter', fontWeight: 400 }}>DALPAK</Typography>

      {/* Additional Vertical Bars */}
      <Box sx={{ width: 45, height: 677, left: 2299, top: 1346, position: 'absolute', bgcolor: '#D9D9D9' }} />
      <Box sx={{ width: 45, height: 138, left: 1667, top: 913, position: 'absolute', bgcolor: '#D9D9D9' }} />

      {/* Packaging Machine Area */}
      <Box sx={{ width: 150, height: 150, left: 2135, top: 1440, position: 'absolute', bgcolor: '#D9D9D9', borderRadius: '9999px' }} />
      <Box sx={{ width: 80, height: 110, left: 2170, top: 1371, position: 'absolute', bgcolor: '#D9D9D9' }} />
      <Typography sx={{ left: 2156, top: 1481, position: 'absolute', color: 'black', fontSize: 24, fontFamily: 'Inter', fontWeight: 400 }}>packaging    machine</Typography>
    </Box>
  );
};

export default WarehouseMap; 