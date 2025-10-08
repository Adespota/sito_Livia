import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';


const MyTextField = styled(TextField)(({ theme, }) => ({
    width: '100%',
    '& label.Mui-focused': {
        color: '#007E85', // Usa il colore dinamico se disponibile
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: 6,
        '& fieldset': {
            borderColor: '#CBD5E1',
        },
        '&:hover fieldset': {
            borderColor: '#007E85', // Colore del bordo al passaggio del mouse
        },
        '&.Mui-focused fieldset': {
            borderColor: '#007E85', // Colore del bordo al passaggio del mouse
        },
        '& .MuiOutlinedInput-input': {
            color: '#3a4246',
            fontSize: '1.150rem',
            lineHeight: '1.75rem',
            fontWeight: 400,
            letterSpacing: '.03rem',
        },
    },
}));

export default function ChooseInput({ options, onChange, value, label }) {

    return (
        <Autocomplete
            id=""
            sx={{ width: '100%' }}
            options={options}
            autoHighlight
            onChange={(event, newValue) => {
                if (onChange) {
                    onChange(newValue);
                }
            }}
            value={value}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => {


                return (
                    <Box
                        component="li"
                        sx={{ '& > span': { mr: 2, flexShrink: 0 } }}
                        {...props}
                    >
                        <span
                            style={{
                                display: 'inline-block',
                                width: '32px',
                                height: '26px',
                                borderRadius: '9px',
                                backgroundColor: '#ccc',
                                marginRight: '12px',
                            }}
                        ></span>
                        {option.label}
                    </Box>
                );
            }}
            renderInput={(params) => (
                <MyTextField
                    {...params}
                    label={label}
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password',
                    }}
                />
            )}
        />
    );
}
