'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import MainNavigation from '@/components/MainNavigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingScreen from '@/components/LoadingScreen';
import NotificationSystem from '@/components/NotificationSystem';
import ConnectionStatus from '@/components/ui/ConnectionStatus';
import DocumentationHelpPanel from '@/components/DocumentationHelpPanel';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider>
          <AppProvider>
            <ProtectedRoute>
              <MainNavigation>
                {children}
              </MainNavigation>
              <NotificationSystem />
              <div className="fixed bottom-4 right-4 z-40">
                <ConnectionStatus />
              </div>
            </ProtectedRoute>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 