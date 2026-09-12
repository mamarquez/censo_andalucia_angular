import { TipoEspacio } from './tipo-espacio';

export interface InstalacionEspacioDeportivo {
    id: number;
    idInstalacion: number;
    nombre: string;
    descripcion: string;
    visible: boolean;
    tipoEspacioDeportivo: TipoEspacio;
}
