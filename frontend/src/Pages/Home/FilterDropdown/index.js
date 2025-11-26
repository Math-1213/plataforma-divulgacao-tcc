import { useState, useEffect } from "react";
import { DropdownWrapper } from "../styles";
import { FaCaretDown } from "react-icons/fa";

export default function FilterDropdown({ onFilterChange, closeTrigger }) {
  const filterOptions = ["Autor", "Curso"];
  const [open, setOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(filterOptions);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Fecha dropdown quando o Header dispara o trigger
  useEffect(() => {
    if (closeTrigger) setOpen(false);
  }, [closeTrigger]);

  // Dispara o retorno para o pai
  function emitChange(updatedFilters, updatedRange) {
    if (onFilterChange) {
      onFilterChange({
        filters: updatedFilters,
        dateRange: updatedRange,
      });
    }
  }

  function toggleFilter(filter) {
    const updated = selectedFilters.includes(filter)
      ? selectedFilters.filter((f) => f !== filter)
      : [...selectedFilters, filter];

    setSelectedFilters(updated);
    emitChange(updated, dateRange);
  }

  function handleDateChange(e) {
    const { name, value } = e.target;
    const updatedRange = { ...dateRange, [name]: value };

    setDateRange(updatedRange);
    emitChange(selectedFilters, updatedRange);
  }

  function clearFilters() {
    const resetFilters = filterOptions;
    const resetRange = { start: "", end: "" };

    setSelectedFilters(resetFilters);
    setDateRange(resetRange);
    emitChange(resetFilters, resetRange);
  }

  return (
    <DropdownWrapper>
      <button
        type="button"
        className="dropdown-btn"
        onClick={() => setOpen(!open)}
      >
        <div>
          <span style={{ fontSize: 16, color: "white" }}>Filtros</span>
          <FaCaretDown size={20} color="white" />
        </div>
      </button>

      {open && (
        <div className="dropdown-menu">
          {/* Filtro por tipo */}
          <div className="filter-section">
            <p className="section-title">Filtrar por:</p>
            {filterOptions.map((filter) => (
              <label key={filter}>
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(filter)}
                  onChange={() => toggleFilter(filter)}
                />
                {filter}
              </label>
            ))}
          </div>

          <hr />

          {/* Filtro por data */}
          <div className="filter-section">
            <p className="section-title">Data de Publicação</p>
            <div className="date-range">
              <input
                type="date"
                name="start"
                value={dateRange.start}
                onChange={handleDateChange}
              />
              <span>até</span>
              <input
                type="date"
                name="end"
                value={dateRange.end}
                onChange={handleDateChange}
              />
            </div>
          </div>

          <hr />

          <button className="clear-btn" type="button" onClick={clearFilters}>
            Limpar filtros
          </button>
        </div>
      )}
    </DropdownWrapper>
  );
}
