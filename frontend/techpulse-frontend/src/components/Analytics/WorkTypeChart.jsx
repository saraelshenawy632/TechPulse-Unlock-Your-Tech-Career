import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend
} from "recharts";


const colors = [
    "#22d3ee",
    "#6366f1",
    "#22c55e"
];


export default function WorkTypeChart({data=[]}) {


return (

<ResponsiveContainer

width="100%"

height={350}

>


<PieChart>


<Pie


data={data}


dataKey="Jobs"


nameKey="WorkType"


cx="50%"


cy="45%"


innerRadius={65}


outerRadius={105}


paddingAngle={5}



labelLine={{

stroke:"#94a3b8"

}}



label={(props)=>{


const {
name,
percent,
x,
y
}=props;


return (

<text

x={x}

y={y}

fill="#fff"

textAnchor="middle"

dominantBaseline="central"

fontSize={12}

fontWeight="700"

>

{name}

{" "}

{(percent*100).toFixed(0)}%

</text>

)


}}



animationDuration={1200}



>


{
data.map((item,index)=>(


<Cell

key={index}

fill={
colors[index%colors.length]
}

/>


))

}



</Pie>




<Tooltip

contentStyle={{

background:"#020617",

border:"1px solid #334155",

borderRadius:"14px"

}}

/>




<Legend

verticalAlign="bottom"

iconType="circle"


wrapperStyle={{

color:"#fff",

paddingTop:"20px"

}}


/>



</PieChart>


</ResponsiveContainer>

)

}