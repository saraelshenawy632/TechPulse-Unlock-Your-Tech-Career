export default function Button({
    children,
    className="",
    ...props
}) {
    return (
        <button
            {...props}
            className={`
                px-7
                py-3
                rounded-xl
                bg-violet-600
                text-white
                font-semibold
                transition-all
                duration-300
                hover:bg-violet-500
                hover:scale-105
                hover:shadow-xl
                hover:shadow-violet-600/30
                ${className}
            `}
        >
            {children}
        </button>
    );
}