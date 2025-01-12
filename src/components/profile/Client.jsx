import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const Client = () => {
	const [client, setClient] = useState({})
	const [formData, setFormData] = useState({
		name: '',
	})
	const [isUploading, setIsUploading] = useState(false) // For upload state

	// Fetch client profile
	const fetchClientProfile = async () => {
		try {
			const response = await fetch('http://localhost:4090/user/profile', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			})
			const data = await response.json()
			setClient(data.user || {})
			setFormData({
				name: data.user?.name || '',
			})
		} catch (err) {
			console.error('Error fetching profile:', err)
		}
	}

	// Update client profile
	const updateClientProfile = async () => {
		try {
			const response = await fetch('http://localhost:4090/user/update', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
				body: JSON.stringify({
					name: formData.name,
				}),
			})

			if (!response.ok) {
				throw new Error('Failed to update profile')
			}

			const updatedData = await response.json()
			setClient(updatedData.user || {})
		} catch (err) {
			console.error('Error updating profile:', err)
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

	// Handle file input
	const handleFileChange = async (e) => {
		const file = e.target.files[0]
		if (file) {
			// Show a preview of the image immediately
			const previewUrl = URL.createObjectURL(file)
			setClient((prev) => ({
				...prev,
				profilePicture: previewUrl, // Temporarily show the selected image
			}))

			setIsUploading(true) // Set uploading state

			try {
				// Create form data with the selected image
				const formData = new FormData()
				formData.append('profilePicture', file)

				// Send the update request to the server
				const response = await fetch('http://localhost:4090/user/update', {
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
					body: formData,
				})

				if (!response.ok) {
					throw new Error('Failed to update profile picture')
				}

				const updatedData = await response.json()
				// Update the client profile with the updated picture from the server
				setClient((prev) => ({
					...prev,
					profilePicture:
						updatedData.user?.profilePicture || prev.profilePicture,
				}))
			} catch (err) {
				console.error('Error uploading profile picture:', err)
			} finally {
				setIsUploading(false) // Reset uploading state
				// Revoke the temporary preview URL
				URL.revokeObjectURL(previewUrl)
			}
		}
	}

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault()
		updateClientProfile()
	}

	useEffect(() => {
		fetchClientProfile()
	}, [])

	return (
		<section className="mt-16 mb-32">
			<main className="container mx-auto">
				<div className="flex items-center mb-8">
					{/* Avatar */}
					<Avatar className="h-24 w-24 relative cursor-pointer">
						<input
							type="file"
							accept="image/*"
							className="absolute inset-0 opacity-0 cursor-pointer"
							onChange={(e) => handleFileChange(e)}
						/>
						{client?.profilePicture ? (
							<AvatarImage
								src={client?.profilePicture}
								alt={client?.name || 'Client'}
							/>
						) : (
							<AvatarFallback className="text-xl font-bold">
								{client?.name?.charAt(0).toUpperCase() || 'C'}
							</AvatarFallback>
						)}
					</Avatar>

					{/* Client Details */}
					<div className="ml-6">
						<h1 className="text-2xl font-bold">{client?.name || 'N/A'}</h1>
						<p className="text-gray-600">{client?.email || 'N/A'}</p>
						<p className="text-sm text-gray-500 uppercase">
							{client?.roleType || 'Client'}
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
									value={client?.email}
									className="mt-1"
									readOnly
								/>
							</div>
						</div>

						<Button type="submit" className="mt-4" disabled={isUploading}>
							{isUploading ? 'Saving...' : 'Save Changes'}
						</Button>
					</form>
				</div>
			</main>
		</section>
	)
}

export default Client
