import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";



export default function CategoryChart({data=[]}) {


    return (

        <ResponsiveContainer

            width="100%"

            height={350}

        >


            <BarChart

                data={data}

                layout="vertical"

                margin={{

                    top:20,

                    right:30,

                    left:30,

                    bottom:20

                }}

            >



                <CartesianGrid

                    strokeDasharray="4 4"

                    stroke="#1e293b"

                />





                <XAxis


                    type="number"


                    stroke="#94a3b8"


                    tick={{

                        fontSize:12

                    }}


                />






                <YAxis


                    type="category"


                    dataKey="JobCategory"


                    stroke="#94a3b8"


                    width={110}


                    tick={{

                        fontSize:11

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


                    fill="#a855f7"


                    radius={[0,10,10,0]}


                    animationDuration={1200}


                />



            </BarChart>



        </ResponsiveContainer>


    );

}