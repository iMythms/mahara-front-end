import client from './config'

export const getProfile = async () => {
	try {
		const response = await client.get('/user/profile')
		return response.data.user // Access the `user` property
	} catch (error) {
		console.error(
			'Error fetching profile:',
			error.response?.data || error.message
		)
		throw error // Propagate the error for higher-level handling
	}
}
