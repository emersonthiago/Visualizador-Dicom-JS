<?php

/**
 * Post Ajax WSP
 *
 * Conjunto de Métodos para utilizado
 * Para abstração de banco de dados.
 *
 * Autor: emerson@stacasa.com.br
 * Data: 18/05/2018 
 *
 * package: WebSysPro
 */
 
// @__ define Load
require_once( "./load.php" );

// @__ define getClassStaticBase
$getClassStaticBase = utils::getClassStaticBase( reset( $_REQUEST ));

// @__ define getClassVarsOrMethods
$getClassVarsOrMethods = utils::getClassVarsOrMethods( reset( $_REQUEST ));

// @__ define classe static exist's
if( class_exists( $getClassStaticBase ) === false ){
	exit( json_encode( 
		utils::setPost( "CLASS or NAMESPACE $getClassStaticBase não exists", false )
	));
}

// @__ define getClassStaticBaseListMethods
// @__ define getClassStaticBaseListVars
$getClassStaticBaseListMethods = get_class_methods( $getClassStaticBase );
$getClassStaticBaseListVars = get_class_vars( $getClassStaticBase );

// @__ define is execute static méthod's
if( in_array( $getClassVarsOrMethods, $getClassStaticBaseListMethods ) === true ){
	exit( json_encode( $getClassStaticBase::$getClassVarsOrMethods( $_POST )));
} else
if( in_array( $getClassVarsOrMethods, $getClassStaticBaseListMethods ) === false ){
	if( in_array( $getClassVarsOrMethods, array_keys( $getClassStaticBaseListVars )) === true ){
		exit( json_encode( $getClassStaticBase::$$getClassVarsOrMethods ));
	}
}

?>