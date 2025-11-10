// Components/WorkCard.js
import PropTypes from "prop-types";
import {
  Card,
  CardTitle,
  CardSubtitle,
  Label,
  Description,
  NoLabels,
} from "./styles";

export default function WorkCard({ title, author, date, labels, description }) {
  return (
    <Card className="shadow-sm mb-4">
      <div className="card-body">
        {/* Título */}
        <CardTitle className="card-title mb-2">{title}</CardTitle>

        {/* Autor e Data */}
        <CardSubtitle className="card-subtitle text-muted mb-3">
          {author} • {new Date(date).toLocaleDateString("pt-BR")}
        </CardSubtitle>

        {/* Labels */}
        <div className="mb-3">
          {labels && labels.length > 0 ? (
            labels.map((label, i) => <Label key={i}>{label}</Label>)
          ) : (
            <NoLabels>Sem temas definidos</NoLabels>
          )}
        </div>

        {/* Descrição */}
        <Description className="card-text">{description}</Description>
      </div>
    </Card>
  );
}

WorkCard.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string),
  description: PropTypes.string.isRequired,
};
