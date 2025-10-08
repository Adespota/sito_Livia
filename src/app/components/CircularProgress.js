import React, { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function CircularProgressWithTimer() {
    const [progress, setProgress] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, 800);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                size={100}
                variant="determinate"
                value={progress}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.red">
                    {`${Math.round(progress)}%`}
                </Typography>
            </Box>
        </Box>
    );
}