export default function Card({

    children,

    className = ""

}) {

    return (

        <div

            className={`

                bg-[#111827]

                border

                border-slate-700

                rounded-2xl

                p-6

                hover:border-violet-500

                hover:-translate-y-1

                transition-all

                duration-300

                ${className}

            `}

        >

            {children}

        </div>

    )

}