import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";


export default function JobsCompanyChart({ data }) {


    const sortedData = [...data]
        .sort((a,b)=> b.Jobs - a.Jobs)
        .slice(0,10);



    return (

        <div
            className="
            w-full
            h-full
            "
        >


            <ResponsiveContainer
                width="100%"
                height={350}
            >


                <BarChart

                    data={sortedData}

                    layout="vertical"

                    margin={{
                        top:10,
                        right:30,
                        left:20,
                        bottom:10
                    }}

                >


                    <CartesianGrid

                        strokeDasharray="3 3"

                        stroke="#1e293b"

                        horizontal={false}

                    />



                    <XAxis

                        type="number"

                        stroke="#94a3b8"

                    />



                    <YAxis

                        type="category"

                        dataKey="CompanyName"

                        width={100}

                        stroke="#94a3b8"

                        tick={{
                            fontSize:12
                        }}

                    />




                    <Tooltip

                        contentStyle={{

                            background:"#020617",

                            border:
                            "1px solid #334155",

                            borderRadius:"14px",

                            color:"#fff"

                        }}

                    />





                    <Bar

                        dataKey="Jobs"

                        fill="#6366f1"

                        radius={[0,8,8,0]}

                        barSize={22}

                        animationDuration={1200}

                    />



                </BarChart>


            </ResponsiveContainer>



        </div>


    );

}