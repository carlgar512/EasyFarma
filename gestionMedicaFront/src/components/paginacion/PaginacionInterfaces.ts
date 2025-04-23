export interface PaginacionProps {
    paginaActual: number;
    totalPaginas: number;
    onPageChange: (nuevaPagina: number) => void;
  }
  