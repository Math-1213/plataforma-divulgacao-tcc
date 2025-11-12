import { useState, useEffect } from "react";
import { DropdownWrapper } from "../styles";
import { FaCaretDown } from "react-icons/fa";

export default function FilterDropdown({ onFilterChange, closeTrigger }) {
  const filterOptions = ["Autor", "Curso", "Tema"];
  const [open, setOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(filterOptions);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Fecha dropdown quando "Buscar" for clicado no Header
  useEffect(() => {
    if (closeTrigger) setOpen(false);
  }, [closeTrigger]);

  function toggleFilter(filter) {
    const updated = selectedFilters.includes(filter)
      ? selectedFilters.filter((f) => f !== filter)
      : [...selectedFilters, filter];
    setSelectedFilters(updated);
    if (onFilterChange) onFilterChange({ filters: updated, dateRange });
  }

  function handleDateChange(e) {
    const { name, value } = e.target;
    const updatedRange = { ...dateRange, [name]: value };
    setDateRange(updatedRange);
    if (onFilterChange)
      onFilterChange({ filters: selectedFilters, dateRange: updatedRange });
  }

  function clearFilters() {
    setSelectedFilters(filterOptions);
    setDateRange({ start: "", end: "" });
    if (onFilterChange)
      onFilterChange({
        filters: filterOptions,
        dateRange: { start: "", end: "" },
      });
  }

  return (
    <DropdownWrapper>
      <button
        type="button"
        className="dropdown-btn"
        onClick={() => setOpen(!open)}
      >
        <div>
          <span style={{fontSize: 16, color:"white"}}>
            Filtros
          </span>
          <FaCaretDown size={20} color="white" />
        </div>
      </button>

      {open && (
        <div className="dropdown-menu">
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
