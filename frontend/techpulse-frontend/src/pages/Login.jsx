import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { motion } from "framer-motion";

import {
Mail,
Lock,
LogIn,
Loader2,
AlertCircle
}
from "lucide-react";


import {
success,
error
}
from "../utils/alerts";



export default function Login(){


const {login}=useAuth();

const navigate=useNavigate();



const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const [errorMsg,setErrorMsg]=useState("");

const [loading,setLoading]=useState(false);





async function handleSubmit(e){


e.preventDefault();

setLoading(true);

setErrorMsg("");



try{


await login(
email,
password
);



success(
"Login successful"
);



setTimeout(()=>{


navigate("/");


},700);



}

catch(err){


const msg =
err.message || "Login Failed";


setErrorMsg(msg);

error(msg);



}

finally{


setLoading(false);


}



}






return (

<div className="
min-h-screen
bg-[#030712]
flex
items-center
justify-center
p-6
pt-20
">


<motion.div


initial={{
opacity:0,
y:20
}}

animate={{
opacity:1,
y:0
}}

className="
w-full
max-w-md
rounded-3xl
bg-slate-900/50
border
border-slate-800
p-8
shadow-2xl
"



>



<h1 className="
text-3xl
font-black
text-white
text-center
mb-2
">

Welcome Back

</h1>



<p className="
text-slate-400
text-center
mb-8
">

Login to TechPulse

</p>






{
errorMsg &&


<div className="
mb-6
flex
gap-2
items-center
bg-red-500/10
border
border-red-500/20
p-4
rounded-xl
text-red-400
text-sm
">

<AlertCircle size={18}/>

{errorMsg}

</div>

}





<form
onSubmit={handleSubmit}
className="space-y-5"
>




<div>

<label className="text-slate-400 text-sm">
Email
</label>


<div className="relative mt-2">


<Mail

className="
absolute
left-3
top-3.5
text-slate-500
"

size={18}

/>



<input

type="email"

required

value={email}

onChange={
e=>setEmail(e.target.value)
}

className="
w-full
rounded-xl
bg-[#030712]
border
border-slate-700
py-3
pl-11
text-white
outline-none
focus:border-blue-500
"

/>



</div>


</div>





<div>

<label className="text-slate-400 text-sm">
Password
</label>


<div className="relative mt-2">


<Lock

className="
absolute
left-3
top-3.5
text-slate-500
"

size={18}

/>



<input

type="password"

required

value={password}

onChange={
e=>setPassword(e.target.value)
}

className="
w-full
rounded-xl
bg-[#030712]
border
border-slate-700
py-3
pl-11
text-white
outline-none
focus:border-blue-500
"

/>



</div>


</div>





<button

disabled={loading}

className="
w-full
bg-blue-600
py-3
rounded-xl
font-bold
text-white
flex
justify-center
items-center
gap-2
hover:bg-blue-500
transition
"

>


{

loading ?

<Loader2
size={18}
className="animate-spin"
/>

:

<>

<LogIn size={18}/>

Login

</>

}



</button>



</form>





<p className="
mt-8
text-center
text-slate-400
text-sm
">


Don't have an account?


<Link

to="/register"

className="
ml-2
text-blue-400
font-semibold
"

>

Register

</Link>


</p>



</motion.div>


</div>


);


}