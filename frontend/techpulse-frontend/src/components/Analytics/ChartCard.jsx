export default function ChartCard({
    title,
    icon,
    children
}) {


    return (

        <div

            className="
            bg-slate-900/70
            backdrop-blur-xl
            border
            border-slate-800
            rounded-3xl
            p-6
            shadow-xl
            hover:border-cyan-400/40
            transition-all
            duration-300
            "

        >


            <div

                className="
                flex
                items-center
                gap-3
                mb-6
                "

            >


                <div

                    className="
                    text-cyan-400
                    bg-cyan-400/10
                    p-2
                    rounded-xl
                    "

                >

                    {icon}

                </div>



                <h2

                    className="
                    text-white
                    text-xl
                    font-black
                    "

                >

                    {title}

                </h2>



            </div>



            <div>

                {children}

            </div>



        </div>

    );

}