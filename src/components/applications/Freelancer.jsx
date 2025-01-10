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
	const [applications, setApplications] = useState([])

	// Fetch applications
	const fetchApplications = async () => {
		try {
			const response = await fetch(
				'http://localhost:4090/applications/freelancer/list',
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

	// Update application status
	const handleApplicationStatus = async (id, status) => {
		try {
			const response = await fetch(`http://localhost:4090/applications/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
				body: JSON.stringify({ status }),
			})

			if (!response.ok) {
				throw new Error('Failed to update application')
			}

			const updatedApplication = await response.json()
			console.log('Application updated successfully:', updatedApplication)
			fetchApplications() // Refresh applications
		} catch (error) {
			console.error('Error updating application:', error)
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
			accessorKey: 'message',
			header: 'Message',
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
				const application = row.original
				return (
					<Select
						value={application.status}
						onValueChange={(value) =>
							handleApplicationStatus(application._id, value)
						}
					>
						<SelectTrigger className="w-full">
							<SelectValue
								placeholder={
									{
										pending: 'Pending',
										approved: 'Approved',
										rejected: 'Rejected',
									}[application.status] || 'Unknown'
								}
							/>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="pending">Pending</SelectItem>
							<SelectItem value="approved">Approved</SelectItem>
							<SelectItem value="rejected">Rejected</SelectItem>
						</SelectContent>
					</Select>
				)
			},
		},
	]

	// Initialize table with sorting, filtering, and pagination
	const table = useReactTable({
		data: applications,
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
		fetchApplications()
	}, [])

	return (
		<div>
			<div className="flex items-center justify-end ml-auto py-4">
				<Input
					placeholder="Filter applications..."
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
									No applications found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between mt-4">
				<div className="text-sm text-muted-foreground">
					{table.getRowModel().rows.length} application(s) listed.
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
