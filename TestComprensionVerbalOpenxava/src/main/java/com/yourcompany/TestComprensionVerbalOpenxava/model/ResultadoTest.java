package com.yourcompany.TestComprensionVerbalOpenxava.model;

import javax.persistence.*;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * Entidad que almacena el resultado final procesado del test.
 */
@Entity
@Table(name = "resultados_test") //  Tabla donde Node.js insertará los cálculos
@Getter @Setter
@View(name="VistaPsicologo", members = "Detalle de Evaluación [ idResultado, fechaPrueba ]; estudiante; Resultados [ aciertosUsuario, aciertosMaximos, aciertosMinimos ]")
public class ResultadoTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resultado")
    private Integer idResultado;

    @Column(name = "fecha_prueba")
    private LocalDateTime fechaPrueba;

    // Relación orientada a objetos: Muchos resultados pueden pertenecer a un estudiante (si hace el test 2 veces)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "estudiante_id", referencedColumnName = "id_estudiante")
    @ReferenceView("Simple") // Muestra un resumen del estudiante
    private Estudiante estudiante;

    @Column(name = "aciertos_usuario")
    private Integer aciertosUsuario;

    @Column(name = "aciertos_maximos")
    private Integer aciertosMaximos;

    @Column(name = "aciertos_minimos")
    private Integer aciertosMinimos;

    // Campo opcional por si el psicólogo quiere ver el JSON crudo con las respuestas (A, B, C)
    @Column(name = "respuestas_crudas", columnDefinition = "text")
    @Stereotype("MEMO")
    private String respuestasCrudas;
}