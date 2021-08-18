<?php

/*
 * Class Utils
 *
 * Autor: 16/04/2021
 * Email: emerson@websyspro.com.br
 */

class utils
{
	// @public setPost
	public static function setPost(
			 $content, 
		bool $success = true
	) : array {
		return [
			"content" => $content,
			"success" => $success
		];	
	}	
	
	// @public getClassStaticBase
	public static function getClassStaticBase( $classStaticBase ) {
		return preg_replace( 
			[ "/\//", "/::.+()/" ], [ "\\", "" ], $classStaticBase 
		);
	}

	// @public getClassVarsOrMethods
	public static function getClassVarsOrMethods( $classStaticBase ) {
		if( !preg_match( "/::\w/", $classStaticBase )) {
			return "setInit";	
		} else return preg_replace( 
			[ "/.+::/", "/\(\)/" ], [ "", "" ], $classStaticBase
		);
	}	
	
	// @public setFloatEncode
	public static function setFloatEncode ( 
		string $string = null
	){
		return preg_replace(
			[ "/\./i", "/\,/i" ], [ "", "." ], static::setQuote( $string )
		);		
	}
	
	// @public setFloatDecode
	public static function setFloatDecode ( 
		string $string = null
	){
		if( empty( $string ) === false )
			return number_format (
				$string, 2, ",", "." 
			);
		else return ( string )null;		
	}	

	// @public setDateEncode
	public static function setDateEncode ( 
		string $string = null
	){
		return preg_replace( 
			"/(\d{2})\/(\d{2})\/(\d{4})/", "$3-$2-$1", static::setQuote( $string )
		);		
	}
	
	// @public setDateEncode
	public static function setDateDecode ( 
		string $string = null
	){
		return preg_replace(
			"/(\d{4})-(\d{2})-(\d{2})/", "$3/$2/$1", $string
		);		
	}	

	// @public setQuote
	public static function setQuote ( 
		string $string
	){
		return "'$string'";
	}
}


?>