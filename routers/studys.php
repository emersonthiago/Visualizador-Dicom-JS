<?php

/*
 * Class Studys
 *
 * Autor: 16/04/2021
 * Email: emerson@websyspro.com.br
 */
 
class studys extends database
{
	// setInit
	public static function setInit (
		array $args = []
	){
		return static::set()::get(
			"SELECT patient.pk AS patient_pk
				   ,patient.pat_id
				   ,REPLACE( patient.pat_name, '^', '' ) AS pat_name
				   ,patient.pat_birthdate
				   ,IF( patient.pat_sex = 'M', 'MASCULINO', 'FEMININO' ) AS pat_sex
				   ,study.pk AS study_pk
				   ,REPLACE( REPLACE( study.study_desc, '^', '' ), '_', ' ' ) AS study_desc
				   ,study.study_iuid
			       ,study.study_datetime
				   ,REPLACE( study.ref_physician, '^', '' ) AS ref_physician
			       ,study.num_series
				   ,study.retrieve_aets
			       ,study.mods_in_study
			       ,(
			 SELECT FORMAT( IF( study_.mods_in_study = 'XA', SUM( getFrameNumbers( instance_.inst_attrs )), study_.num_instances ) , 0 )
		 	   FROM study AS study_
				   ,series AS series_ 
				   ,instance AS instance_
			  WHERE series_.study_fk = study_.pk
				AND instance_.series_fk = series_.pk
				and study_.pk = study.pk ) as num_instances
			   FROM patient
			       ,study
			  WHERE ( patient.pat_id LIKE '%-%$args[pat_id]' OR patient.pat_id = '$args[pat_id]' )
				AND study.patient_fk = patient.pk
		   ORDER BY	study_datetime DESC"
		)::rows();
	}
}
 
?> 