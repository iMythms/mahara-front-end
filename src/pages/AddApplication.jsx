import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Button } from '../components/ui/button'
import { Alert } from '../components/ui/alert'
import { Label } from '../components/ui/label'

const AddApplication = () => {
	const [title, setTitle] = useState('')
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [freelancerName, setFreelancerName] = useState('') // Added freelancer name
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()

	const freelancerId = searchParams.get('freelancerId')

	// Fetch freelancer details
	const fetchFreelancerDetails = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACK_END_URL}/user/freelancers/${freelancerId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				}
			)
			if (!response.ok) throw new Error('Failed to fetch freelancer details')
			const data = await response.json()
			setFreelancerName(data.name || 'Freelancer')
		} catch (error) {
			console.error('Error fetching freelancer details:', error)
			setFreelancerName('Freelancer') // Fallback name
		}
	}

	useEffect(() => {
		if (freelancerId) {
			fetchFreelancerDetails()
		}
	}, [freelancerId])

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACK_END_URL}/applications/new`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
					body: JSON.stringify({ freelancerId, title, message }),
				}
			)

			if (!response.ok) {
				throw new Error('Failed to create application')
			}

			const data = await response.json()
			setSuccess('Application sent successfully!')
			setTimeout(() => navigate('/applications'), 2000) // Redirect after success
		} catch (err) {
			setError('Failed to create application. Please try again.')
		}
	}

	return (
		<div className="container mx-auto mt-48">
			<h1 className="text-2xl font-medium mb-6">
				Request Service from <span className="font-bold">{freelancerName}</span>
			</h1>

			{error && (
				<Alert variant="destructive" className="mb-4">
					{error}
				</Alert>
			)}
			{success && (
				<Alert variant="success" className="mb-4">
					{success}
				</Alert>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="flex flex-col gap-2">
					<Label htmlFor="title" className="block text-sm font-medium">
						Title
					</Label>
					<Input
						type="text"
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
						placeholder="Enter the application title"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="message" className="block text-sm font-medium">
						Message
					</Label>
					<Textarea
						id="message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						required
						placeholder="Enter your message"
					/>
				</div>
				<Button type="submit" className="flex ml-auto">
					Send Application
				</Button>
			</form>
		</div>
	)
}

export default AddApplication
