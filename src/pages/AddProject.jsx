'use client'

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'

const AddProject = () => {
	const [projectName, setProjectName] = useState('')
	const [description, setDescription] = useState('')
	const [images, setImages] = useState([])
	const navigate = useNavigate()

	// Handle image upload preview
	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files)

		if (files.length > 5) {
			alert('You can upload a maximum of 5 images.')
			return
		}

		setImages(files)
		console.log('Selected images:', files)
	}

	// Submit form data
	const handleSubmit = async (e) => {
		e.preventDefault()

		const formData = new FormData()
		formData.append('projectName', projectName)
		formData.append('description', description)

		images.forEach((image) => {
			formData.append('images', image) // Append without index
		})

		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACK_END_URL}/gallery/new`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
					body: formData,
				}
			)

			const data = await response.json()
			console.log('Backend response:', data)

			if (!response.ok) {
				throw new Error('Failed to add project')
			}

			alert('Project added successfully!')
			navigate('/dashboard')
		} catch (error) {
			console.error('Error adding project:', error)
			alert('Failed to add project. Please try again.')
		}
	}

	return (
		<section className="mt-16 mb-32">
			<h1 className="text-2xl font-bold text-center mb-8">Add a New Project</h1>
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
					<input
						type="file"
						accept="image/*"
						multiple
						onChange={handleImageUpload}
						className="block w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					/>
					<p className="text-sm text-gray-500 mt-1">
						You can upload a maximum of 5 images.
					</p>
					<div className="grid grid-cols-3 gap-2 mt-2">
						{images.map((image, index) => (
							<img
								key={index}
								src={URL.createObjectURL(image)}
								alt={`Preview ${index + 1}`}
								className="w-full h-32 object-cover rounded-md"
							/>
						))}
					</div>
				</div>

				<div className="flex justify-center">
					<Button type="submit">Add Project</Button>
				</div>
			</form>
		</section>
	)
}

export default AddProject
