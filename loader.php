<?php

/**
 * SPLAutoloadRegister
 *
 * Conjunto de Métodos para utilizado
 * Para abstração de banco de dados.
 *
 * Autor: emerson@stacasa.com.br
 * Data: 18/05/2018 
 *
 * package: WebSysPro
 */
 
function AutoloadRegister( $StrClass=null ){
	$StrClassArr = explode( "\\", $StrClass );
	$StrClassDir = [];
	
	// #Start loop em todos os elementos do array
	for( $x=0; $x < count( $StrClassArr ) - 1; $x++ )
		$StrClassDir[] = $StrClassArr[ $x ];
	
	// #Definir caminho absoluto do arquivo
	$StrClassPathRouters = ROTPATH . "/" . implode( "/", $StrClassDir );
	$StrClassPathIncludes = INCPATH . "/" . implode( "/", $StrClassDir );
	
	// #Definir Filename Current Script
	$StrClassFile = End( $StrClassArr );
	
	// Verificar se Primeiramente a classe exists dentro de Applications
	// Caso contrário a classe deverá ser encontrada dentro de includes
	if( file_exists( "$StrClassPathRouters$StrClassFile.php" )){
		return require_once( "$StrClassPathRouters$StrClassFile.php" );
	} else if( file_exists( "$StrClassPathIncludes$StrClassFile.php" )){
		return require_once( "$StrClassPathIncludes$StrClassFile.php" );
	}
}

// #Call WSPLAutoloadRegister
spl_autoload_register( "AutoloadRegister" ); ?>