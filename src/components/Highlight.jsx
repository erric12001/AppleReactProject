import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { rightImg, watchImg } from "../utils"
import VideoCarousel from "./VideoCarousel"

const Highlight = () => {
  useGSAP(() => {
    gsap.to("#title", { opacity: 1, y: 0 })
    gsap.to('.link', {opacity: 1, y: 0, duration: 1, stagger: 0.25, ease: "power3.inOut" })
  }, [])

  
  return (
    <section id="highlight" className="w-screen overflow-hidden h-full
     common-padding bg-zinc">
      <div className="screen-max-width">
        <div className="mb-12 w-full md:flex items-end justify-between">
          <h1 id="title" className="section-heading">Get the highlight.</h1>
          <div className="flex flex-wrap  items-end gap-5">
            <p className="link">Watch the film</p>
            <img src={watchImg} alt="watch" className="ml-2"></img>
            <p className="link">Watch the event</p>
            <img src={rightImg} alt="right" className="ml-2"></img>

        </div>

        
         
        </div>

        <VideoCarousel/>
      </div>
     </section>
  )
}

export default Highlight