import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '../ui/select'
import { Button } from '../ui/button'

const Freelancer = () => {
	const [applications, setApplication] = useState([])
	const [ongoingJobs, setOngoingJobs] = useState([])
	const navigate = useNavigate()

	// Fetch pending applications
	const fetchApplication = async () => {
		try {
			const response = await fetch(
				`http://localhost:4090/applications/freelancer/list?status=pending`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				}
			)
			const data = await response.json()
			setApplication(data || []) // Assign directly if there's no `applications` field
		} catch (error) {
			console.error('Error fetching applications:', error)
		}
	}

	// Fetch ongoing jobs
	const fetchJobs = async () => {
		try {
			const response = await fetch(`http://localhost:4090/jobs/list`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			})
			const data = await response.json()

			// Filter jobs with status 'todo' or 'in_progress'
			const filteredJobs = data.filter((job) =>
				['todo', 'in_progress'].includes(job.status)
			)

			setOngoingJobs(filteredJobs || [])
		} catch (error) {
			console.error('Error fetching jobs:', error)
		}
	}

	// Approve or Reject applications
	const handleApplicationStatus = async (id, status) => {
		try {
			const response = await fetch(`http://localhost:4090/applications/${id}`, {
				method: 'PUT', // Correct HTTP method
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
				body: JSON.stringify({ status }), // Pass the status in the request body
			})

			if (!response.ok) {
				const errorData = await response.json()
				console.error('Error updating application:', errorData.error)
				throw new Error(errorData.error || 'Failed to update application')
			}

			const data = await response.json()
			console.log('Application updated successfully:', data)

			// Re-fetch applications to refresh UI
			fetchApplication()
			fetchJobs() // Check for new jobs
		} catch (error) {
			console.error('Error updating application:', error.message)
		}
	}

	// Update job status
	const handleJobStatusUpdate = async (jobId, status) => {
		try {
			const response = await fetch(`http://localhost:4090/jobs/${jobId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
				body: JSON.stringify({ status }),
			})

			if (!response.ok) {
				throw new Error(`Failed to update job status: ${response.statusText}`)
			}

			const updatedJob = await response.json()
			console.log('Job status updated:', updatedJob)

			// Re-fetch jobs to refresh the UI
			fetchJobs()
		} catch (error) {
			console.error('Error updating job status:', error)
		}
	}

	useEffect(() => {
		fetchApplication()
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

				{/* Application Notifications */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>New Applications</CardTitle>
					</CardHeader>
					<CardContent>
						{applications?.length > 0 ? (
							<div>
								{applications.slice(0, 2).map(
									(
										application // Limit to 2 applications
									) => (
										<div
											key={application._id}
											className="flex items-center justify-between mb-4 p-4 border w-full rounded-xl"
										>
											<div>
												<h2 className="text-lg font-medium">
													{application.title}
												</h2>
												<p>{application.message}</p>
												<p className="text-sm text-gray-500">
													by {application.clientId?.name || 'Unknown'}
												</p>
											</div>
											<div className="space-x-2">
												<Button
													variant="success"
													className="bg-[#1DBF73] hover:bg-opacity-90 text-white"
													onClick={() =>
														handleApplicationStatus(application._id, 'approved')
													}
												>
													Approve
												</Button>
												<Button
													variant="destructive"
													onClick={() =>
														handleApplicationStatus(application._id, 'rejected')
													}
												>
													Reject
												</Button>
											</div>
										</div>
									)
								)}
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

				{/* Ongoing Jobs */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Ongoing Jobs</CardTitle>
					</CardHeader>
					<CardContent>
						{ongoingJobs.length > 0 ? (
							<div>
								{ongoingJobs.slice(0, 2).map(
									(
										job // Limit to 2 jobs
									) => (
										<div
											key={job._id}
											className="flex items-center justify-between mb-4 p-4 border w-full rounded-xl"
										>
											<div>
												<h2 className="text-lg font-medium">{job.title}</h2>
												<p>{job.description}</p>
												<p className="text-sm text-gray-500">
													by {job.clientId?.name || 'Unknown'}
												</p>
											</div>
											<Select
												onValueChange={(value) =>
													handleJobStatusUpdate(job._id, value)
												}
											>
												<SelectTrigger className="w-[180px]">
													<SelectValue
														placeholder={
															{
																todo: 'To Do',
																in_progress: 'In Progress',
																complete: 'Complete',
															}[job.status] || 'Unknown'
														}
													/>
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="todo">To Do</SelectItem>
													<SelectItem value="in_progress">
														In Progress
													</SelectItem>
													<SelectItem value="complete">Complete</SelectItem>
												</SelectContent>
											</Select>
										</div>
									)
								)}
								<Button
									onClick={() => navigate('/jobs')}
									variant="outline"
									className="mt-4"
								>
									View All Jobs
								</Button>
							</div>
						) : (
							<p>No ongoing jobs</p>
						)}
					</CardContent>
				</Card>
			</div>
		</section>
	)
}

export default Freelancer
