<?php

/*
 * @File:: Load
 * -----------------------------------------------------
 *
 * Arquivo responsável por carregar todos os arquivos necessários
 * Para o funcionamento do sistema, como por exemplo DB, DB.MySQL
 * Core entre outros.
 * 
 * Data..: 14/05/2019
 * Hora..: 12:00
 *
 * Autor.: emerson@stacasa.com.br
 */
 
// session start
session_start();

// define date_default_timezone_set
date_default_timezone_set( "America/Fortaleza" ); 

// define ABSPATH template
define( "ABSPATH", str_replace( "\\", "/", dirname( __FILE__ ))); 

// define ABSPATH Apps e Inc
define( "ROTPATH", ABSPATH . "/routers" );
define( "INCPATH", ABSPATH . "/incs" );

// require AUTOLOADER ClASS
require ABSPATH . "/loader.php"; ?>