import { inject, Injector } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

/**
 * Interceptor global de errores HTTP.
 *
 * <p>Traduce cualquier respuesta de error de la API a un toast de PrimeNG con un
 * mensaje legible, y vuelve a lanzar el error para que el componente que hizo la
 * llamada pueda reaccionar (p. ej. mostrar su propio estado de "no encontrado").</p>
 *
 * <p>Las peticiones a <code>/i18n/</code> se dejan pasar sin tocar
 * <code>TranslateService</code>: ese servicio se apoya en <code>HttpClient</code>
 * para cargar los diccionarios, así que resolverlo aquí durante el arranque
 * crearía una dependencia circular y las traducciones no cargarían.</p>
 *
 * @author Duncan
 * @version 2.0.0
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyección diferida: no se resuelve TranslateService salvo que haga falta.
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!req.url.includes('/i18n/')) {
        notificar(injector, error);
      }
      return throwError(() => error);
    })
  );
};

function notificar(injector: Injector, error: HttpErrorResponse): void {
  const messages = injector.get(MessageService);
  const translate = injector.get(TranslateService);

  const claveDetalle = claveDe(error);
  const detalleBackend = error.status === 0 ? null : error.error?.message;

  translate.get(['errores.titulo', claveDetalle]).subscribe(t => {
    messages.add({
      severity: 'error',
      summary: fallback(t['errores.titulo'], 'errores.titulo', 'Error'),
      detail: detalleBackend || fallback(t[claveDetalle], claveDetalle, textoReserva(error)),
      life: 6000
    });
  });
}

/** Clave i18n del mensaje de detalle según el código de estado. */
function claveDe(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'errores.sin_conexion';
  }
  switch (error.status) {
    case 400:
      return 'errores.peticion_invalida';
    case 401:
    case 403:
      return 'errores.no_autorizado';
    case 404:
      return 'errores.no_encontrado';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'errores.servidor';
    default:
      return 'errores.desconocido';
  }
}

/** Si `valor` sigue siendo la clave sin traducir, usa el texto de reserva. */
function fallback(valor: string | undefined, clave: string, reserva: string): string {
  return !valor || valor === clave ? reserva : valor;
}

/** Texto de reserva en español para cuando el diccionario no está disponible. */
function textoReserva(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'No se ha podido conectar con el servidor.';
  }
  if (error.status >= 500) {
    return 'El servidor ha devuelto un error. Inténtalo de nuevo más tarde.';
  }
  if (error.status === 404) {
    return 'No se ha encontrado el recurso solicitado.';
  }
  return 'Se ha producido un error inesperado.';
}
