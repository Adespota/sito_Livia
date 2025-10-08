import CircularProgress from "@mui/material/CircularProgress";
import React from "react";



export const LoadingSpinner = ({ spinnerText  }) => (
    <div className="flex flex-col items-center justify-center w-full min-h-screen fixed inset-0 z-50 bg-gray-600 bg-opacity-50 backdrop-blur-sm">
        <CircularProgress
            size={38}
            thickness={6}
            sx={{
                color: "#4a58a7",
                '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                },
            }}
        />
        <p>{spinnerText}</p>
    </div>
);
