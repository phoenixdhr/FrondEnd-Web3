import { useState } from "react";


export function useCounter(init:number) {

    const [_count, set_count ] =useState(init)

    
    const increment =()=>set_count(_count+1)
    const decrement =()=>set_count(_count-1)

    return {_count, increment, decrement}
}