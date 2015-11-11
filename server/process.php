<?php
include_once('functions.php');
// Check if  file is a csv
if(isset($_POST["submit"])) { $test_variable = "for upload";
	$period = $_POST['period'];
	$orgUnit= $_POST['org_unit'];
    $category = "uGIJ6IdkP7Q";
    $attributeoptioncombo = "uGIJ6IdkP7Q";
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
						
						$_SESSION['dhp'] = $dhp::processUploadsForDHIS($target_file,$period,$orgUnit,$category,$attributeoptioncombo);
				}else{
						
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
					$_SESSION['dhp'] = $dhp::processUploadsForDHIS($target_file,$period,$orgUnit,$category,$attributeoptioncombo);
			   }else{
					
			   }
		}
			
			
  }

header( 'Location:../' );
}

if(isset($_GET["csv_output"])) { 
	$csv_file = "../downloads/datavalueset.csv";
	DhpFile::queryTheDatabase('report_container',$csv_file);
	
	}
?>
