'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '../components/ui/carousel'

const FreelancerPortfolio = ({ user }) => {
	const { id: freelancerId } = useParams()
	const [portfolio, setPortfolio] = useState([])
	const [freelancer, setFreelancer] = useState(null)
	const navigate = useNavigate()

	const isOwner = user?._id === freelancerId // Check if the logged-in user is the freelancer

	// Fetch freelancer portfolio
	const fetchPortfolio = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACK_END_URL}/gallery/${freelancerId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				}
			)
			if (!response.ok) throw new Error('Failed to fetch portfolio')
			const data = await response.json()
			setPortfolio(data || [])
		} catch (error) {
			console.error('Error fetching portfolio:', error)
		}
	}

	// Fetch freelancer details
	const fetchFreelancer = async () => {
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
			setFreelancer(data || null)
		} catch (error) {
			console.error('Error fetching freelancer:', error)
		}
	}

	useEffect(() => {
		if (freelancerId) {
			fetchPortfolio()
			fetchFreelancer()
		}
	}, [freelancerId])

	const handleAddProject = () => {
		navigate(`/freelancer/add-project`)
	}

	const handleDeleteProject = async (projectId) => {
		if (!confirm('Are you sure you want to delete this project?')) return

		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACK_END_URL}/gallery/${projectId}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				}
			)

			if (!response.ok) {
				throw new Error('Failed to delete the project.')
			}

			alert('Project deleted successfully!')
			// Remove the deleted project from the portfolio list
			setPortfolio((prevPortfolio) =>
				prevPortfolio.filter((project) => project._id !== projectId)
			)
		} catch (error) {
			console.error('Error deleting project:', error)
			alert('Failed to delete project. Please try again.')
		}
	}

	const handleAddToWishlist = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACK_END_URL}/wishlist/add`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
					body: JSON.stringify({ freelancerId }),
				}
			)
			if (!response.ok) throw new Error('Failed to add freelancer to wishlist')
			alert('Freelancer added to wishlist successfully!')
		} catch (error) {
			console.error('Error adding freelancer to wishlist:', error)
			alert('Failed to add freelancer to wishlist. Please try again.')
		}
	}

	// Render content
	if (!freelancer) {
		return <p className="text-center mt-16">Loading freelancer details...</p>
	}

	return (
		<section className="my-48 container mx-auto">
			{/* Freelancer's Info */}
			<div className="flex items-center mb-8">
				{/* Avatar */}
				<Avatar className="h-24 w-24">
					{freelancer?.profilePicture ? (
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

			{/* Actions */}
			<div className="my-8 flex justify-end space-x-4">
				{/* Add Project for Freelancer */}
				{isOwner ? (
					<Button onClick={handleAddProject}>Add Project</Button>
				) : (
					<>
						{/* Add to Wishlist for Clients */}
						{/* <Button onClick={handleAddToWishlist}>Add to Wishlist</Button> */}
						{/* Request Service for Clients */}
						<Button
							onClick={() =>
								navigate(`/applications/new?freelancerId=${freelancerId}`)
							}
						>
							Request Service
						</Button>
					</>
				)}
			</div>

			{/* Portfolio Grid */}
			<div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
				{portfolio.map((project) => (
					<div
						key={project._id}
						className="p-6 md:p-8 rounded-3xl md:rounded-2xl flex flex-col justify-start items-start gap-8 border"
					>
						{/* Project Title */}
						<div className="self-stretch text-2xl lg:text-3xl font-bold leading-loose">
							{project.projectName}
						</div>

						{/* Project Description */}
						<div className="self-stretch text-left text-base font-normal leading-snug">
							{project.description}
						</div>

						{/* Project Images (Carousel) */}
						{project.images && project.images.length > 0 && (
							<div className="mt-auto w-full relative">
								<Carousel className="max-w-full h-48">
									<CarouselContent>
										{project.images.map((image, index) => (
											<CarouselItem key={index}>
												<img
													src={image}
													alt={`Project Image ${index + 1}`}
													className="object-contain w-full h-48 rounded-md"
												/>
											</CarouselItem>
										))}
									</CarouselContent>
									<CarouselPrevious />
									<CarouselNext />
								</Carousel>
							</div>
						)}

						{/* Edit/Delete Buttons for Freelancer */}
						{isOwner && (
							<div className="flex justify-between mt-2 gap-2 ml-auto">
								<Button
									onClick={() =>
										navigate(`/freelancer/edit-project/${project._id}`)
									}
								>
									Edit
								</Button>
								<Button
									variant="destructive"
									onClick={() => handleDeleteProject(project._id)}
								>
									Delete
								</Button>
							</div>
						)}
					</div>
				))}
			</div>
		</section>
	)
}

export default FreelancerPortfolio
