import React from 'react'
import HeaderImage from '../assets/header_image.jpg'
import About from '../components/home/About'
import Services from '../components/home/Services'
import Contact from '../components/home/Contact'

const Home = () => {
	return (
		<div>
			<main className="container mx-auto">
				<h1 className="flex items-center justify-center mt-48 text-5xl font-bold text-[#023A12]">
					Find the perfect freelance talent for your project
				</h1>
				<img
					src={HeaderImage}
					alt="Header Image"
					className="rounded-3xl my-20"
					loading="lazy"
				/>
				<About />
				<Services />
				<Contact />
			</main>
		</div>
	)
}

export default Home
