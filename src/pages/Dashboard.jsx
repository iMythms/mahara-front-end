import React from 'react'
import Services from '../components/home/Services'

const Dashboard = ({ user }) => {
	if (!user) {
		return (
			<h1 className="flex items-center justify-center mt-48 text-5xl font-bold text-[#023A12]">
				Loading...
			</h1>
		)
	}

	return (
		<div>
			<main className="container mx-auto">
				<h1 className="flex items-center justify-center mt-48 text-5xl font-bold text-[#023A12]">
					{`Welcome back, ${user.name}!`}
				</h1>

				<Services />
			</main>
		</div>
	)
}

export default Dashboard
