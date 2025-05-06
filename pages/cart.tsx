import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Cart from '../components/Cart'
import PageHeader from '../components/layout/PageHeader'

export default function CartPage() {
  const router = useRouter()
  const { packageId, hours, userId, date, time, coach, message, fromBooking, coachingFee, bookingId } = router.query
  
  // Parse booking details from query parameters
  const bookingDetails = {
    packageId: packageId ? parseInt(packageId as string, 10) : undefined,
    hours: hours ? parseInt(hours as string) : 1,
    userId: userId as string || '',
    date: date as string || '',
    time: time as string || '',
    coach: coach as string || 'none',
    message: message as string || '',
    coachingFee: coachingFee ? parseFloat(coachingFee as string) : undefined,
    bookingId: bookingId ? parseInt(bookingId as string, 10) : undefined
  }

  return (
    <>
      <Head>
        <title>SimStudio - Cart</title>
      </Head>
      
      <PageHeader 
        title="Simulator Hours - Checkout"
        subtitle="Review your booking details and complete your purchase"
        useCarbonBg={false}
      />
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex justify-end">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Back to Bookings
              </Link>
            </div>
            
            <Cart bookingDetails={bookingDetails} />
          </div>
        </div>
      </section>
    </>
  )
}
