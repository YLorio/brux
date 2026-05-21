import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute, LoginPage, OnboardingPage } from '@features/auth';
import { AppLayout } from './layouts/AppLayout';
import { RouteFallback } from './components/RouteFallback';

const DashboardPage = lazy(() =>
  import('@features/wallet').then((m) => ({ default: m.DashboardPage })),
);
const SendPage = lazy(() => import('@features/send').then((m) => ({ default: m.SendPage })));
const PaymentsPage = lazy(() =>
  import('@features/payments').then((m) => ({ default: m.PaymentsPage })),
);
const PaymentDetailPage = lazy(() =>
  import('@features/payments').then((m) => ({ default: m.PaymentDetailPage })),
);
const AdminPage = lazy(() => import('@features/admin').then((m) => ({ default: m.AdminPage })));
const ApiPage = lazy(() =>
  import('@features/api-explorer').then((m) => ({ default: m.ApiPage })),
);
const CardsPage = lazy(() => import('@features/cards').then((m) => ({ default: m.CardsPage })));
const SettingsPage = lazy(() =>
  import('@features/settings').then((m) => ({ default: m.SettingsPage })),
);
const LandingPage = lazy(() =>
  import('@features/landing').then((m) => ({ default: m.LandingPage })),
);

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/enviar" element={<SendPage />} />
            <Route path="/movimientos" element={<PaymentsPage />} />
            <Route path="/movimientos/:id" element={<PaymentDetailPage />} />
            <Route path="/cartera" element={<CardsPage />} />
            <Route path="/configuracion" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/api" element={<ApiPage />} />
          </Route>
        </Route>

        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
