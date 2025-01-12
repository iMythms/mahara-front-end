import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const Freelancer = () => {
	const [freelancer, setFreelancer] = useState({})
	const [formData, setFormData] = useState({
		name: '',
		categories: [],
		profilePicture: null, // For file to be submitted
		previewProfilePicture: '', // For immediate preview
	})
	const categoriesList = [
		'No Category',
		'Logo Design Services',
		'Software Development',
		'Video Editing Services',
		'Website Development',
		'Social Media Marketing',
		'Architecture & Interior Design',
	]

	// Fetch freelancer profile
	const fetchFreelancerProfile = async () => {
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

			setFreelancer(data.user || {})
			setFormData({
				name: data.user?.name || '',
				categories: Array.isArray(data.user?.categories) // Check if already an array
					? data.user.categories
					: typeof data.user?.categories === 'string'
					? data.user.categories.split(',') // Split string into array
					: [], // Default to empty array
			})
		} catch (err) {
			console.error('Error fetching profile:', err)
		}
	}

	// Update freelancer profile
	const updateFreelancerProfile = async () => {
		try {
			const formDataToSend = new FormData()
			formDataToSend.append('name', formData.name)

			// Send categories as a JSON string
			formDataToSend.append('categories', JSON.stringify(formData.categories))

			if (formData.profilePicture) {
				formDataToSend.append('profilePicture', formData.profilePicture)
			}

			const response = await fetch(
				`${import.meta.env.VITE_BACK_END_URL}/user/update`,
				{
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
					body: formDataToSend,
				}
			)

			if (!response.ok) {
				throw new Error('Failed to update profile')
			}

			const updatedData = await response.json()
			setFreelancer(updatedData.user || {})
			setFormData((prev) => ({
				...prev,
				profilePicture: null,
				previewProfilePicture: '',
			}))
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

	// Handle category checkbox changes
	const handleCategoryChange = (category) => {
		setFormData((prev) => {
			const isSelected = prev.categories.includes(category)
			return {
				...prev,
				categories: isSelected
					? prev.categories.filter((cat) => cat !== category) // Remove if already selected
					: [...prev.categories, category], // Add if not selected
			}
		})
	}

	// Handle file input
	const handleFileChange = async (e) => {
		const file = e.target.files[0]
		if (file) {
			// Show a preview of the image immediately
			const previewUrl = URL.createObjectURL(file)
			setFreelancer((prev) => ({
				...prev,
				profilePicture: previewUrl, // Temporarily show the selected image
			}))

			try {
				// Create form data with the selected image
				const formData = new FormData()
				formData.append('profilePicture', file)

				// Send the update request to the server
				const response = await fetch(
					`${import.meta.env.VITE_BACK_END_URL}/user/update`,
					{
						method: 'PUT',
						headers: {
							Authorization: `Bearer ${localStorage.getItem('authToken')}`,
						},
						body: formData,
					}
				)

				if (!response.ok) {
					throw new Error('Failed to update profile picture')
				}

				const updatedData = await response.json()

				// Update the freelancer profile with the updated picture from the server
				setFreelancer((prev) => ({
					...prev,
					profilePicture:
						updatedData.user?.profilePicture || prev.profilePicture,
				}))
			} catch (err) {
				console.error('Error uploading profile picture:', err)
			} finally {
				// Revoke the temporary preview URL
				URL.revokeObjectURL(previewUrl)
			}
		}
	}

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault()
		updateFreelancerProfile()
	}
	useEffect(() => {
		fetchFreelancerProfile()
	}, [])

	return (
		<section className="mt-16 mb-32">
			<main className="container mx-auto">
				<div className="flex items-center mb-8">
					<Avatar className="h-24 w-24 relative cursor-pointer">
						<input
							type="file"
							accept="image/*"
							className="absolute inset-0 opacity-0 cursor-pointer"
							onChange={(e) => handleFileChange(e)}
						/>
						{formData.previewProfilePicture ? (
							<AvatarImage
								src={formData.previewProfilePicture}
								alt={freelancer?.name || 'Freelancer'}
							/>
						) : freelancer?.profilePicture ? (
							<AvatarImage
								src={freelancer?.profilePicture}
								alt={freelancer?.name || 'Freelancer'}
							/>
						) : (
							<AvatarFallback className="text-xl font-bold">
								{freelancer?.name?.charAt(0).toUpperCase() || 'F'}
							</AvatarFallback>
						)}
					</Avatar>

					{/* Freelancer Details */}
					<div className="ml-6">
						<h1 className="text-2xl font-bold">{freelancer?.name || 'N/A'}</h1>
						<p className="text-gray-600">{freelancer?.email || 'N/A'}</p>
						<p className="text-sm text-gray-500 uppercase">
							{freelancer?.roleType || 'N/A'}
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
									value={freelancer?.email}
									className="mt-1"
									readOnly
								/>
							</div>
						</div>

						{/* Categories Selection */}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Categories
							</label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
								{categoriesList.map((category) => (
									<label key={category} className="flex items-center space-x-2">
										<input
											type="checkbox"
											checked={formData.categories.includes(category)}
											onChange={() => handleCategoryChange(category)}
										/>
										<span>{category}</span>
									</label>
								))}
							</div>
							<p className="mt-2 text-sm text-gray-500">
								Selected: {formData.categories.join(', ') || 'None'}
							</p>
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

export default Freelancer
