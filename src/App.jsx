import './App.css'
import React, { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Signin from './pages/auth/Signin'
import Signup from './pages/auth/Signup'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import { getProfile } from './services/userService'

const App = () => {
	const [user, setUser] = useState(null)

	const getUserProfile = async () => {
		try {
			const data = await getProfile()
			setUser(data)
		} catch (error) {
			console.error(
				'Error fetching user profile:',
				error.response?.data || error.message
			)
			setUser(null)
		}
	}

	const logOut = () => {
		localStorage.removeItem('authToken')
		setUser(null)
		window.location.href = '/'
	}

	useEffect(() => {
		getUserProfile()
	}, [])

	return (
		<div className="flex flex-col min-h-screen">
			<header>
				<NavBar user={user} logOut={logOut} />
			</header>
			<main className="flex-grow">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/dashboard" element={<Dashboard user={user} />} />
					<Route
						path="/auth/register"
						element={<Signup getUserProfile={getUserProfile} />}
					/>
					<Route
						path="/auth/login"
						element={<Signin getUserProfile={getUserProfile} />}
					/>
				</Routes>
			</main>
			<footer className="container mx-auto mt-auto">
				<Footer />
			</footer>
		</div>
	)
}

export default App
