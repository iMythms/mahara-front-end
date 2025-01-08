import './App.css'
import React, { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
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
			setUser(null)
			console.log(error)
		}
	}

	const logOut = () => {
		localStorage.removeItem('authToken')
		setUser(null)
	}

	useEffect(() => {
		getUserProfile()
	}, [])

	return (
		<div>
			<main>
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
		</div>
	)
}

export default App
