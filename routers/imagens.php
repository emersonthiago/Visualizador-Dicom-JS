<?php

/*
 * Class Series
 *
 * Autor: 16/04/2021
 * Email: emerson@websyspro.com.br
 */
 
class imagens extends database
{
	// setInit
	public static function setInit (
		array $args = []
	){
		foreach( static::set()::get(
			"SELECT study.pk AS study_pk
			       ,study.study_iuid AS study_iuid
			       ,series.series_iuid AS series_iuid
			       ,instance.pk AS instancePK
			       ,instance.sop_iuid AS sop_iuid
			       ,CONCAT( 'http://10.10.10.251:8080/wado?requestType=WADO&',
					   'studyUID=', study.study_iuid, '&'
					   'seriesUID=', series.series_iuid, '&'
					   'objectUID=', instance.sop_iuid
			        ) AS frameNumberUrl 					  
		       FROM study
	  	           ,series
			       ,instance
		      WHERE series.study_fk = study.pk
		        AND instance.series_fk = series.pk
			    AND instance.pk = $args[instancePk]"
		)::rows() as $instance ){
			// define instance imagem
			$instanceImagem = file_get_contents( sprintf( 
				"%s&frameNumber=$args[instanceIndex]&rows=$args[instanceHeight]", $instance->framenumberurl 
			));
			
			return [
				"instancePk"      => (int)$args[ "instancePk" ],
				"instanceSerie"   => (string)$args[ "instanceSerie" ], 
				"instanceIndex"   => (int)$args[ "instanceIndex" ], 
				"instanceIndexPk" => (int)$args[ "instanceIndexPk" ],
				"instanceImagem"  => (string)sprintf( "data:image/png;base64, %s", base64_encode( $instanceImagem ))
			];
		}
	}
}
 
?> 