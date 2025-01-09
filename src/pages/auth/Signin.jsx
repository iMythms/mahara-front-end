'use client'

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '../../components/ui/tabs'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

const Signin = ({ getUserProfile }) => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		role: 'client', // default role
	})
	const [error, setError] = useState('')
	const navigate = useNavigate()

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleRoleSwitch = (role) => {
		setFormData({ ...formData, role })
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')

		try {
			const response = await fetch('http://localhost:4090/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			})

			if (!response.ok) {
				const data = await response.json()
				throw new Error(data.error || 'Login failed')
			}

			const { token } = await response.json()
			localStorage.setItem('authToken', token)

			await getUserProfile()
			navigate('/dashboard') // Redirect to dashboard
		} catch (err) {
			setError(err.message)
		}
	}

	return (
		<div className="container mx-auto my-48">
			<h1 className="text-4xl font-bold mb-8 text-center text-[#023A12]">
				Sign In
			</h1>
			{error && <p className="text-red-600 text-center">{error}</p>}
			<Tabs defaultValue="client" className="w-[400px] mx-auto">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="admin" onClick={() => handleRoleSwitch('admin')}>
						Admin
					</TabsTrigger>
					<TabsTrigger
						value="client"
						onClick={() => handleRoleSwitch('client')}
					>
						Client
					</TabsTrigger>
					<TabsTrigger
						value="freelancer"
						onClick={() => handleRoleSwitch('freelancer')}
					>
						Freelancer
					</TabsTrigger>
				</TabsList>

				{/* Admin */}
				<TabsContent value="admin">
					<Card>
						<CardHeader>
							<CardTitle>Sign in as an Admin</CardTitle>
						</CardHeader>
						<form onSubmit={handleSubmit}>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										name="email"
										type="email"
										value={formData.email}
										onChange={handleChange}
										placeholder="Enter your email"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										name="password"
										type="password"
										value={formData.password}
										onChange={handleChange}
										placeholder="Enter your password"
										required
									/>
								</div>
							</CardContent>
							<CardFooter>
								<Button
									type="submit"
									className="w-full bg-[#57CB76] hover:bg-[#264201] "
								>
									Sign in as Admin
								</Button>
							</CardFooter>
						</form>
					</Card>
				</TabsContent>

				{/* Client */}
				<TabsContent value="client">
					<Card>
						<CardHeader>
							<CardTitle>Sign in as a Client</CardTitle>
						</CardHeader>
						<form onSubmit={handleSubmit}>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										name="email"
										type="email"
										value={formData.email}
										onChange={handleChange}
										placeholder="Enter your email"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										name="password"
										type="password"
										value={formData.password}
										onChange={handleChange}
										placeholder="Enter your password"
										required
									/>
								</div>
							</CardContent>
							<CardFooter>
								<Button
									type="submit"
									className="w-full bg-[#57CB76] hover:bg-[#264201] "
								>
									Sign in as Client
								</Button>
							</CardFooter>
						</form>
					</Card>
				</TabsContent>

				{/* Freelancer */}
				<TabsContent value="freelancer">
					<Card>
						<CardHeader>
							<CardTitle>Sign in as a Freelancer</CardTitle>
						</CardHeader>
						<form onSubmit={handleSubmit}>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										name="email"
										type="email"
										value={formData.email}
										onChange={handleChange}
										placeholder="Enter your email"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										name="password"
										type="password"
										value={formData.password}
										onChange={handleChange}
										placeholder="Enter your password"
										required
									/>
								</div>
							</CardContent>
							<CardFooter>
								<Button
									type="submit"
									className="w-full bg-[#57CB76] hover:bg-[#264201] "
								>
									Sign in as Freelancer
								</Button>
							</CardFooter>
						</form>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default Signin
