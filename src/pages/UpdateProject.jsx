'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'

const UpdateProject = ({ user }) => {
	const { projectId } = useParams()
	const [projectName, setProjectName] = useState('')
	const [description, setDescription] = useState('')
	const [images, setImages] = useState([])
	const [existingImages, setExistingImages] = useState([])
	const [isUpdating, setIsUpdating] = useState(false) // Track the update state
	const navigate = useNavigate()

	// Fetch the current project details
	useEffect(() => {
		const fetchProjectDetails = async () => {
			try {
				const response = await fetch(
					`http://localhost:4090/gallery/project/${projectId}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('authToken')}`,
						},
					}
				)

				if (!response.ok) throw new Error('Failed to fetch project details')

				const data = await response.json()
				setProjectName(data.projectName)
				setDescription(data.description)
				setExistingImages(data.images || [])
			} catch (error) {
				console.error('Error fetching project details:', error)
			}
		}

		if (projectId) {
			fetchProjectDetails()
		}
	}, [projectId])

	// Handle image upload preview
	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files)

		if (files.length + existingImages.length > 5) {
			console.error('You can upload a maximum of 5 images in total.')
			return
		}

		setImages(files)
	}

	// Handle image removal
	const handleRemoveImage = (index) => {
		setExistingImages((prevImages) =>
			prevImages.filter((_, imgIndex) => imgIndex !== index)
		)
	}

	// Submit form data
	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsUpdating(true) // Set updating state to true

		const formData = new FormData()
		formData.append('projectName', projectName)
		formData.append('description', description)

		images.forEach((image) => {
			formData.append('images', image)
		})

		formData.append('existingImages', JSON.stringify(existingImages)) // Send remaining existing images

		try {
			const response = await fetch(
				`http://localhost:4090/gallery/update/${projectId}`,
				{
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
					body: formData,
				}
			)

			if (!response.ok) {
				throw new Error('Failed to update project')
			}

			// Navigate to the freelancer's portfolio page
			navigate('/dashboard')
		} catch (error) {
			console.error('Error updating project:', error)
		} finally {
			setIsUpdating(false) // Reset updating state
		}
	}

	return (
		<section className="mt-16 mb-32">
			<h1 className="text-2xl font-bold text-center mb-8">Update Project</h1>
			<form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Project Name
					</label>
					<Input
						type="text"
						value={projectName}
						onChange={(e) => setProjectName(e.target.value)}
						placeholder="Enter project name"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Description
					</label>
					<Textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Describe your project"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Images (Max 5)
					</label>
					{/* Display existing images */}
					<div className="grid grid-cols-3 gap-2 mt-2 mb-4">
						{existingImages.map((image, index) => (
							<div key={index} className="relative">
								<img
									src={image}
									alt={`Existing Image ${index + 1}`}
									className="w-full h-32 object-cover rounded-md"
								/>
								<button
									type="button"
									className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs"
									onClick={() => handleRemoveImage(index)}
								>
									Remove
								</button>
							</div>
						))}
					</div>

					{/* Upload new images */}
					<input
						type="file"
						accept="image/*"
						multiple
						onChange={handleImageUpload}
						className="block w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					/>
					<p className="text-sm text-gray-500 mt-1">
						You can upload a maximum of 5 images in total (including existing
						and new images).
					</p>
				</div>

				<div className="flex justify-center">
					<Button type="submit" disabled={isUpdating}>
						{isUpdating ? 'Updating...' : 'Update Project'}
					</Button>
				</div>
			</form>
		</section>
	)
}

export default UpdateProject
