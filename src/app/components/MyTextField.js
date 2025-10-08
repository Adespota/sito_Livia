import { styled, TextField } from "@mui/material";



const MyTextField = styled(TextField, { shouldForwardProp: (prop) => prop !== "dynamicColor",})(({ dynamicColor }) => ({
    width: "100%",
    "& label.Mui-focused": {
        color: "#4a58a7",
    },
    "& .MuiInputLabel-root": {
        fontSize: "0.79rem",
    },
    "& .MuiOutlinedInput-root": {
        borderRadius: 6,
        paddingTop: 3,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        "& fieldset": {
            borderColor: "#CBD5E1",
        },
        "&:hover fieldset": {
            borderColor: "#4a58a7",
        },
        "&.Mui-focused fieldset": {
            borderColor:  "#4a58a7",
        },
        "& .MuiOutlinedInput-input": {
            color: "#3a4246",
            fontSize: "0.82rem",
            lineHeight: "1.61rem",
            fontFamily: 'Roboto, Arial, sans-serif',
            fontWeight: 500,
            letterSpacing: ".03rem",
        },

    },
}));

export default MyTextField;
