import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-display font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-display font-bold text-gray-900 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-4 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center">
          <Home className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
