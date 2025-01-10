import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

const Client = () => {
	const [applications, setApplications] = useState([])
	const [jobs, setJobs] = useState([])
	const navigate = useNavigate()

	// Fetch applications
	const fetchApplications = async () => {
		try {
			const response = await fetch(
				`http://localhost:4090/applications/client/list`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				}
			)
			const data = await response.json()
			setApplications(data || [])
		} catch (error) {
			console.error('Error fetching applications:', error)
		}
	}

	// Fetch jobs
	const fetchJobs = async () => {
		try {
			const response = await fetch(`http://localhost:4090/jobs/list`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			})
			const data = await response.json()
			setJobs(data || [])
		} catch (error) {
			console.error('Error fetching jobs:', error)
		}
	}

	useEffect(() => {
		fetchApplications()
		fetchJobs()
	}, [])

	return (
		<section className="mt-16 mb-32">
			<div>
				<h1 className="text-2xl font-bold text-[#404145] mb-6">Dashboard</h1>

				{/* Quick Link to Profile for Uploading Projects */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Profile</CardTitle>
					</CardHeader>
					<CardContent>
						<p>Add your latest projects and showcase your work!</p>
						<Button
							onClick={() => navigate('/profile')}
							className="mt-4 flex justify-end items-center ml-auto"
						>
							Go to Profile
						</Button>
					</CardContent>
				</Card>

				{/* Applications */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>New Applications</CardTitle>
					</CardHeader>
					<CardContent>
						{applications.length > 0 ? (
							<div>
								{applications.slice(0, 2).map((application) => (
									<div
										key={application._id}
										className="flex items-center justify-between mb-4"
									>
										<div className="p-4 border w-full rounded-xl">
											<h2 className="text-lg font-medium">
												{application.title}
											</h2>
											<p>{application.message}</p>
											<p className="text-sm text-gray-500">
												to {application.freelancerId?.name || 'Unknown'}
											</p>
										</div>
									</div>
								))}
								<Button
									onClick={() => navigate('/applications')}
									variant="outline"
									className="mt-4"
								>
									View All Applications
								</Button>
							</div>
						) : (
							<p>No new applications</p>
						)}
					</CardContent>
				</Card>

				{/* Jobs */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Active Jobs</CardTitle>
					</CardHeader>
					<CardContent>
						{jobs.length > 0 ? (
							<div>
								{jobs.slice(0, 2).map((job) => (
									<div
										key={job._id}
										className="flex items-center justify-between mb-4"
									>
										<div className="p-4 border w-full rounded-xl">
											<h2 className="text-lg font-medium">{job.title}</h2>
											<p>{job.description}</p>
											<p className="text-sm text-gray-500">
												{{
													todo: 'To Do',
													in_progress: 'In Progress',
													complete: 'Complete',
												}[job.status] || 'Unknown'}
											</p>
										</div>
									</div>
								))}
								<Button
									onClick={() => navigate('/jobs')}
									variant="outline"
									className="mt-4"
								>
									View All Jobs
								</Button>
							</div>
						) : (
							<p>No active jobs</p>
						)}
					</CardContent>
				</Card>
			</div>
		</section>
	)
}

export default Client
