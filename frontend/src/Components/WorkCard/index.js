import PropTypes from "prop-types";

export default function WorkCard({ title, author, date, labels, description }) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        {/* Título */}
        <h5 className="card-title mb-2">{title}</h5>

        {/* Autor e Data */}
        <h6 className="card-subtitle text-muted mb-3">
          {author} • {new Date(date).toLocaleDateString("pt-BR")}
        </h6>

        {/* Labels */}
        <div className="mb-3">
          {labels && labels.length > 0 ? (
            labels.map((label, i) => (
              <span key={i} className="badge bg-primary me-2">
                {label}
              </span>
            ))
          ) : (
            <span className="text-muted">Sem temas definidos</span>
          )}
        </div>

        {/* Descrição */}
        <p className="card-text">{description}</p>
      </div>
    </div>
  );
}

WorkCard.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string),
  description: PropTypes.string.isRequired,
};
