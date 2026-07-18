import {useState} from "react";


export default function JobsFilter({onSearch}){


const [filters,setFilters]=useState({

keyword:"",
category:"",
company:"",
workType:"",
experience:"",
city:""

});



function change(e){

setFilters({

...filters,

[e.target.name]:e.target.value

});


}



function submit(e){

e.preventDefault();

onSearch(filters);


}



return (

<form 
onSubmit={submit}
className="
grid 
md:grid-cols-3 
gap-4
bg-slate-900
p-6
rounded-2xl
mb-10
">


<input

name="keyword"

onChange={change}

placeholder="Search job title..."

className="
p-3
rounded-lg
bg-slate-800
text-white
"

/>



<select
name="category"
onChange={change}
className="filter-input"
>

<option value="">
Category
</option>

<option>
Frontend
</option>

<option>
Backend
</option>

<option>
Data
</option>

<option>
AI
</option>


</select>



<select

name="workType"

onChange={change}

className="filter-input"

>


<option value="">
Work Type
</option>


<option>
Remote
</option>


<option>
Hybrid
</option>


<option>
On-site
</option>


</select>



<select

name="experience"

onChange={change}

className="filter-input"

>


<option value="">
Experience
</option>


<option>
Junior
</option>


<option>
Mid
</option>


<option>
Senior
</option>


</select>



<button

className="
bg-blue-600
hover:bg-blue-700
text-white
rounded-xl
font-bold
"

>

Search

</button>



</form>


);


}