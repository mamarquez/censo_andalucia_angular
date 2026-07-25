import { HttpParams } from '@angular/common/http';

/**
 * Convierte un objeto de filtros.ts arbitrario en un objeto HttpParams válido de Angular,
 * mapeando automáticamente los selectores de estado booleano ('1' -> true, '0' -> false)
 * e ignorando valores '2', vacíos, nulls o undefined.
 *
 * @param filtros Objeto con los filtros.ts del formulario
 * @returns Instancia de HttpParams lista para enviar en HttpClient
 */
export function buildHttpParams(filtros: any): HttpParams {
  let params = new HttpParams();

  Object.keys(filtros).forEach((key) => {
    const value = filtros[key];

    console.log(key, value);

    if (value === null || value === undefined || value === '') {
      return;
    }

    params = params.set(key, value.toString());
  });

  return params;
}
