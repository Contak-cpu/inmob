'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Receipt, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { RECEIPT_TYPES } from '@/lib/config';
import { validateReceiptData } from '@/utils/validations';
import ReceiptForm from '../../../components/ReceiptForm';
import PictoNSignature from '@/components/PictoNSignature';

export default function ReceiptPage({ params }) {
  const { type } = params;

  return <ReceiptForm receiptType={type} />;
} 