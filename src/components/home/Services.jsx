import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/mahara.svg'
import LogoDesign from '../../assets/logoDesign.png'
import SoftwareDev from '../../assets/softwareDev.png'
import VideoEditing from '../../assets/videoEditing.png'
import WebDev from '../../assets/WebDev.png'
import SocialMedia from '../../assets/SocialMedia.png'
import InteriorDesign from '../../assets/InteriorDesign.png'
import Poster from '../../assets/poster.png'

const Services = () => {
	const handleScroll = (e, targetId) => {
		e.preventDefault()
		const targetElement = document.getElementById(targetId)
		if (targetElement) {
			const yOffset = -200 // Adjust the offset as needed
			const y =
				targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset
			window.scrollTo({ top: y, behavior: 'smooth' })
		}
	}

	const categories = [
		{
			id: 1,
			category: 'Logo Design Services',
			source: LogoDesign,
			color: '#FF763F',
		},
		{
			id: 2,
			category: 'Software Development',
			source: SoftwareDev,
			color: '#264201',
		},
		{
			id: 3,
			category: 'Video Editing Services',
			source: VideoEditing,
			color: '#BE5172',
		},
		{
			id: 4,
			category: 'Website Development',
			source: WebDev,
			color: '#264201',
		},
		{
			id: 5,
			category: 'Social Media Marketing',
			source: SocialMedia,
			color: '#7A832D',
		},
		{
			id: 6,
			category: 'Architecture & Interior Design',
			source: InteriorDesign,
			color: '#633541',
		},
	]

	return (
		<section id="services" className="my-32">
			<h1 className="mt-48 text-5xl font-bold text-[#404145]">
				Popular Services
			</h1>

			{/* List of Services */}
			<div className="grid grid-cols-6 gap-5 my-14">
				{categories.map((category, index) => (
					<Link
						key={category.id}
						to={`/categories/${encodeURIComponent(category.category)}`} // Navigate to category page
						style={{ backgroundColor: category.color }}
						className="p-2 flex flex-col gap-8 rounded-2xl h-full"
					>
						<h4 className="text-white text-lg font-medium p-4">
							{category.category}
						</h4>
						<img
							src={category.source}
							alt={category.category}
							className="rounded-xl w-full h-full object-cover mt-auto"
						/>
					</Link>
				))}
			</div>

			{/* Poster */}
			<div className="bg-[#FFF6F3] p-12 rounded-3xl grid grid-cols-2 gap-12">
				<div className="col-span-1 flex flex-col gap-16 justify-start items-start">
					<img src={Logo} alt="Logo" className="max-h-8" />
					<h2 className="font-normal text-5xl leading-normal">
						Make an incredible work{' '}
						<span className="text-[#FF763F] font-semibold">in seconds</span>
					</h2>
					<a
						href="#contact"
						onClick={(e) => handleScroll(e, 'contact')}
						className="bg-[#FF763F] text-white border border-[#FF763F] px-4 py-1.5 rounded-xl hover:bg-[#FFF6F3] hover:text-[#FF763F]"
					>
						Book a Demo
					</a>
				</div>
				<div className="col-span-1">
					<img src={Poster} alt="poster" />
				</div>
			</div>
		</section>
	)
}

export default Services
