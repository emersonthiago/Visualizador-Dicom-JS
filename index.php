<!DOCTYPE html>
<html class="html" lang="pt-BR">
<head>
	<meta charset="utf-8" />
	<title>Dicom Server</title>
	<meta content="IE=Edge">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
	<meta name="viewport" content="width=1,initial-scale=1" />
	<style>
		::-webkit-scrollbar {
		  width: 6px;
		  height: 6px;
		}
		::-webkit-scrollbar-track {
		  background: #f1f1f1;
		}
		::-webkit-scrollbar-thumb {
		  background: rgb(160,160,160);
		}
		::-webkit-scrollbar-thumb:hover {
		  background: rgb(0,80,130);
		}	
	</style>	
	<script src="./scripts/wsp-core.js?v=<?php echo str_shuffle( 'QAZWSXEDCRFVTGBYHNUJMIKOLP0123456789#' ); ?>"></script>
	<script src="./scripts/wsp-objs.js?v=<?php echo str_shuffle( 'QAZWSXEDCRFVTGBYHNUJMIKOLP0123456789#' ); ?>"></script>
	<script>
		window.initapps(() => {
			http( "studys", { pat_id: <?php echo $_GET[ "patient" ]; ?> }).setInit(( dicomViewStudys ) => {
				apps().addComponent(
					content().addComponent(
						dicomView( dicomViewStudys )
					)
				);
			});
		});
	</script>
</head>
<body>
</body>
</html>