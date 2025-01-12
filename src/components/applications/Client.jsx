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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table'
import { Input } from '../ui/input'

const Client = () => {
	const [applications, setApplications] = useState([])

	// Fetch applications
	const fetchApplications = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACK_END_URL}/applications/client/list`,
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
			accessorKey: 'freelancerId.name',
			header: 'Freelancer',
			cell: ({ row }) => row.original.freelancerId?.name || 'Unknown',
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				const application = row.original
				return (
					<div className="text-sm text-gray-600">
						{{
							pending: 'Pending',
							approved: 'Approved',
							rejected: 'Rejected',
						}[application.status] || 'Unknown'}
					</div>
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

export default Client
