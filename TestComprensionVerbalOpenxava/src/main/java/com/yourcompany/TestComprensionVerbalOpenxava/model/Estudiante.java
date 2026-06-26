package com.yourcompany.TestComprensionVerbalOpenxava.model;

import javax.persistence.*;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entidad que representa al estudiante evaluado.
 * Cumple con el principio de Responsabilidad Única (SRP).
 */
@Entity
@Table(name = "estudiantes") //  Así se debe llamar la tabla que cree pg
@Getter @Setter
@View(members = "Datos Personales [ cedula, nombre, apellido, edad, sexo ]; Ubicacion [ departamento, municipio ]; Academico [ colegio, tipoColegio ]")
public class Estudiante {

	@Id
	@Hidden // Ocultamos el ID interno al psicólogo
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_estudiante")
	private Integer idEstudiante;

	@Column(name = "cedula", length = 16, nullable = false)
	@Required
	private String cedula;

	@Column(name = "nombre", length = 50, nullable = false)
	@Required
	private String nombre;

	@Column(name = "apellido", length = 50, nullable = false)
	@Required
	private String apellido;

	@Column(name = "edad")
	private Integer edad;

	@Column(name = "sexo", length = 1)
	private String sexo; // Puede ser 'M' o 'F'

	@Column(name = "departamento", length = 50)
	private String departamento;

	@Column(name = "municipio", length = 50)
	private String municipio;

	@Column(name = "colegio", length = 100)
	private String colegio;

	@Column(name = "tipo_colegio", length = 30) // Ej: "Público" o "Privado"
	private String tipoColegio;
}