import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <EmptyState
        title="Halaman tidak ditemukan"
        description="Tautan yang Anda buka mungkin sudah dihapus atau salah ketik."
      >
        <Link to="/" className="button button--primary">Kembali ke Beranda</Link>
      </EmptyState>
    </div>
  );
}

export default NotFoundPage;
