const fs = require('fs');
const path = require('path');

const estudiantePath = path.join(__dirname, 'TestComprensionVerbalOpenxava', 'src', 'main', 'java', 'com', 'yourcompany', 'TestComprensionVerbalOpenxava', 'model', 'Estudiante.java');
const resultadoPath = path.join(__dirname, 'TestComprensionVerbalOpenxava', 'src', 'main', 'java', 'com', 'yourcompany', 'TestComprensionVerbalOpenxava', 'model', 'ResultadoTest.java');

const estudianteContent = `package com.yourcompany.TestComprensionVerbalOpenxava.model;

import javax.persistence.*;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entidad que representa al estudiante evaluado.
 * Actualizada para coincidir exactamente con PostgreSQL.
 */
@Entity
@Table(name = "estudiantes")
@Getter @Setter
@View(members = "Datos Personales [ cedula, nombre, edad, sexo ]; Ubicacion [ departamento, municipio, zona ]; Academico [ colegio, tipoColegio ]")
public class Estudiante {

	@Id
	@Hidden
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;

	@Column(name = "cedula", length = 50, unique = true)
	private String cedula;

	@Column(name = "nombre", length = 200, nullable = false)
	@Required
	private String nombre;

	@Column(name = "edad")
	private Integer edad;

	@Column(name = "sexo", length = 20)
	private String sexo; 

	@Column(name = "departamento", length = 100)
	private String departamento;

	@Column(name = "municipio", length = 100)
	private String municipio;

	@Column(name = "zona", length = 20)
	private String zona;

	@Column(name = "colegio", length = 200)
	private String colegio;

	@Column(name = "tipo_colegio", length = 20)
	private String tipoColegio;
}
`;

const resultadoContent = `package com.yourcompany.TestComprensionVerbalOpenxava.model;

import javax.persistence.*;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * Entidad que almacena el resultado final procesado del test.
 */
@Entity
@Table(name = "resultados")
@Getter @Setter
@View(name="VistaPsicologo", members = "Detalle de Evaluacion [ id, createdAt ]; estudiante; Resultados [ aciertos, totalPreguntas, porcentaje, tiempoTotal, completado ]")
public class ResultadoTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "estudiante_cedula", referencedColumnName = "cedula")
    @ReferenceView("Simple")
    private Estudiante estudiante;

    @Column(name = "aciertos")
    private Integer aciertos;

    @Column(name = "total_preguntas")
    private Integer totalPreguntas;

    @Column(name = "porcentaje")
    private Integer porcentaje;

    @Column(name = "tiempo_total", length = 20)
    private String tiempoTotal;

    @Column(name = "completado")
    private Boolean completado;
    
    // Tratamos el JSONB como String en Java para visualizacion rapida
    @Column(name = "respuestas")
    @Stereotype("MEMO")
    private String respuestas;
}
`;

fs.writeFileSync(estudiantePath, estudianteContent, 'utf8');
fs.writeFileSync(resultadoPath, resultadoContent, 'utf8');

console.log('Archivos configurados para usar cedula como foreign key.');
