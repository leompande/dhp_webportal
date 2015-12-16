<?php
include_once('functions.php');
// Check if  file is a csv
if(isset($_GET["file"])) { $test_variable = "for upload";
	$target_file = $_GET['new_file_name'];

	$target_dir = "../uploads/";
	$target_file = $target_dir . basename($target_file);
	$uploadOk = 1;
	$fileType = pathinfo($target_file,PATHINFO_EXTENSION);
  if (file_exists($target_file)) {

      echo "FILE_EXIST_ERROR";

    $uploadOk = 0;
  }else{
			
	if($fileType != "pdf") {
		echo "INVALID_TYPE_ERROR";
		$uploadOk = 0;
		}else{

		if($dhp::uploadFile($_FILES["file"]["tmp_name"],$target_file)){
            echo "UPLOAD_SUCCESS";
		   }else{
           echo "UPLOAD_FAILED";
        }

		}
			
			
  }

}

if(isset($_GET["csv_output"])) { 
	$csv_file = "../downloads/datavalueset.csv";
	DhpFile::queryTheDatabase('report_container',$csv_file);
	
	}

if(isset($_GET["list_files"])){
    $file_list = $dhp->getAppropiatePdfFiles();
    echo json_encode($file_list);

}


if(isset($_GET["by_year"])&&isset($_GET["by_orgunit"])){
    $file_list = $dhp->getAppropiatePdfFiles();
    array_shift($file_list);
    array_shift($file_list);
    $available_files = array();
    foreach($file_list as $index=>$value){
        $orgUnit_array = explode("_",$value);
        if(is_array($orgUnit_array)){
//            echo $orgUnit_array[1]."  -->  ".$_GET["by_orgunit"];
            $orgUnit_array_year = explode(".",$orgUnit_array[2]);
            if($_GET["by_year"]==$orgUnit_array_year[0]&&($orgUnit_array[0]==$_GET["by_orgunit"]||$orgUnit_array[1]==$_GET["by_orgunit"])){
                array_push($available_files,$value);
            }
        }

    }
    echo json_encode($available_files);

}

if(isset($_GET['only'])&&isset($_GET["by_year"])){
    $file_list_by_year = $dhp->getAppropiatePdfFiles();
    array_shift($file_list_by_year);
    array_shift($file_list_by_year);
    $available_files = array();
    foreach($file_list_by_year as $index=>$value){
        $orgUnit_array = explode("_",$value);
        if(is_array($orgUnit_array)){

            $orgUnit_array_year = explode(".",$orgUnit_array[2]);
            if($_GET["by_year"]==$orgUnit_array_year[0]){
                array_push($available_files,$value);
            }
        }

    }
    echo json_encode($available_files);

}

if(isset($_GET['only'])&&isset($_GET["by_orgunit"])){
    $file_list = $dhp->getAppropiatePdfFiles();
    echo json_encode($file_list);

}


if(isset($_GET["delete"])){
    if($dhp->deleteFile($_GET["delete"])){
        echo "DELETE SUCCESS";
    }else{
        echo "DELETE FAILURE";
    }
}

if(isset($_GET["list_files"])&&isset($_GET["orgunit"])&&isset($_GET["year"])){
    $file_list = $dhp->getAppropiatePdfFiles();
    echo json_encode($file_list);

}


?>
