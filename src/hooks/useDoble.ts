import { useState } from "react"
import { useMemo } from "react"



function useDoble(numero:number) {

    const doble = useMemo(()=>{return numero*2},[numero])
    return doble
}

export default useDoble