import React from 'react'
import Admin from '../components/dasboards/Admin'
import Client from '../components/dasboards/Client'
import Freelancer from '../components/dasboards/Freelancer'

const Dashboard = ({ user }) => {
	if (!user) {
		return (
			<h1 className="flex items-center justify-center mt-48 text-5xl font-bold text-[#023A12]">
				Loading...
			</h1>
		)
	}

	const renderDashboard = () => {
		switch (user.roleType) {
			case 'admin':
				return <Admin />
			case 'client':
				return <Client />
			case 'freelancer':
				return <Freelancer />
			default:
				return (
					<h1 className="flex items-center justify-center mt-48 text-5xl font-bold text-[#023A12]">
						Role not recognized...
					</h1>
				)
		}
	}

	return (
		<div>
			<main className="container mx-auto">
				<h1 className="mt-48 text-xl font-normal text-[#404145]">
					Welcome back, <span className="text-xl font-bold">{user.name}!</span>
				</h1>

				{renderDashboard()}
			</main>
		</div>
	)
}

export default Dashboard
