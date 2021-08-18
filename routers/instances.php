<?php

/*
 * Class Series
 *
 * Autor: 16/04/2021
 * Email: emerson@websyspro.com.br
 */
 
class instances extends database
{
	// setInit
	public static function setInit (
		array $args = [],
		array $argsInstances = []
	){
		// define get instances
		$instances = static::set()::get(
			"SELECT instance.pk
				   ,series.series_iuid
		       FROM study
	  	           ,series
			       ,instance
		      WHERE series.study_fk = study.pk
		        AND instance.series_fk = series.pk
			    AND series.series_iuid = '$args[series_iuid]'
			    AND instance.inst_no IS NOT NULL"
		)::rows();
		
		// checks exists instances
		if( $args[ "series_mods" ] === "XA" ){
			foreach( $instances as $instace ){
				for( $instaceIndex = 0; $instaceIndex<=(int)$args[ "series_imgs" ]; $instaceIndex++ ){
					$argsInstances[] = [
						"instancePk"    => $instace->pk,
						"instanceIndex" => $instaceIndex,
						"instanceSerie" => $instace->series_iuid
					];
				}
			}
		} else
		if( $args[ "series_mods" ] !== "XA" ){
			foreach( $instances as $instace ){
				$argsInstances[] = [
					"instancePk"    => $instace->pk,
					"instanceSerie" => $instace->series_iuid,
					"instanceIndex" => 0
				];
			}			
		}
		
		// returns instances
		return $argsInstances;
	}
}
 
?> 