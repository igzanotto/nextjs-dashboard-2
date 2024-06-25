'use client';

import React, { useState, useEffect } from 'react';
import { fetchBusinessById } from '@/lib/data';
import SubscriptionButton from '@/components/dashboard/subscription-button';
import MercadoPagoSubscriptionButton from '@/components/dashboard/mp-button';

// Define the type for the business object
interface Business {
  name: string;
  description: string;
}

export default function MyBusinessPage({
  params,
}: {
  params: { business_id: string };
}) {
  const { business_id } = params;
  const [business, setBusiness] = useState<Business | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log(business_id);
    fetchBusinessById(business_id).then(setBusiness).catch(setError);
  }, [business_id]); // Dependency array ensures this only reruns if business_id changes

  if (error) {
    return <div>Error: {error.message}</div>; // Display error message if an error occurred
  }

  if (!business) {
    return <div>Cargando...</div>; // Display a loading state while fetching
  }

  const planId = '2c9380849007284d01904a45f77c10e8'; 

  return (
    <div>
      <h1>{business.name}</h1>
      <p>{business.description}</p>
      {/* <SubscriptionButton /> */}
      <br />
      <br />
      <MercadoPagoSubscriptionButton planId={planId} />
    </div>
  );
}
