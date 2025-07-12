'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';
import MainNavigation from '@/components/MainNavigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingScreen from '@/components/LoadingScreen';
import NotificationSystem from '@/components/NotificationSystem';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AppProvider>
          <ProtectedRoute>
            <MainNavigation>
              {children}
            </MainNavigation>
            <NotificationSystem />
          </ProtectedRoute>
        </AppProvider>
      </body>
    </html>
  );
} 