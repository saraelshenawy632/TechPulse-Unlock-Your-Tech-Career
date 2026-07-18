import {useEffect,useState} from "react";
import {getStats} from "../services/api";


export default function useStats(){

const [stats,setStats]=useState({
jobs:0,
companies:0,
cities:0
});


useEffect(()=>{

getStats()
.then(res=>{
setStats(res.data)
})

},[])



return stats;

}