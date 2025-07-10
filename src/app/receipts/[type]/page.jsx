'use client';

import ReceiptForm from '../../../components/ReceiptForm';

export default function ReceiptPage({ params }) {
  const { type } = params;

  return <ReceiptForm receiptType={type} />;
} 