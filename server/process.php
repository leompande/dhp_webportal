<?php
include_once('functions.php');
$test_variable = "not set";
// Check if  file is a csv
if(isset($_POST["submit"])) { $test_variable = "for upload";
	$target_dir = "../uploads/";
$target_file = $target_dir . basename($_FILES["dhp_source_file"]["name"]);
$uploadOk = 1;
$fileType = pathinfo($target_file,PATHINFO_EXTENSION);
  if (file_exists($target_file)) {
    
	if($dhp::deleteFile($target_file)){
		
		if($fileType != "csv") {
				echo "NONE_CSV_ERR";
				$uploadOk = 0;
		 }else{					
				if($dhp::uploadFile($_FILES["dhp_source_file"]["tmp_name"],$target_file)){
						
						$dhp::processUploadsForDHIS($target_file);
				}else{
						echo $dhp::uploadFile($_FILES["dhp_source_file"]["tmp_name"],$target_file);
				}
		}
				
   }else{
		echo "NOT DELETED";	
   }
    
        
    $uploadOk = 0;
  }else{
			
	if($fileType != "csv") {
					echo "NONE_CSV_ERR";
					$uploadOk = 0;
		}else{					
			  if($dhp::uploadFile($_FILES["dhp_source_file"]["tmp_name"],$target_file)){						
					$dhp::processUploadsForDHIS($target_file);
			   }else{
					echo $dhp::uploadFile($_FILES["dhp_source_file"]["tmp_name"],$target_file);
			   }
		}
			
			
  }
}

if(isset($_GET["csv_output"])) { 
	echo $test_variable;
	}
?>
