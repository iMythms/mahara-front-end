'use client'

import React, { useState, useEffect } from 'react'
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { Button } from '../ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table'
import { Input } from '../ui/input'

const Freelancer = () => {
	const [jobs, setJobs] = useState([])

	// Fetch jobs
	const fetchJobs = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACK_END_URL}/jobs/list`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				}
			)
			const data = await response.json()
			setJobs(data || [])
		} catch (error) {
			console.error('Error fetching jobs:', error)
		}
	}

	// Update job status
	const handleJobStatus = async (id, status) => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACK_END_URL}/jobs/${id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
					body: JSON.stringify({ status }),
				}
			)

			if (!response.ok) {
				throw new Error('Failed to update job status')
			}

			const updatedJob = await response.json()
			console.log('Job updated successfully:', updatedJob)
			fetchJobs() // Refresh jobs
		} catch (error) {
			console.error('Error updating job status:', error)
		}
	}

	// Define columns for the data table
	const columns = [
		{
			accessorKey: 'title',
			header: 'Title',
			cell: ({ row }) => (
				<div className="font-medium">{row.original.title}</div>
			),
		},
		{
			accessorKey: 'description',
			header: 'Description',
		},
		{
			accessorKey: 'clientId.name',
			header: 'Client',
			cell: ({ row }) => row.original.clientId?.name || 'Unknown',
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				const job = row.original
				return (
					<Select
						value={job.status}
						onValueChange={(value) => handleJobStatus(job._id, value)}
					>
						<SelectTrigger className="w-full">
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
							<SelectItem value="in_progress">In Progress</SelectItem>
							<SelectItem value="complete">Complete</SelectItem>
						</SelectContent>
					</Select>
				)
			},
		},
	]

	// Initialize table with sorting, filtering, and pagination
	const table = useReactTable({
		data: jobs,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			pagination: { pageSize: 10, pageIndex: 0 },
		},
	})

	useEffect(() => {
		fetchJobs()
	}, [])

	return (
		<div>
			<div className="flex items-center justify-end ml-auto py-4">
				<Input
					placeholder="Filter jobs..."
					value={table.getColumn('status')?.getFilterValue() ?? ''}
					onChange={(event) =>
						table.getColumn('status')?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="text-center">
									No jobs found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between mt-4">
				<div className="text-sm text-muted-foreground">
					{table.getRowModel().rows.length} job(s) listed.
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}

export default Freelancer
