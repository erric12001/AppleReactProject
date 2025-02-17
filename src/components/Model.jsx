import { useGSAP } from "@gsap/react"
import gsap from "gsap";
import ModelView from "./ModelView";
import { useState } from "react";

const Model = () => {
   
    useGSAP(() => {
        gsap.to("#heading",{y:0,opacity:1})
    },[]);

  return (
    <section className='common-padding'>
        <div className='screen-max-width'>
            <h1 id="heading" className="section-heading">
                Take a closer look
            </h1>

            <div className="flex flex-col items-center mt-5">
                <div className="w-full h-[75vh] md:h-[90vh]
                overflow-hidden relative"></div>
                <ModelView />

            </div>
        </div>

    </section>
  )
}

export default Model