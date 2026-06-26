package com.yourcompany.TestComprensionVerbalOpenxava.run;

import org.openxava.util.*;

/**
 * Ejecuta esta clase para arrancar la aplicación.
 */
public class TestComprensionVerbalOpenxava {

	public static void main(String[] args) throws Exception {
		// LÍNEA COMENTADA: Ya no usamos la base de datos por defecto, usamos PostgreSQL
		// DBServer.start("TestComprensionVerbalOpenxava-db");

		AppServer.run("TestComprensionVerbalOpenxava"); // Enciende Tomcat y arranca OpenXava
	}

}