import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";


export default function JobsTrendChart({data=[]}) {


const formatted =
data.map(item=>({

    ...item,

    Date:
    new Date(item.FullDate)
    .toLocaleDateString(
        "en-US",
        {
            month:"short",
            day:"numeric"
        }
    )

}));



return (

<ResponsiveContainer

width="100%"

height={330}

>


<AreaChart

data={formatted}

margin={{
top:20,
right:20,
left:0,
bottom:20
}}

>


<defs>

<linearGradient

id="trend"

x1="0"

y1="0"

x2="0"

y2="1"

>

<stop

offset="0%"

stopColor="#22d3ee"

stopOpacity={0.35}

/>


<stop

offset="100%"

stopColor="#22d3ee"

stopOpacity={0}

/>


</linearGradient>


</defs>



<CartesianGrid

strokeDasharray="4 4"

stroke="#1e293b"

/>



<XAxis

dataKey="Date"

stroke="#94a3b8"

tick={{
fontSize:12
}}

/>



<YAxis

stroke="#94a3b8"

/>



<Tooltip

contentStyle={{

background:"#020617",

border:"1px solid #334155",

borderRadius:"14px"

}}

/>




<Area

type="monotone"

dataKey="Jobs"

stroke="#22d3ee"

strokeWidth={4}

fill="url(#trend)"

animationDuration={1500}

/>



</AreaChart>


</ResponsiveContainer>

)

}