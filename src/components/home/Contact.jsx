'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { AlertTitle, AlertDescription } from '../ui/alert'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'

const contactFormSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email address'),
	subject: z.string().min(1, 'Subject is required'),
	message: z.string().min(10, 'Message must be at least 10 characters'),
})

const Contact = () => {
	const form = useForm({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			name: '',
			email: '',
			subject: '',
			message: '',
		},
	})

	const onSubmit = async (data) => {
		try {
			const response = await fetch('http://localhost:4090/contactUs/new', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) throw new Error('Failed to send inquiry')

			alert('Your inquiry has been sent successfully!')
			form.reset()
		} catch (error) {
			console.error('Error submitting form:', error)
			alert('Something went wrong. Please try again.')
		}
	}

	return (
		<section id="contact" className="my-32">
			<div className="flex flex-col gap-4">
				<h1 className="font-bold text-5xl text-[#404145]">Get in Touch</h1>
				<p className="font-normal text-xl text-[#62646A]">
					Have any questions or need help? Contact us!
				</p>
			</div>

			<div className="my-14 w-1/2 ml-auto">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Your name"
											className="p-3 rounded-xl text-sm placeholder:text-sm placeholder:text-[#62646A] bg-[#317242] bg-opacity-10"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="email"
											placeholder="Your email"
											className="p-3 rounded-xl text-sm placeholder:text-sm placeholder:text-[#62646A] bg-[#317242] bg-opacity-10"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="subject"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Subject"
											className="p-3 rounded-xl text-sm placeholder:text-sm placeholder:text-[#62646A] bg-[#317242] bg-opacity-10"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="message"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<textarea
											className="border w-full p-3 rounded-xl text-sm placeholder:text-sm placeholder:text-[#62646A] bg-[#317242] bg-opacity-10"
											placeholder="Your message"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="bg-[#57CB76] hover:bg-[#264201] rounded-xl"
						>
							Submit
						</Button>
					</form>
				</Form>
			</div>
		</section>
	)
}

export default Contact
