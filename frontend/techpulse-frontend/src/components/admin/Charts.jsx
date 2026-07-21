import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from "recharts";

import { motion } from "framer-motion";

import {
    PieChart as PieIcon,
    BarChart as BarIcon
} from "lucide-react";


// ==========================================
// Chart Colors
// ==========================================

const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4"
];


// ==========================================
// Safe Number Helper
// ==========================================

const getSafeNumber = (value) => {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;

};


// ==========================================
// Get Job Count
// Supports Different API Response Structures
// ==========================================

const getJobCount = (item) => {

    return getSafeNumber(

        item?.Count ??
        item?.Jobs ??
        item?.TotalJobs ??
        item?.JobCount ??
        item?.count ??
        item?.jobs ??
        0

    );

};


// ==========================================
// Charts Component
// ==========================================

export default function Charts({

    jobsByCategory = [],

    workTypes = []

}) {


    // ==========================================
    // Make Sure Data Is Always Array
    // ==========================================

    const safeJobsByCategory =

        Array.isArray(jobsByCategory)

            ? jobsByCategory

            : [];


    const safeWorkTypes =

        Array.isArray(workTypes)

            ? workTypes

            : [];


    // ==========================================
    // Prepare Category Data
    // ==========================================

    const categoryData =

        safeJobsByCategory

            .map(

                (item) => ({

                    name:

                        item?.JobCategory ||

                        item?.Category ||

                        item?.category ||

                        "Other",

                    value:

                        getJobCount(item)

                })

            )

            .filter(

                (item) =>

                    item.value > 0

            );


    // ==========================================
    // Prepare Work Type Data
    // ==========================================

    const workTypeData =

        safeWorkTypes

            .map(

                (item) => ({

                    name:

                        item?.WorkType ||

                        item?.workType ||

                        item?.Work_Type ||

                        "Unknown",

                    jobs:

                        getJobCount(item)

                })

            )

            .filter(

                (item) =>

                    item.jobs > 0

            );


    // ==========================================
    // Empty State
    // ==========================================

    if (

        categoryData.length === 0 &&

        workTypeData.length === 0

    ) {

        return (

            <div className="
                bg-slate-900
                rounded-3xl
                p-12
                text-center
                text-slate-400
                border
                border-slate-800
                shadow-2xl
            ">

                <div className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-4
                ">

                    <PieIcon
                        size={48}
                        className="
                            text-slate-600
                        "
                    />

                    <h3 className="
                        text-lg
                        font-semibold
                        text-white
                    ">

                        No Analytics Data Available

                    </h3>

                    <p className="
                        text-sm
                        text-slate-500
                    ">

                        There is no category or work type
                        data available to display.

                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // Render
    // ==========================================

    return (

        <div className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-8
            mb-10
        ">


            {/* ================================= */}
            {/* Jobs By Category */}
            {/* ================================= */}

            <motion.div

                initial={{
                    opacity: 0,
                    y: 20
                }}

                animate={{
                    opacity: 1,
                    y: 0
                }}

                transition={{
                    duration: 0.4
                }}

                className="
                    bg-slate-900
                    border
                    border-slate-800
                    rounded-3xl
                    p-6
                    shadow-2xl
                "

            >

                <div className="
                    flex
                    items-center
                    gap-3
                    mb-6
                ">

                    <div className="
                        bg-blue-500/10
                        p-3
                        rounded-2xl
                    ">

                        <PieIcon

                            className="
                                text-blue-500
                            "

                            size={24}

                        />

                    </div>


                    <div>

                        <h2 className="
                            text-xl
                            font-bold
                            text-white
                        ">

                            Jobs By Category

                        </h2>

                        <p className="
                            text-sm
                            text-slate-500
                            mt-1
                        ">

                            Distribution of jobs by category

                        </p>

                    </div>

                </div>


                <div className="
                    h-[350px]
                    w-full
                ">

                    {

                        categoryData.length > 0

                            ?

                            (

                                <ResponsiveContainer

                                    width="100%"

                                    height="100%"

                                >

                                    <PieChart>

                                        <Pie

                                            data={
                                                categoryData
                                            }

                                            dataKey="value"

                                            nameKey="name"

                                            cx="50%"

                                            cy="45%"

                                            innerRadius={75}

                                            outerRadius={115}

                                            paddingAngle={3}

                                            labelLine={false}

                                        >

                                            {

                                                categoryData.map(

                                                    (_, index) => (

                                                        <Cell

                                                            key={
                                                                `category-${index}`
                                                            }

                                                            fill={

                                                                COLORS[

                                                                    index %

                                                                    COLORS.length

                                                                ]

                                                            }

                                                        />

                                                    )

                                                )

                                            }

                                        </Pie>


                                        <Tooltip

                                            formatter={

                                                (value) => [

                                                    getSafeNumber(
                                                        value
                                                    ),

                                                    "Jobs"

                                                ]

                                            }

                                            contentStyle={{

                                                background:
                                                    "#0f172a",

                                                border:
                                                    "1px solid #334155",

                                                borderRadius:
                                                    "12px",

                                                color:
                                                    "#ffffff"

                                            }}

                                            itemStyle={{

                                                color:
                                                    "#ffffff"

                                            }}

                                        />


                                        <Legend

                                            verticalAlign="bottom"

                                            align="center"

                                            height={50}

                                            wrapperStyle={{

                                                color:
                                                    "#cbd5e1",

                                                fontSize:
                                                    "12px"

                                            }}

                                        />

                                    </PieChart>

                                </ResponsiveContainer>

                            )

                            :

                            (

                                <div className="
                                    h-full
                                    flex
                                    items-center
                                    justify-center
                                    text-slate-500
                                ">

                                    No Category Data

                                </div>

                            )

                    }

                </div>

            </motion.div>



            {/* ================================= */}
            {/* Work Types Distribution */}
            {/* ================================= */}

            <motion.div

                initial={{
                    opacity: 0,
                    y: 20
                }}

                animate={{
                    opacity: 1,
                    y: 0
                }}

                transition={{
                    duration: 0.4,
                    delay: 0.2
                }}

                className="
                    bg-slate-900
                    border
                    border-slate-800
                    rounded-3xl
                    p-6
                    shadow-2xl
                "

            >

                <div className="
                    flex
                    items-center
                    gap-3
                    mb-6
                ">

                    <div className="
                        bg-green-500/10
                        p-3
                        rounded-2xl
                    ">

                        <BarIcon

                            className="
                                text-green-500
                            "

                            size={24}

                        />

                    </div>


                    <div>

                        <h2 className="
                            text-xl
                            font-bold
                            text-white
                        ">

                            Work Types Distribution

                        </h2>

                        <p className="
                            text-sm
                            text-slate-500
                            mt-1
                        ">

                            Jobs distribution by work type

                        </p>

                    </div>

                </div>


                <div className="
                    h-[350px]
                    w-full
                ">

                    {

                        workTypeData.length > 0

                            ?

                            (

                                <ResponsiveContainer

                                    width="100%"

                                    height="100%"

                                >

                                    <BarChart

                                        data={
                                            workTypeData
                                        }

                                        margin={{

                                            top: 20,

                                            right: 30,

                                            left: 0,

                                            bottom: 20

                                        }}

                                    >

                                        <CartesianGrid

                                            strokeDasharray="3 3"

                                            stroke="#1e293b"

                                            vertical={false}

                                        />


                                        <XAxis

                                            dataKey="name"

                                            stroke="#94a3b8"

                                            fontSize={12}

                                            tickLine={false}

                                            axisLine={false}

                                        />


                                        <YAxis

                                            stroke="#94a3b8"

                                            fontSize={12}

                                            tickLine={false}

                                            axisLine={false}

                                            allowDecimals={false}

                                        />


                                        <Tooltip

                                            cursor={{

                                                fill:
                                                    "rgba(30, 41, 59, 0.5)"

                                            }}

                                            formatter={

                                                (value) => [

                                                    getSafeNumber(
                                                        value
                                                    ),

                                                    "Jobs"

                                                ]

                                            }

                                            contentStyle={{

                                                background:
                                                    "#0f172a",

                                                border:
                                                    "1px solid #334155",

                                                borderRadius:
                                                    "12px",

                                                color:
                                                    "#ffffff"

                                            }}

                                            itemStyle={{

                                                color:
                                                    "#ffffff"

                                            }}

                                        />


                                        <Bar

                                            dataKey="jobs"

                                            radius={[

                                                8,

                                                8,

                                                0,

                                                0

                                            ]}

                                            barSize={50}

                                        >

                                            {

                                                workTypeData.map(

                                                    (_, index) => (

                                                        <Cell

                                                            key={

                                                                `worktype-${index}`

                                                            }

                                                            fill={

                                                                COLORS[

                                                                    index %

                                                                    COLORS.length

                                                                ]

                                                            }

                                                        />

                                                    )

                                                )

                                            }

                                        </Bar>

                                    </BarChart>

                                </ResponsiveContainer>

                            )

                            :

                            (

                                <div className="
                                    h-full
                                    flex
                                    items-center
                                    justify-center
                                    text-slate-500
                                ">

                                    No Work Type Data

                                </div>

                            )

                    }

                </div>

            </motion.div>


        </div>

    );

}