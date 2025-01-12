import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from '../components/ui/card'
import { Button } from '../components/ui/button'

const Category = ({ user }) => {
	const { category } = useParams() // Get category from URL params
	const [freelancers, setFreelancers] = useState([]) // State for freelancers
	const navigate = useNavigate()

	// Fetch freelancers for the category
	const fetchFreelancers = async () => {
		try {
			const response = await fetch(
				`http://localhost:4090/user/freelancers/category?category=${encodeURIComponent(
					category
				)}`, // Ensure category is encoded properly
				{
					headers: {
						// Include token if required by the backend, otherwise omit
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				}
			)

			if (!response.ok) {
				throw new Error('Failed to fetch freelancers')
			}

			const data = await response.json()
			console.log('Freelancers fetched:', data) // Debugging log
			setFreelancers(data || [])
		} catch (error) {
			console.error('Error fetching freelancers:', error)
		}
	}

	useEffect(() => {
		fetchFreelancers()
	}, [category])

	return (
		<section className="mt-16 mb-32">
			<div className="container mx-auto">
				<h1 className="text-2xl font-bold mb-6">Freelancers in "{category}"</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{freelancers.length > 0 ? (
						freelancers.map((freelancer) => (
							<Card key={freelancer._id} className="border">
								<CardHeader>
									<img
										src={
											freelancer.profilePicture ||
											'https://via.placeholder.com/150' // Default image if no profile picture
										}
										alt={`${freelancer.name}'s profile`}
										className="w-full h-48 object-cover rounded-t-md"
									/>
								</CardHeader>
								<CardContent>
									<h2 className="text-lg font-medium">{freelancer.name}</h2>
									<p className="text-sm text-gray-500">
										Rating: {freelancer.averageRating || 0} / 5
									</p>
								</CardContent>
								<CardFooter className="flex justify-between">
									<Button
										variant="outline"
										size="sm"
										onClick={() => navigate(`/freelancer/${freelancer._id}`)}
									>
										View Portfolio
									</Button>
								</CardFooter>
							</Card>
						))
					) : (
						<p>No freelancers found for this category.</p>
					)}
				</div>
			</div>
		</section>
	)
}

export default Category
