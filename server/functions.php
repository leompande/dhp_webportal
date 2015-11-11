<?php
session_start(); 
include_once('functions.php');

class DhpFile { 
        
        public static $directional_image="iVBORw0KGgoAAAANSUhEUgAAAfMAAABeCAIAAAC4mGqYAAAACXBIWXMAABcSAAAXEgFnn9JSAAAA";


		/**
		 *  Delete file function
		 * */
		 
		public static function deleteFile($file_path){
		if (!unlink($file_path))
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
							
				return false;
			}
					
		
		} 
		
		
		/**
		 *  This function process Uploads for DHIS
		 * */
		 
		public static function processUploadsForDHIS($target_file,$period,$orgUnit,$category,$attributeoptioncombo){
			$csv_file = "../downloads/datavalueset.csv";
			$json_object = [];
				$file_handle = fopen($target_file, 'r');
				while (!feof($file_handle) ) {
					$line_of_text[] = fgetcsv($file_handle);
				}
				fclose($file_handle);
				
				//~ $available_fields = array('Foreword_Field','Acknowledgements_Field','Executive_Field','Mission_Field','Structure_Field','Facility_Field','Population_Field','Geography_Field','Transportation_Field','Education_Field','DataCollection_Field','KeyMessages_Field','HealthStatusOfPopulation_Field','Morbidity_Field','DistrictHealthStatus_Field','StatusOfHealthServiceDelivery_Field','VaccinationServices_Field','ReproductiveHealthServices_Field','InfectionDisease_Field','DistrictHealthServiceDelivery_Field','StatusOfDistrictHealthSystems_Field','HumanResourcesForHealth_Field','MedicinesDrugs_Field','Infrastructure_Field','DistrictHealthSystemConclusions_Field','Recommendations_Field');
				$available_fields = array('Foreword_Field','Acknowledgements_Field','Executive_Field','Mission_Field','Structure_Field','Facility_Field','Population_Field');
				$dataelements = array('cKRsMKICQez','edyxVWaBAhu','NL6LIVRNlFI','VuF0VIZMQsh','zunP9DXYltg','CXZmOyNVjSe','BP7gXfZfQrl');
				
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

				DhpFile::saveDataToCSVFile('report_container',$json_object,$available_fields,$period,$orgUnit,$category,$attributeoptioncombo);
				DhpFile::send_CSV_To_Dhis($csv_file);
					return $json_object;
					
		}
		
		
		/**
		 *  This function creates temporary database table 
		 * */
		 
		public static function saveDataToCSVFile($table_name,$json_object,$available_fields,$period,$orgUnit,$category,$attributeoptioncombo){
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

			} 
} 

$dhp = new DhpFile;
?>
