import React from 'react'
import Admin from '../components/profile/Admin'
import Client from '../components/profile/Client'
import Freelancer from '../components/profile/Freelancer'

const Profile = ({ user }) => {
	if (!user) {
		return (
			<h1 className="flex items-center justify-center mt-48 text-5xl font-bold text-[#023A12]">
				Loading...
			</h1>
		)
	}

	const renderProfile = () => {
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
			<main className="container mx-auto">{renderProfile()}</main>
		</section>
	)
}

export default Profile
