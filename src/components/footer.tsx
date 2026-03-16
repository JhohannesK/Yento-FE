import { Link } from 'react-router-dom';

const Footer = () => {
	return (
		<footer className="w-full py-6 bg-background">
			<div className="container px-4 sm:px-6 max-w-6xl mx-auto">
				<div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
					<div className="space-y-2">
						<h3 className="text-lg font-semibold">Shop</h3>
						<ul className="space-y-1">
							<li>
								<Link
									to="#"
									className="text-sm hover:underline"
								>
									New Arrivals
								</Link>
							</li>
							<li>
								<Link
									to="#"
									className="text-sm hover:underline"
								>
									Best Sellers
								</Link>
							</li>
							<li>
								<Link
									to="#"
									className="text-sm hover:underline"
								>
									Sale
								</Link>
							</li>
						</ul>
					</div>
					<div className="space-y-2">
						<h3 className="text-lg font-semibold">About</h3>
						<ul className="space-y-1">
							<li>
								<Link
									to="#"
									className="text-sm hover:underline"
								>
									Our Story
								</Link>
							</li>
							<li>
								<Link
									to="#"
									className="text-sm hover:underline"
								>
									Careers
								</Link>
							</li>
							<li>
								<Link
									to="#"
									className="text-sm hover:underline"
								>
									Press
								</Link>
							</li>
						</ul>
					</div>
					<div className="space-y-2">
						<h3 className="text-lg font-semibold">Support</h3>
						<ul className="space-y-1">
							<li>
								<Link
									to="#"
									className="text-sm hover:underline"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									to="#"
									className="text-sm hover:underline"
								>
									Shipping
								</Link>
							</li>
							<li>
								<Link
									to="#"
									className="text-sm hover:underline"
								>
									Returns
								</Link>
							</li>
						</ul>
					</div>
					<div className="space-y-2">
						<h3 className="text-lg font-semibold">Contact</h3>
						<ul className="space-y-1">
							<li>
								<Link
									to="#"
									className="text-sm hover:underline"
								>
									Email
								</Link>
							</li>
							<li>
								<Link
									to="#"
									className="text-sm hover:underline"
								>
									Phone
								</Link>
							</li>
							<li>
								<Link
									to="#"
									className="text-sm hover:underline"
								>
									Live Chat
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 sm:pt-8 mt-6 sm:mt-8 border-t">
					<p className="text-sm text-muted-foreground text-center sm:text-left">
						© {new Date().getFullYear()} Yeton. All rights reserved.
					</p>
					<div className="flex flex-wrap justify-center sm:justify-end gap-4">
						<Link
							to="/"
							className="text-muted-foreground hover:text-foreground"
						>
							Terms
						</Link>
						<Link
							to="/"
							className="text-muted-foreground hover:text-foreground"
						>
							Privacy
						</Link>
						<Link
							to="/"
							className="text-muted-foreground hover:text-foreground"
						>
							Cookies
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
