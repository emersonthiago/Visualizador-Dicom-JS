/*!
 * CORE WSP InitApps
 * 
 * WSP JavaScript Library v4.0
 * http://websyspro.com.br/
 *
 * Copyright WSP Foundation and other contributors
 * Released under the MIT license
 * http://websyspro.com.br/license
 *
 * Date: 2016-05-20T17:17Z
 */
 
window.initapps(() => {
	http( "studys", { pat_id: 651727 }).setInit(( dicomViewStudys ) => {
		apps().addComponent(
			content().addComponent(
				dicomView( dicomViewStudys )
			)
		);
	});
});