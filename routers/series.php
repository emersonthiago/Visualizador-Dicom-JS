<?php

/*
 * Class Series
 *
 * Autor: 16/04/2021
 * Email: emerson@websyspro.com.br
 */
 
class series extends database
{
	// setInit
	public static function setInit (
		array $args = [],
		array $argsSeries = []
	){
		foreach( static::set()::get(
			"SELECT study_mods
				   ,study_iuid
			 	   ,series_iuid
			 	   ,sop_iuid
				   ,IF( series_count >= series_count_xa, series_count, series_count_xa ) AS series_imgs
			 	   ,CONCAT( 'http://10.10.10.251:8080/wado?requestType=WADO&',
						'studyUID=', study_iuid, '&'
						'seriesUID=', series_iuid, '&'
						'objectUID=', sop_iuid
					) AS frameNumberUrl 
			   FROM (
			 SELECT study.pk AS study_pk
				   ,study.mods_in_study AS study_mods
				   ,study.study_iuid AS study_iuid
				   ,series.series_iuid AS series_iuid
				   ,( 
			 SELECT instance.sop_iuid
			   FROM pacsdb.instance
			  WHERE instance.series_fk = series.pk
				AND instance.inst_no IS NOT NULL 
			  LIMIT 1 ) AS sop_iuid 
				   ,( 
			 SELECT COUNT( instance.series_fk )
			   FROM pacsdb.instance
			  WHERE instance.series_fk = series.pk
				AND instance.inst_no IS NOT NULL ) AS series_count
			   ,IF( study.mods_in_study = 'XA', 
		   ( SELECT getFrameNumbers( instance.inst_attrs )
			   FROM pacsdb.instance
			  WHERE instance.series_fk = series.pk
				AND instance.inst_no IS NOT NULL
			  LIMIT 1 ), 0 ) AS series_count_xa
			   FROM pacsdb.study
				   ,pacsdb.series
			  WHERE study.pk = $args[study_pk]   
				AND series.study_fk = study.pk )
				 AS series
			  WHERE sop_iuid IS NOT NULL"
		)::rows() as $index => $serie ){
			// define Imagem Defaults Series
			$argsSeries[] = [
				"studymods"   => (string)$serie->study_mods,
				"seriesimgs"  => (int)$serie->series_imgs,
				"seriesiuid"  => (string)$serie->series_iuid,
				"imagebase"   => (string)sprintf( "data:image/png;base64, %s", base64_encode( file_get_contents( 
					sprintf( "%s&frameNumber=1&rows=100", $serie->framenumberurl )
				)))
			];
		};
		
		// define imagens defaults
		return $argsSeries;
	}
}
 
?> 