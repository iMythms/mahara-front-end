import React from 'react'
import Logo from '../assets/mahara.svg'
import { Link } from 'react-router-dom'

import { Avatar, AvatarImage } from './ui/avatar'
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarTrigger,
} from './ui/menubar'

const NavBar = ({ user, logOut }) => {
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

	return (
		<nav className="bg-white h-24 border-b border-[#e6e6e6] flex items-center fixed top-0 w-full z-10">
			<section className="container mx-auto flex items-center justify-between">
				<Link to="/" className="flex items-center justify-center">
					<img src={Logo} alt="Logo" className="h-8" />
				</Link>
				<div className="flex gap-8">
					{/* Dynamic navigation items */}
					{user ? (
						<>
							<Link
								to="/dashboard"
								className="hover:bg-[#E6E6E6] px-4 py-1.5 rounded-xl"
							>
								Dashboard
							</Link>

							{/* Render this link only for freelancers */}
							{user.roleType === 'freelancer' && (
								<Link
									to={`/freelancer/${user._id}`} // Dynamically insert the freelancer's ID
									className="hover:bg-[#E6E6E6] px-4 py-1.5 rounded-xl"
								>
									Portfolio
								</Link>
							)}

							<Link
								to="/applications"
								className="hover:bg-[#E6E6E6] px-4 py-1.5 rounded-xl"
							>
								Applications
							</Link>

							<Link
								to="/jobs"
								className="hover:bg-[#E6E6E6] px-4 py-1.5 rounded-xl"
							>
								Jobs
							</Link>
						</>
					) : (
						<>
							<a
								href="#about"
								onClick={(e) => handleScroll(e, 'about')}
								className="hover:bg-[#E6E6E6] px-4 py-1.5 rounded-xl"
							>
								About
							</a>
							<a
								href="#services"
								onClick={(e) => handleScroll(e, 'services')}
								className="hover:bg-[#E6E6E6] px-4 py-1.5 rounded-xl"
							>
								Services
							</a>
							<a
								href="#contact"
								onClick={(e) => handleScroll(e, 'contact')}
								className="hover:bg-[#E6E6E6] px-4 py-1.5 rounded-xl"
							>
								Contact
							</a>
						</>
					)}
				</div>
				<div className="flex justify-between items-center gap-5">
					{/* Dynamic buttons */}
					{user ? (
						<>
							{/* Profile Menu */}
							<Menubar asChild>
								<MenubarMenu asChild>
									<MenubarTrigger className="p-0 rounded-full cursor-pointer">
										<Avatar>
											<AvatarImage
												src="https://github.com/shadcn.png"
												alt="@shadcn"
											/>
										</Avatar>
									</MenubarTrigger>
									<MenubarContent>
										<MenubarItem inset>
											<Link to="/profile" className="w-full">
												Profile
											</Link>
										</MenubarItem>
										<MenubarSeparator />
										<MenubarItem inset>
											<button onClick={logOut} className="text-red-600">
												Logout
											</button>
										</MenubarItem>
									</MenubarContent>
								</MenubarMenu>
							</Menubar>
						</>
					) : (
						<>
							<Link
								to="/auth/login"
								className="hover:bg-[#E6E6E6] px-4 py-1.5 rounded-xl"
							>
								Sign in
							</Link>
							<Link
								to="/auth/register"
								className="bg-white text-[#1DBF73] border border-[#1DBF73] px-4 py-1.5 rounded-xl hover:bg-[#1DBF73] hover:text-white"
							>
								Join us
							</Link>
						</>
					)}
				</div>
			</section>
		</nav>
	)
}

export default NavBar
