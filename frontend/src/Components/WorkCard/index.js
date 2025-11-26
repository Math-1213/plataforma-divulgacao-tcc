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

export default function WorkCard({ title, author, date, tags, description, action }) {
  function formatAuthors() {
    if (!author) return "Autor desconhecido";

    if (Array.isArray(author)) {
      // Array de objetos [{ name }]
      if (author.length === 0) return "Autor desconhecido";
      return author.map((a) => a?.name || "Sem nome").join(", ");
    }

    if (typeof author === "object") return author.name || "Autor desconhecido";

    // string simples
    return author;
  }

  function formatDate() {
    try {
      return new Date(date).toLocaleDateString("pt-BR");
    } catch {
      return "Data indefinida";
    }
  }

  function shortDescription() {
    if (!description) return "Sem descrição disponível.";
    if (description.length <= 180) return description;
    return description.substring(0, 180) + "...";
  }

  return (
    <Card className="shadow-sm mb-4" onClick={action}>
      <div className="card-body">
        {/* Título */}
        <CardTitle className="card-title mb-2">{title}</CardTitle>

        {/* Autor e Data */}
        <CardSubtitle className="card-subtitle text-muted mb-3">
          {formatAuthors()} • {formatDate()}
        </CardSubtitle>

        {/* Tags */}
        {/* <div className="mb-3">
          {tags && tags.length > 0 ? (
            tags.map((tag, i) => <Label key={i}>{tag}</Label>)
          ) : (
            <NoLabels>Nenhuma tag</NoLabels>
          )}
        </div> */}

        {/* Descrição */}
        <Description className="card-text">{shortDescription()}</Description>
      </div>
    </Card>
  );
}

WorkCard.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      })
    ),
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ]),
  date: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  description: PropTypes.string,
};
