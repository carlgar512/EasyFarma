  export class Usuario {
    private uid: string = "";
    private dni: string = "";
    private email: string;
    private nombreUsuario: string;
    private apellidosUsuario: string;
    private fechaNacimiento: string;
    private telefono: string;
    private direccion: string;
    private numTarjeta: string;
    private modoAccesibilidad: boolean;
    private medicosFavoritos: string[];
    private operacionesFavoritas: string[];
    private tipoUsuario: "Regular" | "Infantil";
  
    constructor(
      dni: string = "",
      email: string,
      nombreUsuario: string,
      apellidosUsuario: string,
      fechaNacimiento: string,
      telefono: string,
      numTarjeta: string,
      direccion: string = "",
      modoAccesibilidad: boolean = false,
      medicosFavoritos: string[] = [],
      operacionesFavoritas: string[] = [],
      tipoUsuario: "Regular" | "Infantil" = "Regular" // ✅ POR DEFECTO REGULAR
    ) {
      this.dni = dni;
      this.email = email;
      this.nombreUsuario = nombreUsuario;
      this.apellidosUsuario = apellidosUsuario;
      this.fechaNacimiento = fechaNacimiento;
      this.telefono = telefono;
      this.direccion = direccion;
      this.numTarjeta = numTarjeta;
      this.modoAccesibilidad = modoAccesibilidad;
      this.medicosFavoritos = medicosFavoritos;
      this.operacionesFavoritas = operacionesFavoritas;
      this.tipoUsuario = tipoUsuario;
    }

    static fromFirestore(uid:string, data: any): Usuario {
      const user = new Usuario(
        data.dni,
        data.email,
        data.nombreUsuario,
        data.apellidosUsuario,
        data.fechaNacimiento,
        data.telefono,
        data.direccion,
        data.numTarjeta,
        data.modoAccesibilidad,
        data.medicosFavoritos,
        data.operacionesFavoritas, 
        data.tipoUsuario
      );
      user.setIdUsuario(uid);
      return user;
    }

    toFirestoreObject(): Record<string, any> {
      return {
        uid: this.getIdUsuario(),
        dni: this.getDni(),
        email: this.getEmail(),
        nombreUsuario: this.getNombreUsuario(),
        apellidosUsuario: this.getApellidosUsuario(),
        fechaNacimiento: this.getFechaNac(),
        telefono: this.getTelefono(),
        direccion: this.getDireccion(),
        numTarjeta: this.getNumTarjeta(),
        modoAccesibilidad: this.getModoAccesibilidad(),
        medicosFavoritos: this.getMedicosFavoritos(),
        operacionesFavoritas: this.getOperacionesFavoritas(),
        tipoUsuario: this.getTipoUsuario(),
      };
    }
  
    public getIdUsuario(): string {
      return this.uid;
    }
  
    public getDni(): string {
      return this.dni;
    }
  
    public getEmail(): string {
      return this.email;
    }
  
    public getFechaNac(): string {
      return this.fechaNacimiento;
    }
  
    public getNombreUsuario(): string {
      return this.nombreUsuario;
    }
  
    public getApellidosUsuario(): string {
      return this.apellidosUsuario;
    }
  
    public getTelefono(): string {
      return this.telefono;
    }
  
    public getDireccion(): string {
      return this.direccion;
    }
  
    public getNumTarjeta(): string {
      return this.numTarjeta;
    }
  
    public getModoAccesibilidad(): boolean {
      return this.modoAccesibilidad;
    }
  
    public getMedicosFavoritos(): string[] {
      return this.medicosFavoritos;
    }
  
    public getOperacionesFavoritas(): string[] {
      return this.operacionesFavoritas;
    }

    public getTipoUsuario(): "Regular" | "Infantil" {
      return this.tipoUsuario;
    }

    public setIdUsuario(id :string):void{
      this.uid= id;
    }
  
    public setModoAccesibilidad(modo: boolean): void {
      this.modoAccesibilidad = modo;
    }
  
    public setTelefono(tel: string): void {
      this.telefono = tel;
    }
  
    public setDireccion(direccion: string): void {
      this.direccion = direccion;
    }
  
    public setDni(dni: string): void {
      this.dni = dni;
    }
  
    public setEmail(email: string): void {
      this.email = email;
    }
  
    public setNumTarjeta(num: string): void {
      this.numTarjeta = num;
    }
  
    public setNombreUsuario(nombre: string): void {
      this.nombreUsuario = nombre;
    }
  
    public setApellidosUsuario(apellidos: string): void {
      this.apellidosUsuario = apellidos;
    }
  
    public setFechaNac(fecha: string): void {
      this.fechaNacimiento = fecha;
    }

    public setTipoUsuario(tipo: "Regular" | "Infantil"): void {
      this.tipoUsuario = tipo;
    }
  
    public añadirOperacionFavorita(idOperacion: string): boolean {
      if (!this.operacionesFavoritas.includes(idOperacion)) {
        this.operacionesFavoritas.push(idOperacion);
        return true;
      }
      return false;
    }
  
    public eliminarOperacionFavorita(idOperacion: string): boolean {
      const index = this.operacionesFavoritas.indexOf(idOperacion);
      if (index !== -1) {
        this.operacionesFavoritas.splice(index, 1);
        return true;
      }
      return false;
    }
  
    public añadirMedicoFavorito(idMedico: string): boolean {
      if (!this.medicosFavoritos.includes(idMedico)) {
        this.medicosFavoritos.push(idMedico);
        return true;
      }
      return false;
    }
  
    public eliminarMedicoFavorito(idMedico: string): boolean {
      const index = this.medicosFavoritos.indexOf(idMedico);
      if (index !== -1) {
        this.medicosFavoritos.splice(index, 1);
        return true;
      }
      return false;
    }
  
    public migrarCuentaInfantilARegular(): boolean {
      // lógica que tú definas para migrar un usuario (ejemplo)
      return true;
    }
  }
  