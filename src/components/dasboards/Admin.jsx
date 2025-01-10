import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

const Admin = () => {
	const [applications, setApplications] = useState([])
	const [jobs, setJobs] = useState([])
	const navigate = useNavigate()

	// Fetch all applications
	const fetchApplications = async () => {
		try {
			const response = await fetch(
				`http://localhost:4090/applications/admin/list`,
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

	// Fetch all jobs
	const fetchJobs = async () => {
		try {
			const response = await fetch(`http://localhost:4090/jobs/list/admin`, {
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
				<h1 className="text-2xl font-bold text-[#404145] mb-6">
					Admin Dashboard
				</h1>

				{/* Applications */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>All Applications</CardTitle>
					</CardHeader>
					<CardContent>
						{applications.length > 0 ? (
							<div>
								{applications.slice(0, 5).map((application) => (
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
												To: {application.freelancerId?.name || 'Unknown'}
											</p>
											<p className="text-sm text-gray-500">
												From: {application.clientId?.name || 'Unknown'}
											</p>
										</div>
									</div>
								))}
								<Button
									onClick={() => navigate('/admin/applications')}
									variant="outline"
									className="mt-4"
								>
									View All Applications
								</Button>
							</div>
						) : (
							<p>No applications available</p>
						)}
					</CardContent>
				</Card>

				{/* Jobs */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>All Jobs</CardTitle>
					</CardHeader>
					<CardContent>
						{jobs.length > 0 ? (
							<div>
								{jobs.slice(0, 5).map((job) => (
									<div
										key={job._id}
										className="flex items-center justify-between mb-4"
									>
										<div className="p-4 border w-full rounded-xl">
											<h2 className="text-lg font-medium">{job.title}</h2>
											<p>{job.description}</p>
											<p className="text-sm text-gray-500">
												Status:{' '}
												{{
													todo: 'To Do',
													in_progress: 'In Progress',
													complete: 'Complete',
												}[job.status] || 'Unknown'}
											</p>
											<p className="text-sm text-gray-500">
												Client: {job.clientId?.name || 'Unknown'}
											</p>
											<p className="text-sm text-gray-500">
												Freelancer: {job.freelancerId?.name || 'Unknown'}
											</p>
										</div>
									</div>
								))}
								<Button
									onClick={() => navigate('/admin/jobs')}
									variant="outline"
									className="mt-4"
								>
									View All Jobs
								</Button>
							</div>
						) : (
							<p>No jobs available</p>
						)}
					</CardContent>
				</Card>
			</div>
		</section>
	)
}

export default Admin
