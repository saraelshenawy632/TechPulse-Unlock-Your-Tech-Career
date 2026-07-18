import { motion } from "framer-motion";

export default function StatCard({
    title,
    value,
    icon
}) {

    return (

        <motion.div

            initial={{
                opacity: 0,
                y: 25
            }}

            animate={{
                opacity: 1,
                y: 0
            }}

            transition={{
                duration: 0.4
            }}

            whileHover={{
                y: -6,
                scale: 1.03
            }}

            className="
            relative
            overflow-hidden
            rounded-3xl
            p-6
            border
            border-slate-700/60
            bg-gradient-to-br
            from-slate-900/90
            via-slate-800/90
            to-slate-900
            backdrop-blur-xl
            shadow-xl
            hover:shadow-cyan-500/20
            hover:border-cyan-400
            transition-all
            duration-300
            "

        >

            {/* Glow */}

            <div
                className="
                absolute
                -top-10
                -right-10
                w-28
                h-28
                rounded-full
                bg-cyan-500/10
                blur-3xl
                "
            />

            <div
                className="
                flex
                items-center
                justify-between
                "
            >

                <div>

                    <p
                        className="
                        text-slate-400
                        uppercase
                        tracking-widest
                        text-xs
                        font-semibold
                        "
                    >

                        {title}

                    </p>

                    <h2
                        className="
                        text-4xl
                        font-black
                        mt-3
                        text-white
                        "
                    >

                        {Number(value || 0).toLocaleString()}

                    </h2>

                </div>

                <div
                    className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-cyan-500/15
                    text-cyan-400
                    flex
                    items-center
                    justify-center
                    shadow-lg
                    "
                >

                    {icon}

                </div>

            </div>

            <div
                className="
                mt-5
                h-1.5
                rounded-full
                bg-slate-700
                overflow-hidden
                "
            >

                <div
                    className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-cyan-400
                    to-blue-500
                    w-3/4
                    "
                />

            </div>

        </motion.div>

    );

}