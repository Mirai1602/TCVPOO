package com.yourcompany.TestComprensionVerbalOpenxava.model;

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
@Views({
    @View(members = "Datos Personales [ cedula, nombre, edad, sexo ]; Ubicacion [ departamento, municipio, zona ]; Academico [ colegio, tipoColegio ]"),
    @View(name = "Simple", members = "cedula, nombre")
})
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
