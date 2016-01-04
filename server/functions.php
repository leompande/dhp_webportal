<?php
session_start(); 
include_once('functions.php');

class DhpFile { 
        
        public static $directional_image="iVBORw0KGgoAAAANSUhEUgAAAfMAAABeCAIAAAC4mGqYAAAACXBIWXMAABcSAAAXEgFnn9JSAAAA";
        public static $dir = "../uploads/";

		/**
		 *  Delete file function
		 * */
		 
		public static function deleteFile($file_path){

		if (!unlink(DhpFile::$dir."/".$file_path))
		  {
		  return false;
		  }
		else
		  {
		  return true;
		  }
		
		}
		
		/**
		 *  File Uploads function 
		 * */
		 
		public static function uploadFile($file_path,$target_file){

		if (move_uploaded_file($file_path, $target_file)) {
			    return true;
			} else {
//            return false;
            echo move_uploaded_file($file_path, $target_file);
			}
					
		
		} 
		
		
		/**
		 *  This function process Uploads for DHIS
		 * */
		 
		public static function processUploadsForDHIS($target_file,$period,$orgUnit,$category,$attributeoptioncombo,$names,$uids){
			$csv_file = "../downloads/datavalueset.csv";
			$json_object = [];
				$file_handle = fopen($target_file, 'r');
				while (!feof($file_handle) ) {
					$line_of_text[] = fgetcsv($file_handle);
				}
				fclose($file_handle);

//				$available_fields = array('Foreword_Field','Acknowledgements_Field','Executive_Field','Mission_Field','Structure_Field','Facility_Field','Population_Field');
//				$dataelements = array('cKRsMKICQez','edyxVWaBAhu','NL6LIVRNlFI','VuF0VIZMQsh','zunP9DXYltg','CXZmOyNVjSe','BP7gXfZfQrl');
//

//                $available_fields = $names;
//				$dataelements = $uids;
                $available_fields = array();
                $names = array("DHP_Maternal_MaternalNCHealthLowBWYear3", "DHP_Demographics_Year1", "DHP_Morbidity_MortalityTopTenDeathYear2", "DHP_Mortality_MortalityTopTenDeathYear3", "DHP_Maternal_MaternalNCHealthNeonatalMortalityYear2", "DHP_Demographics_Male2", "DHP_Maternal_MaternalNCHealthUnder5MortalityYear3", "DHP_Maternal_MaternalNCHealthInfantMortalityTarget", "DHP_Maternal_MaternalNCHealthLowBWTarget", "DHP_Demographics_Year2", "DHP_Maternal_MaternalNCHealthLowBWProgress", "DHP_Demographics_Year3", "DHP_Demographics_Female6", "DHP_Morbidity_MorbidityTopTenAdmissionYear2", "DHP_Demographics_Male5", "DHP_Demographics_FacilityDistrictImage", "DHP_Maternal_MaternalNCHealthNeonatalMortalityYear1", "DHP_Demographics_Female4", "DHP_Maternal_MaternalNCHealthNeonatalMortalityYear3", "DHP_Morbidity_MorbidityIncidenceOfMalariaTarget", "DHP_Maternal_MaternalNCHealthNeonatalMortalityTarget", "DHP_Morbidity_MorbidityHIVAIDSTarget", "DHP_Morbidity_MorbidityHIVAIDSYear1", "DHP_Demographics_Male3", "DHP_Morbidity_MorbidityIncidenceOfMalariaYear1", "DHP_Demographics_Female3", "DHP_Morbidity_MorbidityIncidenceOfMalariaYear2", "DHP_Mortality_MortalityTopTenDeathYear2", "DHP_Demographics_Female1", "DHP_Demographics_Male4", "DHP_Morbidity_MorbidityIncidenceOfMalariaProgress", "DHP_Morbidity_MorbidityIncidenceOfMalariaYear3", "DHP_Maternal_MaternalNCHealthUnder5MortalityTarget", "DHP_Maternal_MaternalNCHealthUnder5MortalityYearProgress", "DHP_Morbidity_MorbidityTopTenAdmissionYear3", "DHP_Maternal_MaternalNCHealthUnder5MortalityYear1", "DHP_Maternal_MaternalNCHealthUnder5MortalityYear2", "DHP_Demographics_Male6", "DHP_Demographics_Female2", "DHP_Mortality_MortalityTopTenDeathYear1", "DHP_Demographics_Male1", "DHP_Maternal_MaternalNCHealthLowBWYear1", "DHP_Maternal_MaternalNCHealthLowBWYear2", "DHP_Maternal_MaternalNCHealthNeonatalMortalityProgress", "DHP_Morbidity_MorbidityTopTenAdmissionYear1", "DHP_Maternal_MaternalNCHealthInfantMortalityProgress", "DHP_Demographics_Female5");
				$dataelements = array("hUDp8nEM9Xu", "qArNNjNQAU3", "P1WyuyEjfrt", "BiBYNFnGQF5", "i10R7abb5e7", "JGUAedwTS7d", "D0rd3jqvJhj", "rywiKuhcXhi", "vYOcXPnPkwG", "y2MB317ssba", "Pcly4O4zwMP", "YsIoPcj149W", "pimD9Vu6yzP", "R40i7n5fP73", "W24P1amkarT", "ZVxkbmmsVaj", "C0sro0yymAc", "khpsCb4CIYO", "r18DK7WrGqq", "sbf2nYVcjcz", "QeIvaNVBt7L", "YOXye8N0kG7", "sdBEFTUgED5", "VIPWPCH888c", "Z9NTYlGv5xq", "yEQ4pUa4MiE", "FsdeelM8RBt", "IrjePU1LBSM", "a3KTj2U3qvL", "kFUWBguaZH2", "oG4bnfukOXH", "QfeqQeCDTYp", "ah6hNUZbKGw", "TgG1AVvdY6N", "n7Nol8M8dki", "rJGgyqtOFqS", "wYxHjV46Aam", "NlFp3YFxAVj", "Mb5oqaqrlEO", "kLSuPxhQZ83", "cO13bJmbwcm", "Fw0Oi3mnCxq", "O9JWxhhhpUL", "cHDQiQJRc3q", "i6g11NJiXp5", "IyYYHTT74Qg", "b3MDBc5qVwA");

                foreach($names as $index => $data_array){

                        $news_data_array = explode("_",$data_array);
                        $available_fields[$index] = $news_data_array[2];
                }

				$file_extension = "";
				$file_name = "";
				$count = 0;
				foreach ($line_of_text[0] as $key => $value)
				{
					$field_value = $line_of_text[1][$key];
					if(substr($field_value, -4)==".pdf"){
						$file_extension = substr($field_value, -4);
						$file_name	=	substr($field_value, 0, strlen($field_value)-4);
						}
						
						
					if(strpos($value,'Field',0)>0){
						if(strpos($value,'ImageField')>=0){
						$key = array_search($value, $available_fields);
								
							if(strpos($field_value,"content here...")>0){
								
								}else{
							    array_push($json_object,array($value=> $field_value.strpos($value,"content here...")));
								}
								
							}
								
						if(strpos($target_file,$file_name)>0){
					
						}
						
					
						}
					}

				DhpFile::saveDataToCSVFile('report_container',$json_object,$available_fields,$period,$available_fields,$dataelements,$orgUnit,$category,$attributeoptioncombo);
				DhpFile::send_CSV_To_Dhis($csv_file);
					return $json_object;
					
		}
		
		
		/**
		 *  This function creates temporary database table 
		 * */
		 
