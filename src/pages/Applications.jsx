import React from 'react'
import Admin from '../components/applications/Admin'
import Client from '../components/applications/Client'
import Freelancer from '../components/applications/Freelancer'

const Applications = ({ user }) => {
	if (!user) {
		return (
			<h1 className="flex items-center justify-center mt-48 text-5xl font-bold text-[#023A12]">
				Loading...
			</h1>
		)
	}

	const renderApplications = () => {
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
		<section className="mt-48 mb-32">
			<main className="container mx-auto">
				<h1 className="text-2xl font-bold text-[#404145] mb-6">Applications</h1>

				{renderApplications()}
			</main>
		</section>
	)
}

export default Applications
