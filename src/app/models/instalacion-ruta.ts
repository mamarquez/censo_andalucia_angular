export interface InstalacionRuta {
    id: number;
    idInstalacion: number;
    nombre: string;
    descripcion: string;
    distanciaMetros?: number;
    desnivelPositivoMetros?: number;
    tiempoSenderismoMinutos: number;
    tiempoRunningMinutos: number;
    tiempoBttMinutos: number;
    visible: boolean;
}