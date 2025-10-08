import {TypeAnimation} from "react-type-animation";

export default function TextAnimation  ({ sequences })  {
    return (
        <TypeAnimation
            sequence={sequences}
            wrapper="span"
            speed={50}
            className="sm:text-[3rem] text-[2rem] text-myColor-colorTextOnDefaultColor leading-tight flex h-24 sm:h-28"
            repeat={Infinity}
        />
    );
};
