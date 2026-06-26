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
