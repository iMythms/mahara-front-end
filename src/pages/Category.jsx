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
				`${
					import.meta.env.VITE_BACK_END_URL
				}/user/freelancers/category?category=${encodeURIComponent(category)}`, // Ensure category is encoded properly
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
		<section className="mt-48 mb-32">
			<div className="container mx-auto">
				<h1 className="text-2xl font-medium mb-10">
					Freelancers in <span className="font-bold">{category}</span>
				</h1>
				<div className="flex flex-col gap-6">
					{freelancers.length > 0 ? (
						freelancers.map((freelancer) => (
							<Card
								key={freelancer._id}
								className="grid grid-cols-6 border shadow-sm hover:shadow-md transition-shadow duration-300"
							>
								<CardHeader className="col-span-1 flex items-start justify-start mr-auto">
									<img
										src={
											freelancer.profilePicture ||
											'https://via.placeholder.com/150'
										}
										alt={`${freelancer.name}'s profile`}
										className="w-full h-48 object-contain rounded-lg"
									/>
								</CardHeader>
								<CardContent className="col-span-4 flex flex-col justify-center p-4">
									<h2 className="text-2xl font-bold truncate">
										{freelancer.name}
									</h2>

									<p className="text-sm text-gray-500 mt-2">
										Rating: {freelancer.averageRating || 0} / 5
									</p>
								</CardContent>
								<CardFooter className="col-span-1 flex justify-end items-end p-4">
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
						<p className="col-span-full text-center text-gray-500">
							No freelancers found for this category.
						</p>
					)}
				</div>
			</div>
		</section>
	)
}

export default Category
