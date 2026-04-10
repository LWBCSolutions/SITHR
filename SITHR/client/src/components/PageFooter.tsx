import { Link } from 'react-router-dom';

export default function PageFooter() {
  return (
    <footer className="page-footer">
      <div className="page-footer__inner">
        <span className="page-footer__copyright">
          &copy; 2026 LWBC Solutions Ltd. Company No. 16771338.
        </span>
        <div className="page-footer__links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Use</Link>
          <Link to="/acceptable-use">Acceptable Use</Link>
        </div>
        <span className="page-footer__tagline">
          Employment law guidance for workplace management.
        </span>
      </div>
    </footer>
  );
}
