import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Cart from '../components/Cart'

export default function CartPage() {
  const router = useRouter()
  const { hours, userId, date, time, coach } = router.query
  
  // Parse booking details from query parameters
  const bookingDetails = {
    hours: hours ? parseInt(hours as string) : 1,
    userId: userId as string || '',
    date: date as string || '',
    time: time as string || '',
    coach: coach as string || 'none'
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Head>
        <title>SimStudio - Cart</title>
      </Head>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Simulator Hours - Checkout</h1>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          Back to Bookings
        </Link>
      </div>
      
      <Cart bookingDetails={bookingDetails} />
    </div>
  )
}
