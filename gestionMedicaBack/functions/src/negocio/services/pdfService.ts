import * as fs from "fs";
import * as path from "path";
import PDFDocument from "pdfkit";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);
type TratamientoCompleto = {
  tratamiento: any;
  lineas: any[];
  medico: any;
};

async function crearPDF(tratamientoCompleto: TratamientoCompleto, outputPath: string): Promise<void> {

  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);
  
    const { tratamiento, lineas, medico } = tratamientoCompleto;
  
    const logoPath = path.resolve(process.cwd(), "assets/imgs/Logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.width - 150, 30, { width: 100 });
    }
  
    // Título principal
    doc
      .fontSize(20)
      .fillColor("#375534")
      .text("Resumen del Tratamiento", { underline: true })
      .moveDown(1.5);
  
    // Info del tratamiento
    doc.fontSize(12);
    doc.fillColor("#2DD55B").font("Helvetica-Bold").text("Fecha de inicio: ", { continued: true });
    doc.fillColor("black").font("Helvetica").text(`${tratamiento.fechaInicio}`);
    if (tratamiento.fechaFin) {
      doc.fillColor("#2DD55B").font("Helvetica-Bold").text("Fecha de fin: ", { continued: true });
      doc.fillColor("black").font("Helvetica").text(`${tratamiento.fechaFin}`);
    }
  
    doc.fillColor("#2DD55B").font("Helvetica-Bold").text("Tipo de tratamiento: ", { continued: true });
    doc.fillColor("black").font("Helvetica").text(`${tratamiento.tipoTratamiento}`);
  
    doc.fillColor("#2DD55B").font("Helvetica-Bold").text("Descripción: ", { continued: true });
    doc.fillColor("black").font("Helvetica").text(`${tratamiento.descripcion}`).moveDown();
  
    // Info del médico
    doc
      .fontSize(14)
      .fillColor("#375534")
      .text("Médico Responsable", { underline: true })
      .moveDown(0.5);
  
    doc.fontSize(12);
    doc.fillColor("#2DD55B").font("Helvetica-Bold").text("Nombre: ", { continued: true });
    doc.fillColor("black").font("Helvetica").text(`Dr/a. ${medico.nombreMedico} ${medico.apellidosMedico}`);
  
    doc.fillColor("#2DD55B").font("Helvetica-Bold").text("Especialidad: ", { continued: true });
    doc.fillColor("black").font("Helvetica").text(`${medico.especialidad?.nombre}`);
  
    doc.fillColor("#2DD55B").font("Helvetica-Bold").text("Centro: ", { continued: true });
    doc.fillColor("black").font("Helvetica").text(`${medico.centro?.nombreCentro}`);
  
    doc.fillColor("#2DD55B").font("Helvetica-Bold").text("Ubicación: ", { continued: true });
    doc.fillColor("black").font("Helvetica").text(`${medico.centro?.ubicacion}`);
  
    doc.fillColor("#2DD55B").font("Helvetica-Bold").text("Teléfono: ", { continued: true });
    doc.fillColor("black").font("Helvetica").text(`${medico.centro?.telefono}`).moveDown();
  
    // Prescripciones
    doc
      .fontSize(14)
      .fillColor("#375534")
      .text("Prescripciones", { underline: true })
      .moveDown(0.5);
  
    lineas.forEach((item, index) => {
      const { linea, medicamento } = item;
      const dosis = `${linea.cantidad} ${linea.unidad || ""} ${linea.medida || ""}`.trim();
  
      doc
        .fontSize(12)
        .fillColor("black")
        .font("Helvetica-Bold")
        .text(`${index + 1}. ${medicamento.nombre} (${medicamento.marca || "Marca desconocida"})`);
  
      doc.fillColor("#2DD55B").font("Helvetica-Bold").text("Dosis: ", { continued: true });
      doc.fillColor("black").font("Helvetica").text(dosis);
  
      doc.fillColor("#2DD55B").font("Helvetica-Bold").text("Duración: ", { continued: true });
      doc.fillColor("black").font("Helvetica").text(linea.duracion);
  
      doc.fillColor("#2DD55B").font("Helvetica-Bold").text("Frecuencia: ", { continued: true });
      doc.fillColor("black").font("Helvetica").text(linea.frecuencia);
  
      doc.fillColor("#2DD55B").font("Helvetica-Bold").text("Indicaciones: ", { continued: true });
      doc.fillColor("black").font("Helvetica").text(linea.descripcion);
  
      doc.moveDown();
    });
  
    doc.end();
    stream.on("finish", resolve);
  });
}

async function cifrarPDFconQPDF(input: string, output: string, password: string): Promise<void> {
  const command = `qpdf --encrypt "${password}" "${password}" 256 -- "${input}" "${output}"`;
  await execPromise(command);
}

export async function generarPdfCifrado(dni: string, tratamientoCompleto: TratamientoCompleto): Promise<string> {
  const timestamp = Date.now();
  const tmpFolder = path.resolve(process.cwd(), "tmp");

  // Asegurate de que la carpeta exista
  if (!fs.existsSync(tmpFolder)) {
    fs.mkdirSync(tmpFolder, { recursive: true });
  }

  const tempPath = path.join(tmpFolder, `temp_${timestamp}.pdf`);
  const finalPath = path.join(tmpFolder, `cifrado_${timestamp}.pdf`);
  await crearPDF(tratamientoCompleto, tempPath);
  await cifrarPDFconQPDF(tempPath, finalPath, dni);

  fs.unlinkSync(tempPath); // Limpieza temporal

  return finalPath;
}
