import React from 'react'
import Logo from '../assets/mahara.svg'
import { Link } from 'react-router-dom'

const NavBar = () => {
	return (
		<nav className="bg-white h-24 border-b border-[#e6e6e6] flex items-center">
			<section className="container mx-auto flex items-center justify-between">
				<div className="flex items-center justify-center">
					<img src={Logo} alt="Logo" className="h-8" />
				</div>
				<div className="flex gap-8">
					<div>About</div>
					<div>Services</div>
					<div>Contact</div>
				</div>
				<div className="flex justify-between items-center gap-5">
					<button className="hover:bg-[#E6E6E6] px-4 py-1.5 rounded-xl">
						Sign in
					</button>
					<button className="bg-white text-[#1DBF73] border border-[#1DBF73] px-4 py-1.5 rounded-xl hover:bg-[#1DBF73] hover:text-white">
						Join us
					</button>
				</div>
			</section>
		</nav>
	)
}

export default NavBar
