import Card from "./Card";

export default function StatCard({

    icon,

    title,

    value

}) {

    return (

        <Card>

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-slate-400">

                        {title}

                    </p>

                    <h2 className="text-3xl text-white font-bold mt-2">

                        {value}

                    </h2>

                </div>

                <div className="text-4xl text-violet-500">

                    {icon}

                </div>

            </div>

        </Card>

    )

}