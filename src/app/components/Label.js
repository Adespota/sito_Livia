

export default function Label({textLabel, className}) {
    return (
        <div className={`inline-block bg-[#c9cff1] rounded-[10px] px-2.5 ${className}`}>
            <p className="text-myColor-default text-[0.88rem] font-semibold">
                {textLabel}
            </p>
        </div>
    );
}
