import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const Admin = () => {
	const [admin, setAdmin] = useState({})
	const [formData, setFormData] = useState({
		name: '',
	})

	// Fetch admin profile
	const fetchAdminProfile = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACK_END_URL}/user/profile`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				}
			)
			const data = await response.json()
			setAdmin(data.user || {})
			setFormData({
				name: data.user?.name || '',
			})
		} catch (err) {
			console.error('Error fetching profile:', err)
		}
	}

	// Update admin profile
	const updateAdminProfile = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACK_END_URL}/user/update`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
					body: JSON.stringify({
						name: formData.name,
					}),
				}
			)

			if (!response.ok) {
				throw new Error('Failed to update profile')
			}

			const updatedData = await response.json()
			setAdmin(updatedData.user || {})
			alert('Profile updated successfully!')
		} catch (err) {
			console.error('Error updating profile:', err)
			alert('Failed to update profile. Please try again.')
		}
	}

	// Handle form inputs
	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault()
		updateAdminProfile()
	}

	useEffect(() => {
		fetchAdminProfile()
	}, [])

	return (
		<section className="mt-16 mb-32">
			<main className="container mx-auto">
				<div className="flex items-center mb-8">
					{/* Avatar */}
					<Avatar className="h-24 w-24">
						{admin?.profilePicture ? (
							<AvatarImage
								src={admin?.profilePicture}
								alt={admin?.name || 'Admin'}
							/>
						) : (
							<AvatarFallback className="text-xl font-bold">
								{admin?.name?.charAt(0).toUpperCase() || 'A'}
							</AvatarFallback>
						)}
					</Avatar>

					{/* Admin Details */}
					<div className="ml-6">
						<h1 className="text-2xl font-bold">{admin?.name || 'N/A'}</h1>
						<p className="text-gray-600">{admin?.email || 'N/A'}</p>
						<p className="text-sm text-gray-500 uppercase">
							{admin?.roleType || 'Admin'}
						</p>
					</div>
				</div>

				{/* Editable Profile */}
				<div>
					<h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
					<form onSubmit={handleSubmit}>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Name
								</label>
								<Input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									className="mt-1"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Email
								</label>
								<Input
									type="email"
									value={admin?.email}
									className="mt-1"
									readOnly
								/>
							</div>
						</div>

						<Button type="submit" className="mt-4">
							Save Changes
						</Button>
					</form>
				</div>
			</main>
		</section>
	)
}

export default Admin
