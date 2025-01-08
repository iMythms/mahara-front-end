import React from 'react'

const Footer = () => {
	const currentYear = new Date().getFullYear()

	return (
		<section className="bg-[#ECF2EE] py-8 rounded-t-3xl flex items-center justify-center">
			<h1 className="font-medium text-base text-[#62646A]">
				© {currentYear} mahara. All rights reserved.
			</h1>
		</section>
	)
}

export default Footer
