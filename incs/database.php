<?php

/*
 * Class Database From MySQL
 *
 * Autor: 16/04/2021
 * Email: emerson@websyspro.com.br
 */

class database extends utils
{
	// @properts
	public static $host = "10.10.10.251";
	public static $user = "root";
	public static $pass = "controle";
	public static $data = "pacsdb";
	
	// @properts
	public static $init = null;
	public static $hand = null;
	public static $erro = null;
	public static $sttd = null;
	public static $sqls = null;
	public static $flds = null;
		
	// @public __construct
	public function __construct ( 
		string $datasource = null
	){
		// mysqli mysqli_report off
		mysqli_report( MYSQLI_REPORT_OFF );
		
		// mysql imit
		static::$init = mysqli_init();
		
		// mysql options
		mysqli_options( static::$init, MYSQLI_INIT_COMMAND, "set charset utf8" );
		mysqli_options( static::$init, MYSQLI_INIT_COMMAND, "set lc_time_names = 'pt_BR'" );
		
		// start connect
		static::$hand = mysqli_real_connect
		(
			static::$init,
			static::$host,
			static::$user,
			static::$pass,
			static::$data
		);
		
		// checks is connected
		if( static::$hand === false || is_null( static::$hand ))
		{
			static::setError(
				mysqli_connect_errno(),
				mysqli_connect_error()
			);
		}
	}
	
	// @public setError
	public static function setError (
		int $errno,
		string $error
	){
		static::$erro = sprintf (
			"Error %s: %s", $errno, $error
		);
	}
	
	// @public set
	public static function set (
		string $datasource = null
	){
		return new static (
			$datasource
		);	
	}
	
	// @public gets
	public static function get (
		string $sqls = null
	){
		// define sqls
		static::$sqls = $sqls;
		
		// mysqli_query
		static::$sttd = mysqli_query(
			static::$init, 
			static::$sqls
		);
		
		// checks is query error
		if( static::$sttd === false ){
			static::setError(
				mysqli_errno(),
				mysqli_error()
			);
		} else static::setFields();
		
		// return __CLASS__
		return __CLASS__;
	}
	
	// @public getFieldType 
	public static function getFieldType(
		$fieldDirect
	){
		if( is_numeric( $fieldDirect->type )){
			switch( $fieldDirect->type ){
				case   1:
				case   2:
				case   3:
				case   8:
				case   9: return "int";
					break;
				case   4:
				case   5:
				case 246: return "decimal";
				case  11: return "time";
				case  13: return "year";
					break;
				case   7:
				case  10:
				case  12: return "datetime";
				case 252: return "blob";
					break;
				case 251:	
				case 253:
				case 254: return "text";
					break;
				default: return $fieldDirect->type;
					break;
			}
		} else
		if( is_string( $fieldDirect->type )){
			switch( $fieldDirect->type ){
				case "varchar": return "text";
					break;
				default: return $fieldDirect->type;
					break;			
			}	
		}		
	}
	
	// @public getFieldDecs 
	public static function getFieldDecs(
		$fieldDirect
	){
		return $fieldDirect->decimals;
	}
	
	// @public getFieldSize
	public static function getFieldSize(
		$fieldDirect
	){
		return $fieldDirect->length;
	}	
	
	// @public getFieldDefs
	public static function getFieldDefs(
		$fieldDirect
	){
		return $fieldDirect->def;
	}	
	
	// @public setFields
	public static function setFields (
	){
		// start loop in fields
		while( $field = mysqli_fetch_field( static::$sttd )){
			static::$flds[ mb_strtolower( $field->name )] = ( object )[
				"type" => static::getFieldType( $field ),
				"decs" => static::getFieldDecs( $field ),
				"size" => static::getFieldSize( $field ),
				"defs" => static::getFieldDefs( $field )
			];
		}
	}
	
