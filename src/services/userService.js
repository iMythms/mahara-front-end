import client from './config'

export const getProfile = async () => {
	const response = await client.get('/user/profile')
	return response.data
}