		public static function saveDataToCSVFile($table_name,$json_object,$available_fields,$period,$names,$uids,$orgUnit,$category,$attributeoptioncombo){
			$csv_file = "../downloads/datavalueset.csv";
			$query_string = "";
			$csv_array = array();
			foreach($available_fields as $field){
					
				foreach($json_object as $json_value){
					if (array_key_exists($field, $json_value)) {
						$csv_array[$field] = $json_value[$field];
						}else{
							
							}
				
				}
				
				}
				
		if (file_exists($csv_file)) {    
					DhpFile::deleteFile($csv_file);			   				
						
			}
			
			$file = fopen($csv_file,"w");
			
			$countTitle = 0;
			$Headers = array('dataelement','period','orgunit','categoryoptioncombo','attributeoptioncombo','value');//,'storedby','lastupdated','comment','followup');
			$available_fields = array('Foreword_Field','Acknowledgements_Field','Executive_Field','Mission_Field','Structure_Field','Facility_Field','Population_Field');
			$dataelements = array('cOlccul1xHM','TLGv43tBdwj','fluC6PKRa0w','ZwsmiJLZlQ7','XUYAGxeSW3Q','Z4FEfArOpVt','hgZ2GIhRFlw');
				
			$colCount = count($Headers);
			$headers = "";
			foreach ($Headers as $key => $line){
				$countTitle++;
				$headers.=$line;
				if($countTitle==$colCount){
					
					}else{
						$headers.=",";
						}
						  
			}
			fputcsv($file,explode(',',$headers));
			//~ $period="2013";

			$forRows = 0;
			$rowsValues = "";
			$countRound=0;
			foreach ($csv_array as $key => $line){
				$colCounter = 0;
				foreach ($Headers as $key => $line2){
					
					
					if($colCounter==0){
						$rowsValues.=$dataelements[$countRound];
						}
						
					if($colCounter==1){
						$rowsValues.=$period;
						}
						
					if($colCounter==2){
						$rowsValues.=$orgUnit;
						}
						
					if($colCounter==3){
						$rowsValues.=$category;
						}
						
					if($colCounter==4){
						$rowsValues.=$attributeoptioncombo;
						}
						
					if($colCounter==5){
						$rowsValues.=$line;
						}
						
					if($colCounter==6){
						$rowsValues.="Admin";
						}
						
					if($colCounter==7){
						$rowsValues.="2015-11-10T07:12:31.774+0000";
						}
						
					if($colCounter==8){
						$rowsValues.="Uploaded From DHP Portal";
						}
						
					if($colCounter==9){
						$rowsValues.="FALSE";
						}
						
						
						$colCounter++;
					if($colCounter>=$colCount){
						fputcsv($file,explode(',',$rowsValues));
						$rowsValues="";
						$countRound++;
						$colCounter=0;
						}else{
						$rowsValues.=",";
							}
					
					}
						  
			}
			
			fclose($file); 
				
				return $csv_file;
			
			}
		
		/**
		 *  This function creates temporary database table 
		 * */
		 
		public static function createTemporalyTable($table_name,$available_fields){
			}
		
		/**
		 *  Drop temporary database table 
		 * */
		 
		public static function dropTemporalyTable($table_name){

			}
		
		public static function queryTheDatabase($table_name,$csv_file){
				
				$json_object = [];
				$file_handle = fopen($csv_file, 'r');
				while (!feof($file_handle) ) {
					$line_of_text[] = fgetcsv($file_handle);
				}
				fclose($file_handle);
				
				
				$file_extension = "";
				$file_name = "";
				$count = 0;
				foreach ($line_of_text as $key => $value)
				{
					return json_encode($value[0]);
				}
					
				
				
				
				
			}

		public static function send_CSV_To_Dhis($csv_file){
		                $old_path = getcwd();
						chdir('/var/www/html/dhp_portal/downloads');
						$output = shell_exec('./pushdatavalue.sh');
						chdir($old_path);
//            echo $csv_file;

			}

    public function getAppropiatePdfFiles(){

        $file_system = scandir(DhpFile::$dir);

        return $file_system;
    }
} 

$dhp = new DhpFile;
?>
