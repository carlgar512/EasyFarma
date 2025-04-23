import React from "react";
import './Paginacion.css'
import { PaginacionProps } from "./PaginacionInterfaces";

const Paginacion: React.FC<PaginacionProps> = ({ paginaActual, totalPaginas, onPageChange }) => {
  const botonesCentrales = Array.from({ length: totalPaginas }, (_, i) => i + 1)
    .filter(
      (num) =>
        num !== 1 &&
        num !== totalPaginas &&
        Math.abs(num - paginaActual) <= 2
    );

  return (
    <div className="paginationWrapper">
      <span className="paginationLabel">Páginas:</span>
      <div className="bigContainer">
        {/* Anterior */}
        <button
          className="paginationButton nav"
          disabled={paginaActual === 1}
          onClick={() => onPageChange(paginaActual - 1)}
        >
          «
        </button>

        {/* Página 1 */}
        <button
          className={`paginationButton ${paginaActual === 1 ? "active" : ""}`}
          onClick={() => onPageChange(1)}
        >
          1
        </button>

        {/* Ellipsis */}
        {paginaActual > 4 && <span className="paginationEllipsis">...</span>}

        {/* Páginas centrales */}
        {botonesCentrales.map((num) => (
          <button
            key={num}
            className={`paginationButton ${paginaActual === num ? "active" : ""}`}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        ))}

        {/* Ellipsis */}
        {paginaActual < totalPaginas - 3 && (
          <span className="paginationEllipsis">...</span>
        )}

        {/* Última página */}
        {totalPaginas > 1 && (
          <button
            className={`paginationButton ${paginaActual === totalPaginas ? "active" : ""}`}
            onClick={() => onPageChange(totalPaginas)}
          >
            {totalPaginas}
          </button>
        )}

        {/* Siguiente */}
        <button
          className="paginationButton nav"
          disabled={paginaActual === totalPaginas}
          onClick={() => onPageChange(paginaActual + 1)}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Paginacion;
