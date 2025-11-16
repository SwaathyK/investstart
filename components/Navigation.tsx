'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, LogOut, User, ChevronDown, UserCircle, Menu, X } from 'lucide-react'

export default function Navigation() {
	const router = useRouter()
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const profileMenuRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		// Check login status from localStorage
		const checkLoginStatus = () => {
			const loggedIn = localStorage.getItem('brokee_logged_in') === 'true'
			setIsLoggedIn(loggedIn)
		}

		// Only check on client side
		if (typeof window !== 'undefined') {
			checkLoginStatus()

			// Listen for storage changes (in case user logs in/out in another tab)
			window.addEventListener('storage', checkLoginStatus)
			
			// Listen for custom login/logout events
			window.addEventListener('loginStatusChanged', checkLoginStatus)

			return () => {
				window.removeEventListener('storage', checkLoginStatus)
				window.removeEventListener('loginStatusChanged', checkLoginStatus)
			}
		}
	}, [])

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
				setIsProfileMenuOpen(false)
			}
		}

		if (isSidebarOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}

		if (isProfileMenuOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isProfileMenuOpen, isSidebarOpen])

	const handleLogout = () => {
		localStorage.removeItem('brokee_logged_in')
		setIsLoggedIn(false)
		// Trigger custom event for navigation update
		window.dispatchEvent(new Event('loginStatusChanged'))
		router.push('/')
		router.refresh()
	}

	return (
		<nav className="container mx-auto px-4 py-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-3">
					{/* Mobile menu trigger */}
					<button
						className="md:hidden p-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100"
						aria-label="Open menu"
						onClick={() => setIsSidebarOpen(true)}
					>
						<Menu className="h-5 w-5" />
					</button>
					<Link href="/" className="flex items-center space-x-2">
						<TrendingUp className="h-8 w-8 text-primary-600" />
						<span className="text-2xl font-bold text-gray-900">Brokee</span>
					</Link>
				</div>

				{/* Right side actions / links */}
				<div className="hidden md:flex items-center space-x-6">
					<Link href="/courses" className="text-gray-700 hover:text-primary-600 transition-colors">
						Courses
					</Link>
					{isLoggedIn && (
						<Link href="/competitions" className="text-gray-700 hover:text-primary-600 transition-colors">
							Competitions
						</Link>
					)}
					{!isLoggedIn && (
						<Link href="/features" className="text-gray-700 hover:text-primary-600 transition-colors">
							Features
						</Link>
					)}
					{isLoggedIn ? (
						<>
							<Link href="/simulation" className="text-gray-700 hover:text-primary-600 transition-colors">
								Simulation
							</Link>
							<Link 
								href="/dashboard" 
								className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1"
							>
								<User className="h-4 w-4" />
								<span>Dashboard</span>
							</Link>
							{/* Profile Menu */}
							<div className="relative" ref={profileMenuRef}>
								<button
									onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
									className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
								>
									<UserCircle className="h-4 w-4" />
									<span>Profile</span>
									<ChevronDown className={`h-4 w-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
								</button>
								{isProfileMenuOpen && (
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
										<button
											onClick={() => {
												setIsProfileMenuOpen(false)
												router.push('/profile/avatar')
											}}
											className="w-full text-left px  -4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
										>
											<UserCircle className="h-4 w-4" />
											<span>Create an avatar</span>
										</button>
										<button
											onClick={() => {
												setIsProfileMenuOpen(false)
												handleLogout()
											}}
											className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
										>
											<LogOut className="h-4 w-4" />
											<span>Logout</span>
										</button>
									</div>
								)}
							</div>
						</>
					) : (
						<>
							<Link href="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
								Login
							</Link>
							<Link 
								href="/signup" 
								className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
							>
								Get Started
							</Link>
						</>
					)}
				</div>

				{/* On mobile, keep a visible Dashboard shortcut when logged in */}
				{isLoggedIn && (
					<Link 
						href="/dashboard" 
						className="md:hidden inline-flex items-center space-x-2 text-gray-800 font-semibold"
					>
						<User className="h-5 w-5" />
						<span>Dashboard</span>
					</Link>
				)}
			</div>

			{/* Mobile Sidebar Drawer */}
			{isSidebarOpen && (
				<div className="fixed inset-0 z-50">
					{/* Backdrop */}
					<div 
						className="absolute inset-0 bg-black/40 backdrop-blur-sm"
						onClick={() => setIsSidebarOpen(false)}
					/>
					{/* Drawer */}
					<aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl border-r border-gray-200 transform transition-transform duration-300 translate-x-0">
						<div className="flex items-center justify-between p-4 border-b border-gray-200">
							<div className="flex items-center space-x-2">
								<TrendingUp className="h-6 w-6 text-primary-600" />
								<span className="font-semibold text-gray-900">Menu</span>
							</div>
							<button className="p-2 rounded-md hover:bg-gray-100" aria-label="Close menu" onClick={() => setIsSidebarOpen(false)}>
								<X className="h-5 w-5" />
							</button>
						</div>
						<nav className="p-4 space-y-2">
							<Link href="/profile/avatar" onClick={() => setIsSidebarOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-800">
								<UserCircle className="h-5 w-5" />
								<span>Profile</span>
							</Link>
							<Link href="/simulation" onClick={() => setIsSidebarOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-800">
								<span>Simulation</span>
							</Link>
							<Link href="/courses" onClick={() => setIsSidebarOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-800">
								<span>Courses</span>
							</Link>
							<Link href="/competitions" onClick={() => setIsSidebarOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-800">
								<span>Competitions</span>
							</Link>
						</nav>
					</aside>
				</div>
			)}
		</nav>
	)
}

