/*!
 * CORE WSP
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

!( function(){
    "use-strict";
	
	// Component StudysProgressInner
	window.wsp.core.studysProgressInner = {
		exports: [ window.wsp.core.component ],

		// Component Styles
		backgroundColor: "rgb(180,180,180)",
		position: "absolute",
		height: "3px",
		bottom: "0px",
		left: "0px",
		top: "0px",
	};	
	
	// Component StudysProgress
	window.wsp.core.studysProgress = {
		exports: [ window.wsp.core.component ],
		
		// Component Propertys
		studysProgressInner: null,
		studysProgressMin: 1,
		studysProgressMax: 100,
		studysProgressCur: 1,

		// Component Styles
		position: "absolute",
		height: "3px",
		bottom: "0px",
		right: "0px",
		left: "0px",
		zIndex: "3",
		
		// setInitialize
		setInitialize: function( studysProgressMin, studysProgressMax ){
			return this.setPropertyObject({
				studysProgressMin: studysProgressMin,
				studysProgressMax: studysProgressMax
			});
		},		
		
		// setComponentControls
		setComponentControls: function(){
			if( this.component === "studysProgress" ){
				return this.addComponent(
					this.studysProgressInner = studysProgressInner()
				);
			} else
			if( this.component === "studysProgressMins" ){
				return this.addComponent(
					this.studysProgressInner = studysProgressMinsInner()
				);				
			}	
		},
		
		// setProgressUpdateCur
		setProgressUpdateCur: function(){
			this.studysProgressInner.setProperty({
				width: this.sprintf(
					"%1%", ( this.studysProgressCur / this.studysProgressMax ) * 100
				)
			})
		},
		
		// setProgressInc
		setProgressInc: function( studysProgressCur ){
			return this.setPropertyObject({
				studysProgressCur: this.studysProgressCur + 1
			}).setProgressUpdateCur();
		},
		
		// setProgressPos
		setProgressPos: function( studysProgressCur ){
			return this.setPropertyObject({
				studysProgressCur: studysProgressCur
			}).setProgressUpdateCur();
		}		
	};
	
	// Component StudysProgressMinsInner
	window.wsp.core.studysProgressMinsInner = {
		exports: [ window.wsp.core.component ],

		// Component Styles
		backgroundColor: "rgb(255,200,0)",
		position: "absolute",
		height: "6px",
		bottom: "0px",
		left: "0px",
		top: "0px",
	};	

	// Component StudysProgressMins
	window.wsp.core.studysProgressMins = {
		exports: [ window.wsp.core.studysProgress ],
		
		// Component Styles
		backgroundColor: "rgb(0,50,100)",
		position: "absolute",
		height: "4px",
		bottom: "5px",
		right: "8px",
		left: "8px",
		zIndex: "3"
	};
	
	// Component SeriesItems	
	window.wsp.core.seriesItems = {
		exports: [ window.wsp.core.component ],
		
		// Component Propertys
		dicomView: null,
		
		// Component Propertys
		seriesFromStudys: [],
		studysItemImgs: [],
		studysIndex: 0,
		studysItem: [],

		// setInitialize
		setInitialize: function( seriesFromStudys, studysIndex, dicomView, studysItem ){
			return this.setPropertyObject({
				seriesFromStudys: seriesFromStudys,
				studysIndex: studysIndex,
				studysItem: studysItem,
				dicomView: dicomView
			});
		},
		
		// setComponentControls
		setComponentControls: function(){
			this.setComponentControlsInstancesMins();
			this.setComponentControlsInstances();
		},

		// setComponentControlsInstancesMins
		setComponentControlsInstancesMins: function(){
			if( this.int( this.studysIndex ) === 0 ){
				this.dicomView.setComponentControlsSeriesInnterMins(
					this, this.int( this.studysIndex )
				);
			}
		},

		// setComponentControlsInstances
		setComponentControlsInstances: function(){
			this.forEach( this.seriesFromStudys, function( fromStudys ){
				http( "instances", { 
					series_iuid: fromStudys.seriesiuid,
					series_imgs: fromStudys.seriesimgs,
					series_mods: fromStudys.studymods
				}).setInit(
					this.setProxy( function( instancesArgs ){
						this.forEach( instancesArgs, function( instance, instanceIndexPk ){
							http( "imagens", { 
								instancePk: instance.instancePk,
								instanceIndex: instance.instanceIndex,
								instanceSerie: instance.instanceSerie,
								instanceIndexPk: instanceIndexPk,
								instanceHeight: 550 // this.dicomView.dicomViewImagens.getHeight() > 6000,
							}).setInit(
								this.setProxy( function( instanceArgs ){
									if( this.studysItemImgs[ instanceArgs.instanceSerie ] === undefined ){
										this.studysItemImgs[ instanceArgs.instanceSerie ] = [];
									}
									
									// studysItemImgs
									this.studysItemImgs[ instanceArgs.instanceSerie ][ 
										instanceArgs.instanceIndexPk
									] = instanceArgs.instanceImagem;
									
									// Atualizar Barra de Progress
									this.studysItem.studysProgress.setProgressInc();
									
									// Atualizar Barra de Progress das Miniaturas
									this.dicomView.dicomViewSeries.setProgressUpdate(
									 	instanceArgs.instanceSerie, this.int(
											this.studysIndex
										)
									);
									
									// Update studyIndex Imagens
									this.dicomView.dicomViewImagens.setComponentAddStudySerieInstance(
										this.studysIndex, 
										instanceArgs.instanceSerie, 
										instanceArgs.instanceIndexPk, 
										instanceArgs.instanceImagem
									);
								})
							);	
						})
					})
				);
			});
		}		
	};	
	
	// Component StudysItem	
	window.wsp.core.studysItem = {
		exports: [ window.wsp.core.component ],

		// Component Propertys
		dicomView: null,

		// Component Propertys
		studysOpts: [],
		studysIndex: 0,
		studysProgress: [],
		studysItemSeries: [],
		
		// Component Styles
		borderBottom: "1px solid rgb(225,225,225)",
		borderRight: "3px solid rgb(225,225,225)",
		paddingBottom: "8px",
		paddingRight: "5px",
		paddingLeft: "5px",
		paddingTop: "5px",
		fontSize: "10px",
		cursor: "pointer",

		// setInitialize
		setInitialize: function( studysOpts, studysIndex, dicomView ){
			return this.setPropertyObject({
				studysIndex: studysIndex,
				studysOpts: studysOpts,
				dicomView: dicomView
			});
		},
		
		// setComponentControls
		setComponentControls: function(){
			return this.setExecuteMethods({
				setComponentControlsStrutura: [],
				setComponentControlsSeries: []
			});	
		},
		
		// setComponentControls
		setComponentControlsStrutura: function(){
			return this.addComponent(
				this.sprintfobject(
					this.joinArray([ 
						"<div><b>%mods_in_study / %study_desc</b></div>",
						"<div>Data: %study_datetime</div>",
						"<div>Series: %num_series / Instances: %num_instances</div>"
					]), this.studysOpts
				),
				this.studysProgress = studysProgress(
					1, this.studysOpts.num_instances
				)
			)
		},
		
		// setComponentControlsSeries
		setComponentControlsSeries: function(){
			http( "series", { study_pk: this.studysOpts.study_pk }).setInit(
				this.setProxy( function( seriesArgs ){
					this.studysItemSeries = seriesItems(
						seriesArgs, this.studysIndex, this.dicomView, this
					);
				})
			);
		},
		
		// setComponentEvents
		setComponentEvents: function(){
			return this.setExecuteMethods({
				setClick: [ this.setComponentEventLoadSeries ]
			});
		},
		
		// setComponentEventLoadSeries
		setComponentEventLoadSeries: function(){
			this.dicomView.setComponentLoadSerie(
				this.int( this.studysIndex )
			);
		}
	};	
	
	// Component Studys
	window.wsp.core.studys = {
		exports: [ window.wsp.core.component ],

		// Component Propertys
		dicomView: null,
		dicomViewStudys: null,
		
		// Component Styles
		borderRight: "5px solid rgb(225,225,225)",
		backgroundColor: "rgb(245,245,245)",
		position: "absolute",
		bottom: "0px",
		right: "0px",
		left: "0px",
		top: "0px",
		
		// setInitialize
		setInitialize: function( dicomViewStudys, dicomView ){
			return this.setPropertyObject({
				dicomViewStudys: dicomViewStudys,
				dicomView: dicomView
			});
		},
		
		// setComponentControls
		setComponentControls: function(){
			return this.forEach( this.dicomViewStudys, function( dicomViewStudyItem, studysIndex ){
				this.addComponent( studysItem(
					dicomViewStudyItem, studysIndex, this.dicomView
				));
			});
		}
	};

	
	// Component SeriesBox
	window.wsp.core.seriesBox = {
		exports: [ window.wsp.core.component ],
		
		// Component Propertys
		seriesIuid: null,
		dicomView: null,
		
		// Component Propertys
		studysIndex: null,
		studysProgress: null,
		studysProgressCount: null,
		
		// Component Styles
		backgroundColor: "rgb(0,80,130)",
		position: "relative",
		marginRight: "5px",
		cursor: "pointer",
		height: "90px",
		minWidth: "90px",
		
		// setInitialize
		setInitialize: function( studysIndex, studysProgressCount, seriesIuid, dicomView ){
			return this.setPropertyObject({
				studysProgressCount: studysProgressCount,
				studysIndex: studysIndex,
				seriesIuid: seriesIuid,
				dicomView: dicomView
			});
		},
		
		// setComponentControls
		setComponentControls: function(){
			return this.addComponent(
				this.studysProgress = studysProgressMins(
					0, this.studysProgressCount
				)
			)
		},

		// setComponentEvents
		setComponentEvents: function(){
			return this.setExecuteMethods({
				setClick: [ this.setComponentLoadImagens ]
			});
		},
		
		// setComponentLoadImagens
		setComponentLoadImagens: function(){
			this.dicomView.setComponentStudyIndex(
				this.componentIndex, this.seriesIuid
			);
		},
		
		// setUpdateProgressAfter
		setUpdateProgressAfter: function(){
			return this.forEach( this.dicomView.dicomViewStudys.components[ this.studysIndex ].studysItemSeries.studysItemImgs,
				function( seriesItem, seriesIuid ){
					if( this.seriesIuid === seriesIuid ){
						this.studysProgress.setProgressPos(
							seriesItem.length
						);
					}
				}
			);
		}
	};

	// Component CountSeries
	window.wsp.core.countSeries = {
		exports: [ window.wsp.core.component ],
		
		// Component Propertys
		imagemSeries: null,		
		
		// Component Styles
		backgroundColor: "rgb(0,80,130)",
		position: "absolute",
		paddingBottom: "3px",
		paddingRight: "5px",
		paddingLeft: "5px",
		paddingTop: "3px",
		fontSize: "8px",
		bottom: "14px",
		right: "8px",
		color: "#FFF",

		// setInitialize
		setInitialize: function( imagemSeries ){
			return this.setPropertyObject({
				imagemSeries: imagemSeries
			});
		},
		
		// setComponentControls
		setComponentControls: function(){
			return this.setTextContent(
				this.imagemSeries
			);
		}		
	}	

	// Component ImagensSerie
	window.wsp.core.imagensSerie = {
		exports: [ window.wsp.core.component ],
		
		// Component Propertys
		imagemData: null,
		
		// Component Styles
		position: "absolute",
		bottom: "16px",
		right: "8px",
		left: "8px",
		top: "8px",
		
		// setInitialize
		setInitialize: function( imagemData ){
			return this.setPropertyObject({
				imagemData: imagemData
			});
		},

		// setComponentControls
		setComponentControls: function(){
			return this.addComponent( this.sprintf(
				"<img src='%1' style='width:100%; height:68px; cursor:pointer;' />", this.imagemData
			));
		}		
	}

	// Component Series
	window.wsp.core.series = {
		exports: [ window.wsp.core.component ],
		
		// Component Propertys
		dicomView: null,
		
		// Component Styles
		borderTop: "4px solid rgb(210,210,210)",
		backgroundColor: "rgb(240,240,240)",
		justifyContent: "flex-start",
		overflowX: "auto",
		position: "absolute",
		paddingBottom: "5px",
		paddingRight: "5px",
		paddingLeft: "5px",
		paddingTop: "5px",
		height: "106px",
		bottom: "0px",
		right: "0px",
		left: "0px",
		
		// setInitialize
		setInitialize: function( dicomView ){
			return this.setPropertyObject({
				dicomView: dicomView
			});
		},		
		
		// setProgressUpdate
		setProgressUpdate: function( seriesIuid, studyIndex ){
			this.forEach( this.components, function( component ){
				if( component.seriesIuid === seriesIuid ){
					component.studysProgress.setProgressInc();
				}
			});
		},
	};

	// Component imagensBox
	window.wsp.core.imagensInfs = {
		exports: [ window.wsp.core.component ],
		
		// Propertys Styles
		position: "absolute",
		fontSize: "9px",
		zIndex: "2",
		color: "#FFF",
		left: "10px",
		top: "10px",

		// setComponentSrcDataImage
		setComponentImageInfs: function( srcImageInfs, framePos, frameCount ){
			this.handle.innerHTML = this.sprintfobject(
				this.joinArray([ 
					"<div>Paciente: %pat_id - %pat_name</div>",
					"<div>Estudo: %study_desc</div>",
					"<div>Nascimento: %pat_birthdate</div>",
					"<div>Sexo: %pat_sex</div>",
					"<div>Modalidade: %mods_in_study</div>",
					"<div>Médico: %ref_physician</div>",
					"<div>Frame: %framePos / %frameCount</div>",
					"<div>---------------------------------------------------------</div>",
					"<div>Para aplicar CONTRASTE pressione CTRL + SCROLL</div>",
					"<div>Para aplicar BRILHO pressione SHIFT + SCROLL</div>"
				]), this.extend( srcImageInfs, {
					framePos: framePos, frameCount: frameCount
				})
			)
		}
	};
	
	// Component imagensNavItem
	window.wsp.core.imagensNavItem = {
		exports: [ window.wsp.core.component ],
		
		// Component Propertys
		dicomView: null,
		
		// Component Propertys
		iconItem: null,
		iconEvent: null,

		// Propertys Styles
		backgroundColor: "rgb(0,80,130)",
		justifyContent: "center",
		marginRight: "5px",
		cursor: "pointer",
		height: "24px",
		width: "24px",
		
		// setInitialize
		setInitialize: function( dicomView, iconItem, iconEvent ){
			return this.setPropertyObject({
				dicomView: dicomView,
				iconItem: iconItem,
				iconEvent: iconEvent
			});			
		},
		
		// setComponentControls
		setComponentControls: function(){
			if( this.iconItem !== null ){
				this.addComponent( icon(
					this.iconItem, 16, 16
				));
			}
		},
		
		// setComponentClick
		setComponentClick: function(){
			if( this.iconEvent !== null ){
				this.iconEvent();
			}
		},
		
		// setComponentEvents
		setComponentEvents: function(){
			return this.setExecuteMethods({
				setClick: [ this.setComponentClick ]
			});
		}
	}	
	
	// Component imagensNavs
	window.wsp.core.imagensNavs = {
		exports: [ window.wsp.core.component ],
		
		// Component Propertys
		imagens: null,

		// Propertys Styles
		justifyContent: "flex-start",
		position: "absolute",
		height: "24px",
		zIndex: "2",
		color: "#FFF",
		left: "10px",
		bottom: "10px",		
		
		// setInitialize
		setInitialize: function( imagens ){
			return this.setPropertyObject({
				imagens: imagens
			});			
		},
		
		// setComponentPrint
		setComponentPrint: function(){},
		
		// setComponentPrev
		setComponentPrev: function(){
			this.imagens.setComponentPrev();
		},		
		
		// setComponentPlay
		setComponentPlay: function(){
			this.imagens.setComponentPlay();
		},
		
		// setComponentStop
		setComponentStop: function(){
			this.imagens.setComponentStop();
		},	

		// setComponentNext
		setComponentNext: function(){
			this.imagens.setComponentNext();
		},		
			
		// setComponentControls	
		setComponentControls: function(){
			return this.addComponent(
				// imagensNavItem( this.dicomView, "print", this.setProxy( this.setComponentPrint )),
				// imagensNavItem( this.dicomView, "whatsapp" ),
				// imagensNavItem( this.dicomView, "envelope-square" ),
				imagensNavItem( this.dicomView, "backward", this.setProxy( this.setComponentPrev )),
				imagensNavItem( this.dicomView, "play-circle", this.setProxy( this.setComponentPlay )),
				imagensNavItem( this.dicomView, "stop-circle", this.setProxy( this.setComponentStop )),
				imagensNavItem( this.dicomView, "forward", this.setProxy( this.setComponentNext ))
			);
		}
	};
	
	// Component imagensScrollVertical	
	window.wsp.core.imagensScrollVerticalBar = {
		exports: [ window.wsp.core.component ],
		
		// Component Propertys
		dicomView: null,		
		
		// Component Propertys
		imagemIndex: null,
		imagensLength: null,
		
		// Component Styles
		backgroundColor: "rgb(0,80,130)",
		justifyContent: "center",
		position: "absolute",
		height: "16px",
		width: "16px",
		zIndex: "3",
		right: "5px",
		top: "16px",
		
		// setInitialize
		setInitialize: function( dicomView ){
			return this.setPropertyObject({
				dicomView: dicomView
			});			
		},
		
		// setComponentControls
		setComponentControls: function(){
			return this.addComponent(
				icon( "bars", 12, 12 )
			);
		},
		
		// setComponentScrollBarPositionCalc
		setComponentScrollBarPositionCalc: function( imagemIndex, imagensLength ){
			return ((( this.dicomView.getHeight() - ( 16 * 2 )) / imagensLength ) 
				* imagemIndex ) + 16;
		},
		
		// setComponentScrollBarPosition
		setComponentScrollBarPosition: function( imagemIndex, imagensLength ){
			return this.setProperty({ top: this.getPixel(
				this.setComponentScrollBarPositionCalc(
					this.imagemIndex = imagemIndex,
					this.imagensLength = imagensLength
				)
			)});
		}
	};	

	// Component imagensScrollVertical	
	window.wsp.core.imagensScrollVertical = {
		exports: [ window.wsp.core.component ],
		
		// Component Propertys
		scrollVerticalBar: null,		
		
		// Component Styles
		borderBottom: "1px solid #FFF",
		borderRight: "1px solid #FFF",
		borderLeft: "1px solid #FFF",
		borderTop: "1px solid #FFF",
		position: "absolute",
		overflowX: "hidden",
		bottom: "10px",
		right: "10px",
		width: "6px",
		zIndex: "2",
		top: "10px"
	};
	
	// Component imagensBox
	window.wsp.core.imagensBox = {
		exports: [ window.wsp.core.component ],
		
		// Propertys Styles
		backgroundColor: "rgb(0,0,0)",
		justifyContent: "center",
		position: "absolute",
		zIndex: "1",
		bottom: "0px",
		right: "0px",
		left: "0px",
		top: "0px",

		// setComponentSrcDataImage
		setComponentSrcDataImage: function( srcDataImage, contrasts, brightness ){
			this.handle.innerHTML = this.sprintf( 
				"<img src='%1' height='%4' style='filter: contrast(%2) brightness(%3)' />", 
					srcDataImage, contrasts, brightness, this.getPixel( this.getHeight())
			);			
		}
	};	
	
	// Component Imagens
	window.wsp.core.imagens = {
		exports: [ window.wsp.core.component ],
		
		// Component Propertys
		dicomView: null,		
		
		// Propertys
		studysPlay: null,
		studysList: [],
		seriesIuid: null,
		studysIndex: null,
		studysListSeries: null,
		studysListImagemIndex: 0,
		studysListImageContrasts: 1,
		studysListImageBrightness: 1,
		
		// Propertys
		studysListImagemBox: null,
		studysListImageInfs: null,
		studysListImagensNavs: null,
		studysListImagensScroll: null,
		
		// Propertys Styles
		position: "absolute",
		bottom: "0px",
		right: "0px",
		left: "0px",
		top: "0px",
		
		// setInitialize
		setInitialize: function( dicomView ){
			return this.setPropertyObject({
				dicomView: dicomView
			});
		},		
		
		// setComponentControls
		setComponentControls: function(){
			return this.addComponent(
				this.studysListImagemBox = imagensBox( this ),
				this.studysListImageInfs = imagensInfs( this ),
				this.studysListImagensNavs = imagensNavs( this ),
				this.studysListImagensScroll = imagensScrollVertical( this ),
				this.studysListImagensScrollBar = imagensScrollVerticalBar( this )
			);
		},
		
		// setComponentAddStudySerieInstance
		setComponentAddStudySerieInstance: function( studysIndex, seriesIuid, imagemIndex, imagemString ){
			// define studysList Index
			if( this.studysList[ this.int( studysIndex )] === undefined )
				this.studysList[ this.int( studysIndex )] = [];
			// define studysList Index / Series 
			if( this.studysList[ this.int( studysIndex )][ seriesIuid ] === undefined )
				this.studysList[ this.int( studysIndex )][ seriesIuid ] = [];
			
			// define studysList Index / Series / Index / imagemString
			this.studysList[ this.int( studysIndex )][ seriesIuid ][ imagemIndex ] = imagemString;
		},
		
		// setComponentShowImagensFromSeries
		setComponentShowImagensFromSeries: function( studysIndex, seriesIuid, imagemIndex, contrasts, brightness ){
			this.studysListImagemBox.setComponentSrcDataImage(
				this.studysList[ this.studysIndex = this.int( studysIndex  )][ 
					this.seriesIuid = seriesIuid 
				][ this.studysListImagemIndex = imagemIndex ], 
				this.studysListImageContrasts = contrasts,
				this.studysListImageBrightness = brightness
			);
			
			// show informações
			this.studysListImageInfs.setComponentImageInfs(
				this.dicomView.dicomStudys[ this.studysIndex ], 
				this.studysListImagemIndex + 1,
				this.studysList[ this.studysIndex = this.int( studysIndex  )][ 
					this.seriesIuid = seriesIuid 
				].length
			);
			
			// update scrollbar positions
			this.studysListImagensScrollBar.setComponentScrollBarPosition(
				this.studysListImagemIndex, this.studysList[ this.studysIndex ][ 
					this.seriesIuid
				].length
			);
			
			// return component
			return this;
		},
		
		// setComponentEvents
		setComponentEvents: function(){
			return this.setExecuteMethods({
				setMousewheel: [ this.setComponentEventMouseWheel ],
				setKeypress: [ this.setComponentEventKeypress ]
			});
		},
		
		// setComponentImagePrev
		setComponentImagePrev: function(){
			return this.studysListImagemIndex !== 0
				? this.studysListImagemIndex - 1 : this.studysList[ this.studysIndex ][ this.seriesIuid ].length - 1;
		},		
		
		// setComponentImageNext
		setComponentImageNext: function(){
			return this.studysListImagemIndex < this.studysList[ this.studysIndex ][ this.seriesIuid ].length - 1
				? this.studysListImagemIndex + 1 : 0;
		},
		
		// setComponentEventMouseWheel
		setComponentEventMouseWheel: function( args ){
			if( args.shiftKey === false && args.ctrlKey === false ){
				if( args.deltaY === -100 ){
					this.studysListImagemIndex = this.setComponentImagePrev();
				} else 
				if( args.deltaY === 100 ){
					this.studysListImagemIndex = this.setComponentImageNext();				
				}
			} else 
			if( args.ctrlKey === true ){
				if( args.deltaY === -100 ){
					this.studysListImageContrasts > 0 ? this.studysListImageContrasts = this.studysListImageContrasts - 0.1 : 0;
				} else
				if( args.deltaY === 100 ){
					this.studysListImageContrasts < 3 ? this.studysListImageContrasts = this.studysListImageContrasts + 0.1 : 3;
				}
			} else 
			if( args.shiftKey === true ){
				if( args.deltaY === -100 ){
					this.studysListImageBrightness > 0 ? this.studysListImageBrightness = this.studysListImageBrightness - 0.1 : 0;
				} else
				if( args.deltaY === 100 ){
					this.studysListImageBrightness < 3 ? this.studysListImageBrightness = this.studysListImageBrightness + 0.1 : 3;
				}
			}	
			
			// setComponentShowImagensFromSeries
			this.setComponentShowImagensFromSeries(
				this.studysIndex, 
				this.seriesIuid,
				this.studysListImagemIndex,
				this.studysListImageContrasts,
				this.studysListImageBrightness
			);
			
			// preventDefault
			args.preventDefault();
		},
		
		// setComponentEventKeypress
		setComponentEventKeypress: function( args ){},
		
		// setComponentPrev
		setComponentPrev: function(){
			return this.setComponentShowImagensFromSeries(
				this.studysIndex,
				this.seriesIuid, 
				this.setComponentImagePrev(),
				this.studysListImageContrasts,
				this.studysListImageBrightness
			);
		},		

		// setComponentPlay
		setComponentPlay: function(){
			this.studysPlay = window.setTimeout( this.setProxy(	function(){
				this.setComponentShowImagensFromSeries(
					this.studysIndex,
					this.seriesIuid, 
					this.setComponentImageNext(),
					this.studysListImageContrasts,
					this.studysListImageBrightness
				).setComponentPlay();
			}), 66 );
		},
		
		// setComponentStop
		setComponentStop: function(){
			window.clearTimeout( this.studysPlay );
		},
		
		// setComponentNext
		setComponentNext: function(){
			return this.setComponentShowImagensFromSeries(
				this.studysIndex,
				this.seriesIuid, 
				this.setComponentImageNext(),
				this.studysListImageContrasts,
				this.studysListImageBrightness
			);
		}		
	}	

	
	// Component DicomView
	window.wsp.core.dicomView = {
		exports: [ window.wsp.core.component ],

		// Component Propertys
		dicomStudys: 0,
		dicomStudyIndex: 0,
		dicomViewStudys: null,
		dicomViewImagens: null,
		dicomViewSeries: null,
		dicomViewBox: null,
		
		// Component Styles
		position: "absolute",
		bottom: "0px",
		right: "0px",
		left: "0px",
		top: "0px",		
		
		// setInitialize
		setInitialize: function( dicomStudys ){
			return this.setPropertyObject({
				dicomStudys: dicomStudys
			});
		},
		
		// setComponentControls
		setComponentControls: function(){
			return this.addComponent(
				frame( 0 ).addComponent(
					frameCols( 175 ).addComponent(
						this.dicomViewStudys = studys(
							this.dicomStudys, this
						)
					),
					frameCols( 0 ).addComponent(
						frame( 0 ).addComponent(
							frameRows( 0 ).addComponent(
								this.dicomViewImagens = imagens( this )
							),
							frameRows( 106 ).addComponent(
								this.dicomViewSeries = series( this	)
							)
						)
					)
				)			
			);
		},
		
		// dicomViewSeriesClear
		dicomViewSeriesClear: function(){
			this.dicomViewSeries.setFreeMemoryChilds();
			return this;
		},
		
		// setComponentControlsSeriesInnterMins
		setComponentControlsSeriesInnterMins: function( seriesItems, studysIndex ){
			return this.dicomViewSeriesClear().forEach( seriesItems.seriesFromStudys, function( seriesFromStudys, index ){
				return this.dicomViewSeries.addComponent(
					seriesBox( studysIndex, seriesFromStudys.seriesimgs, seriesFromStudys.seriesiuid, this ).addComponent( 
						imagensSerie( seriesFromStudys.imagebase ),
						countSeries( seriesFromStudys.seriesimgs )
					).setUpdateProgressAfter()
				);
			});
		},
		
		// setComponentLoadSerie
		setComponentLoadSerie: function( studyIndex ){
			this.setComponentControlsSeriesInnterMins(
				this.dicomViewStudys.components[ 
					this.dicomStudyIndex = studyIndex
				].studysItemSeries, studyIndex
			);
		},
		
		// setComponentStudyIndex
		setComponentStudyIndex: function( index, seriesIuid ){
			this.dicomViewImagens.setComponentShowImagensFromSeries(
				this.dicomStudyIndex, seriesIuid, 0, 1, 1
			);
		}
	};	

})( window ); 