	// @public setFields
	public static function setFieldEncode (
		array $cols,
		array $flds	
	){
		// check is is_array or sizeof is_array
		if( is_array( $cols ) && sizeof( $cols )){
			if( is_array( $flds ) && sizeof( $flds )){
				foreach( $cols as $name => $text ){
					if( in_array( $flds[ $name ]->type, [ "decimal" ]) === true ){
						$cols[ $name ] = static::setFloatEncode(( string )$text );
					} else 
					if( in_array( $flds[ $name ]->type, [ "datetime", "date", "time" ]) === true ){
						$cols[ $name ] = static::setDateEncode(( string )$text );
					} else
					if( in_array( $flds[ $name ]->type, [ "image" ]) === true ){
						$cols[ $name ] = static::setQuote( "" );
					} else
					if( in_array( $flds[ $name ]->type, [ "blob" ]) === true ){
						$cols[ $name ] = static::setQuote(( string )$text );
					} else						
					if( in_array( $flds[ $name ]->type, [ "text" ]) === true ){
						$cols[ $name ] = static::setQuote( addslashes(( string )$text ));
					}
				}
			}
		}
		
		// return $cols
		return $cols;
	}
	
	// @public setFieldDecode
	public static function setFieldDecode (
		array $cols,
		array $flds	
	){
		// check is is_array or sizeof is_array
		if( is_array( $cols ) && sizeof( $cols )){
			if( is_array( $flds ) && sizeof( $flds )){
				foreach( $cols as $name => $text ){
					if( in_array( $flds[ $name ]->type, [ "decimal" ]) === true ){
						$cols[ $name ] = static::setFloatDecode(( string )$text );
					} else 
					if( in_array( $flds[ $name ]->type, [ "datetime", "date", "time" ]) === true ){
						$cols[ $name ] = static::setDateDecode(( string )$text );
					}
				}
			}
		}
		
		// return $cols
		return $cols;
	}	
	
	// @public escapeString
	public static function escapeString (
		string $string
	){
		return mysqli_real_escape_string(
			static::$init, $string
		);
	}
	
	// @public fieldsCount
	public static function fieldsCount(
	){
		return mysqli_num_fields(
			static::$sttd
		);
	}
	
	// @public rowsCount
	public static function rowsCount (
	){
		return is_bool( static::$sttd ) === false 
			? mysqli_num_rows( static::$sttd ) : 0;  
	}
	
	// @public loop
	public static function loop (
		callable $callable = null,
		array $loopRow = []	
	){
		// is_callable && is_callable
		if( is_null( $callable ) === false ){
			if( is_callable( $callable ) === true ){
				if( is_null( static::$sttd ) === false ){
					while( $loopRow = mysqli_fetch_assoc( static::$sttd )){
						call_user_func( $callable, ( object )static::setFieldDecode(
							array_change_key_case( $loopRow ), static::$flds
						));
					}
				}	
			}
		}
		
		// free results
		mysqli_free_result (
			static::$sttd
		);

		// return __CLASS__
		return __CLASS__;
	}
	
	// @public rows
	public static function rows (
		array $rows = [],
		array $loopRow = []	
	){
		// is_callable && is_callable
		if( is_null( static::$sttd ) === false ){
			while( $loopRow = mysqli_fetch_assoc( static::$sttd )){
				$rows[] = ( object )static::setFieldDecode(
					array_change_key_case( $loopRow ), static::$flds
				);
			}
		}
		
		// free results
		mysqli_free_result (
			static::$sttd
		);		
		
		// return $rows
		return $rows;
	}

	// @public row
	public static function row (
		array $row = [],
		array $loopRow = []
	){
		// is_callable && is_callable
		if( is_null( static::$sttd ) === false ){
			$row = ( object )static::setFieldDecode(
				array_change_key_case(
					mysqli_fetch_assoc( static::$sttd )
				), static::$flds
			);
		}
		
		// free results
		mysqli_free_result (
			static::$sttd
		);		
		
		// return $row
		return $row;
	}	
}

?>