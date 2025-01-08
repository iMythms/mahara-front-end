import React from 'react'
import Ruler from '../../assets/ruler.svg'
import Box from '../../assets/shipping.svg'
import Tool from '../../assets/tools.svg'
import Face from '../../assets/face.svg'
import Speed from '../../assets/speed.svg'
import Frame from '../../assets/Frame.svg'

export const About = () => {
	return (
		<section id="about" className="my-32">
			<h1 className="mt-48 text-5xl font-bold text-[#404145]">
				What sets us apart?
			</h1>
			<div className="grid grid-cols-3 gap-5 my-14">
				<div className="bg-[#317242] bg-opacity-10 rounded-3xl p-8 flex flex-col gap-8 col-span-1">
					<img src={Ruler} alt="ruler" className="w-16" />
					<div className="flex flex-col gap-3 text-3xl">
						<h4 className="font-normal">Access to top</h4>
						<h3 className="font-semibold text-[#1DBF73]">freelancers.</h3>
					</div>
				</div>
				<div className="bg-[#317242] bg-opacity-10 rounded-3xl p-8 flex flex-col gap-8 col-span-1">
					<img src={Box} alt="box" className="w-16" />
					<div className="flex flex-col gap-3 text-3xl">
						<h4 className="font-normal">Secure</h4>
						<h3 className="font-semibold text-[#1DBF73]">payment.</h3>
					</div>
				</div>
				<div className="bg-[#317242] bg-opacity-10 rounded-3xl p-8 flex flex-col gap-8 col-span-1">
					<img src={Tool} alt="tool" className="w-16" />
					<div className="flex flex-col gap-3 text-3xl">
						<h4 className="font-normal">24/7</h4>
						<h3 className="font-semibold text-[#1DBF73]">support.</h3>
					</div>
				</div>
				<div className="bg-[#317242] bg-opacity-10 rounded-3xl p-8 flex flex-col gap-8 col-span-1">
					<img src={Face} alt="face" className="w-16" />
					<div className="flex flex-col gap-3 text-3xl">
						<h4 className="font-normal">Flexible</h4>
						<h3 className="font-semibold text-[#1DBF73]">contracts.</h3>
					</div>
				</div>
				<div className="bg-[#317242] bg-opacity-10 rounded-3xl p-8 flex flex-col gap-8 col-span-1">
					<img src={Speed} alt="speed" className="w-16" />
					<div className="flex flex-col gap-3 text-3xl">
						<h4 className="font-normal">Quality</h4>
						<h3 className="font-semibold text-[#1DBF73]">assurance.</h3>
					</div>
				</div>
				<div className="bg-[#317242] bg-opacity-10 rounded-3xl p-8 flex flex-col gap-8 col-span-1">
					<img src={Frame} alt="frame" className="w-16" />
					<div className="flex flex-col gap-3 text-3xl">
						<h4 className="font-normal">Diverse</h4>
						<h3 className="font-semibold text-[#1DBF73]">network.</h3>
					</div>
				</div>
			</div>
		</section>
	)
}

export default About
