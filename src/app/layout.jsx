'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { TestProvider } from '@/contexts/TestContext';
import MainNavigation from '@/components/MainNavigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingScreen from '@/components/LoadingScreen';
import NotificationSystem from '@/components/NotificationSystem';
import ConnectionStatus from '@/components/ui/ConnectionStatus';
import TestModeToggle from '@/components/TestModeToggle';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider>
          <TestProvider>
            <AppProvider>
              <ProtectedRoute>
                <MainNavigation>
                  {children}
                </MainNavigation>
                <NotificationSystem />
                <TestModeToggle />
                <div className="fixed bottom-4 right-4 z-40">
                  <ConnectionStatus />
                </div>
              </ProtectedRoute>
            </AppProvider>
          </TestProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 